import { AuthDto } from '@app/dtos/auth.dto';
import {
  AssetFileUploadResponseDto, AssetResponseDto, AssetSearchDto, IAssetRepository,
  UploadFieldName,
  UploadFile,
  UploadRequest
} from '@app/interfaces/asset.interface';
import { mimeTypes } from '@app/utils/mime-types';
import { Logger } from '@app/utils/logger';
import { BadRequestException, Inject } from '@nestjs/common';
import { extname } from 'node:path';
import sanitize from 'sanitize-filename';
import { StorageCore, StorageFolder } from '@app/cores/storage.core';
import { IStorageRepository } from '@app/interfaces/storage.interface';
import { CreateAssetDto } from '@app/dtos/asset.dto';
import { AssetEntity } from '@app/entities/asset.entity';

export class AssetService {
  private logger = new Logger(AssetService.name);
  constructor(
    @Inject(IStorageRepository) private storageRepository: IStorageRepository,
    @Inject(IAssetRepository) private assetRepository: IAssetRepository,
  ) {}

  canUploadFile({ fieldName, file }: UploadRequest): true {
    const filename = file.originalName;

    switch (fieldName) {
      case UploadFieldName.ASSET_DATA: {
        if (mimeTypes.isAsset(filename)) {
          return true;
        }
        break;
      }
      case UploadFieldName.PROFILE_DATA: {
        if (mimeTypes.isProfile(filename)) {
          return true;
        }
        break;
      }
    }
    this.logger.error(`不支持文件类型 ${filename}`);
    throw new BadRequestException(`不支持文件类型 ${filename}`);
  }

  getUploadFilename({ auth, fieldName, file }: UploadRequest): string {
    const originalExtension = extname(file.originalName);

    const lookup = {
      [UploadFieldName.ASSET_DATA]: originalExtension,
      [UploadFieldName.PROFILE_DATA]: originalExtension,
    };

    return sanitize(`${file.uuid}${lookup[fieldName]}`);
  }

  getUploadFolder({ auth, fieldName, file }: UploadRequest): string {
    let folder = StorageCore.getNestedFolder(StorageFolder.UPLOAD, auth.user.id, file.uuid);
    if (fieldName === UploadFieldName.PROFILE_DATA) {
      folder = StorageCore.getFolderLocation(StorageFolder.PROFILE, auth.user.id);
    }

    this.storageRepository.mkdirSync(folder);

    return folder;
  }

  public async uploadFile(
    auth: AuthDto,
    dto: CreateAssetDto,
    file: UploadFile,
  ): Promise<AssetFileUploadResponseDto> {
    try {
      const asset = await this.create(auth, { ...dto }, file);

      return { id: asset.id, duplicate: false };
    } catch (e) {
      // TODO clean up files

      this.logger.error(`Error uploading file ${e}`, e?.stack);
      throw e;
    }
  }

  private async create(
    auth: AuthDto,
    dto: CreateAssetDto,
    file: UploadFile,
  ) {
    const asset = await this.assetRepository.create({
      ownerId: auth.user.id,

      originalPath: file.originalPath,
      originalFileName: file.originalName,

      fileCreatedAt: dto.fileCreatedAt,
      fileModifiedAt: dto.fileModifiedAt,
      localDateTime: dto.fileCreatedAt,

      type: mimeTypes.assetType(file.originalPath),
      duration: dto.duration || null,
    })

    await this.storageRepository.utimes(file.originalPath, new Date(), new Date(dto.fileModifiedAt));

    // TODO 队列处理图片链接

    return asset;
  }

  public async getAllAssets(auth: AuthDto, dto: AssetSearchDto): Promise<AssetResponseDto[]> {
    const userId = dto.userId || auth.user.id;
    const assets = await this.assetRepository.getAllByUserId(userId, dto);
    return assets.map((asset: AssetEntity) => {
      return {
        id: asset.id,
        ownerId: asset.ownerId,
        type: asset.type,
        resized: !!asset.previewPath,
        originalPath: asset.originalPath,
        thumbnailPath: asset.thumbnailPath,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
        deletedAt: asset.deletedAt,
        fileCreatedAt: asset.fileCreatedAt,
        localDateTime: asset.localDateTime,
        fileModifiedAt: asset.fileModifiedAt,
        duration: asset.duration ?? '0:00:00.00000',
        originalFileName: asset.originalFileName,
        // tags: asset.tags.map((tag) => tag.name),
      };
    });
  }
}
