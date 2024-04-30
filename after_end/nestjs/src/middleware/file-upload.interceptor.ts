import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { transformException } from '@nestjs/platform-express/multer/multer/multer.utils';
import { NextFunction, RequestHandler } from 'express';
import multer, { StorageEngine, diskStorage } from 'multer';
import { Logger } from '@app/utils/logger';
import { Observable } from 'rxjs';
import { randomUUID, createHash } from 'node:crypto';
import { AuthRequest } from '@app/middleware/auth.guard';
import { UploadFile, File, Route, UploadFieldName } from '@app/interfaces/asset.interface';
import { AssetService } from '@app/services/asset.service';

export function mapToUploadFile(file: File): UploadFile {
  return {
    uuid: file.uuid,
    checksum: file.checksum,
    originalPath: file.path,
    originalName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
    size: file.size,
  };
}

type DiskStorageCallback = (error: Error | null, result: string) => void;

type MulterFile = Express.Multer.File & { uuid: string };

interface Callback<T> {
  (error: Error): void;
  (error: null, result: T): void;
}

const callbackify = <T>(target: (...arguments_: any[]) => T, callback: Callback<T>) => {
  try {
    return callback(null, target());
  } catch (error: Error | any) {
    return callback(error);
  }
};

const asRequest = (request: AuthRequest, file: Express.Multer.File) => {
  return {
    auth: request.user || null,
    fieldName: file.fieldname as UploadFieldName,
    file: mapToUploadFile(file as File),
  };
};

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  private logger = new Logger(FileUploadInterceptor.name);
  private handlers: {
    userProfile: RequestHandler;
    assetUpload: RequestHandler;
  }
  private defaultStorage: StorageEngine;

  constructor(
    private reflect: Reflector,
    private assetService: AssetService,
  ) {
    this.defaultStorage = diskStorage({
      filename: this.filename.bind(this),
      destination: this.destination.bind(this),
    });

    const instance = multer({
      fileFilter: this.fileFilter.bind(this),
      storage: {
        _handleFile: this.handleFile.bind(this),
        _removeFile: this.removeFile.bind(this),
      },
    });

    this.handlers = {
      userProfile: instance.single(UploadFieldName.PROFILE_DATA),
      assetUpload: instance.fields([
        { name: UploadFieldName.ASSET_DATA, maxCount: 1 },
      ]),
    };
  }

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const context_ = context.switchToHttp();
    const route = this.reflect.get<string>(PATH_METADATA, context.getClass());

    const handler: RequestHandler | null = this.getHandler(route as Route);

    if (handler) {
      await new Promise<void>((resolve, reject) => {
        const next: NextFunction = (error) => (error ? reject(transformException(error)) : resolve());
        handler(context_.getRequest(), context_.getResponse(), next);
      });
    } else {
      this.logger.warn(`跳过无效的文件上传路由: ${route}`);
    }

    return next.handle();
  }

  private fileFilter(request: AuthRequest, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    return callbackify(() => this.assetService.canUploadFile(asRequest(request, file)), callback);
  }

  private filename(request: AuthRequest, file: Express.Multer.File, callback: DiskStorageCallback) {
    return callbackify(
      () => this.assetService.getUploadFilename(asRequest(request, file)),
      callback as Callback<string>,
    );
  }

  private destination(request: AuthRequest, file: Express.Multer.File, callback: DiskStorageCallback) {
    return callbackify(() => this.assetService.getUploadFolder(asRequest(request, file)), callback as Callback<string>);
  }

  private handleFile(request: AuthRequest, file: Express.Multer.File, callback: Callback<Partial<File>>) {
    (file as MulterFile).uuid = randomUUID();
    if (!this.isAssetUploadFile(file)) {
      this.defaultStorage._handleFile(request, file, callback);
      return;
    }

    const hash = createHash('sha1');
    file.stream.on('data', (chunk) => hash.update(chunk));
    this.defaultStorage._handleFile(request, file, (error, info) => {
      if (error) {
        hash.destroy();
        callback(error);
      } else {
        callback(null, { ...info, checksum: hash.digest() });
      }
    });
  }

  private removeFile(request: AuthRequest, file: Express.Multer.File, callback: (error: Error | null) => void) {
    this.defaultStorage._removeFile(request, file, callback);
  }

  private isAssetUploadFile(file: Express.Multer.File) {
    switch (file.fieldname as UploadFieldName) {
      case UploadFieldName.ASSET_DATA:
    }

    return false;
  }

  private getHandler(route: Route) {
    switch (route) {
      case Route.ASSET: {
        return this.handlers.assetUpload;
      }

      case Route.USER: {
        return this.handlers.userProfile;
      }

      default: {
        return null;
      }
    }
  }
}
