import { NextFunction, Response } from 'express';
import { promisify } from 'node:util';
import { isAbsolute } from 'node:path';
import { access, constants } from 'node:fs/promises';
import { HttpException } from '@nestjs/common';
import { Logger } from '@app/utils/logger';


type SendFile = Parameters<Response['sendFile']>;
type SendFileOptions = SendFile[1];
const logger = new Logger('SendFile');

export class FileResponse {
  public readonly path!: string;
  public readonly contentType!: string;
  public readonly cacheControl!: CacheControl;

  constructor(response: FileResponse) {
    Object.assign(this, response);
  }
}

export const isConnectionAborted = (error: Error | any) => error.code === 'ECONNABORTED';

export enum CacheControl {
  PRIVATE_WITH_CACHE = 'private_with_cache',
  PRIVATE_WITHOUT_CACHE = 'private_without_cache',
  NONE = 'none',
}

export const sendFile = async (
  res: Response,
  next: NextFunction,
  handler: () => Promise<FileResponse>,
): Promise<void> => {
  const _sendFile = (path: string, options: SendFileOptions) =>
    promisify<string, SendFileOptions>(res.sendFile).bind(res)(path, options);

  try {
    const file = await handler();
    switch (file.cacheControl) {
      case CacheControl.PRIVATE_WITH_CACHE: {
        res.set('Cache-Control', 'private, max-age=86400, no-transform');
        break;
      }

      case CacheControl.PRIVATE_WITHOUT_CACHE: {
        res.set('Cache-Control', 'private, no-cache, no-transform');
        break;
      }
    }

    res.header('Content-Type', file.contentType);

    const options: SendFileOptions = { dotfiles: 'allow' };
    if (!isAbsolute(file.path)) {
      options.root = process.cwd();
    }

    await access(file.path, constants.R_OK);

    return _sendFile(file.path, options);
  } catch (error: Error | any) {
    // ignore client-closed connection
    if (isConnectionAborted(error)) {
      return;
    }

    // log non-http errors
    if (!(error instanceof HttpException)) {
      logger.error(`Unable to send file: ${error.name}`, error.stack);
    }

    res.header('Cache-Control', 'none');
    next(error);
  }
};
