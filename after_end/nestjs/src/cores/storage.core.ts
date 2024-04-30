import { Logger } from '@app/utils/logger';
import { ICryptoRepository } from '@app/interfaces/crypto.interface';
import { randomUUID } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { APP_MEDIA_LOCATION } from '@app/constant';

export enum StorageFolder {
  ENCODED_VIDEO = 'encoded-video',
  UPLOAD = 'upload',
  PROFILE = 'profile',
  THUMBNAILS = 'thumbs',
}

let instance: StorageCore | null;
export class StorageCore {
  private logger = new Logger(StorageCore.name);
  private constructor(
    private cryptoRepository: ICryptoRepository,
  ) {}

  static create(cryptoRepository: ICryptoRepository) {
    if (!instance) {
      instance = new StorageCore(cryptoRepository)
    }

    return instance;
  }

  static reset() {
    instance = null;
  }

  static getBaseFolder(folder: StorageFolder) {
    return join(APP_MEDIA_LOCATION, folder);
  }

  static getFolderLocation(folder: StorageFolder, userId: string) {
    return join(StorageCore.getBaseFolder(folder), userId);
  }

  static getNestedFolder(folder: StorageFolder, ownerId: string, filename: string): string {
    return join(StorageCore.getFolderLocation(folder, ownerId), filename.slice(0, 2), filename.slice(2, 4));
  }

  static getNestedPath(folder: StorageFolder, ownerId: string, filename: string): string {
    return join(this.getNestedFolder(folder, ownerId, filename), filename);
  }
}
