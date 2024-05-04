
export const IStorageRepository = 'IStorageRepository';

export interface IStorageRepository {
  mkdirSync(filepath: string): void;
  utimes(filepath: string, atime: Date, mtime: Date): Promise<void>;
}
