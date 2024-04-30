import { IStorageRepository } from '@app/interfaces/storage.interface';
import { Injectable } from '@nestjs/common';
import { Logger } from '@app/utils/logger';
import { constants, createReadStream, existsSync, mkdirSync } from 'node:fs';

@Injectable()
export class StorageRepository implements IStorageRepository {
  private logger = new Logger(StorageRepository.name);
  constructor() {}

  mkdirSync(filepath: string): void {
    if (!existsSync(filepath)) {
      mkdirSync(filepath, { recursive: true });
    }
  }
}
