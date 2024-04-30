
export const IStorageRepository = 'IStorageRepository';

export interface IStorageRepository {
  mkdirSync(filepath: string): void;
}
