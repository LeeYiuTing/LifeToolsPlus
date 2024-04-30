import { UserEntity } from '@app/entities/user.entity';

export interface UserFindOptions {
  withDeleted?: boolean;
}

export interface UserListFilter {
  withDeleted?: boolean;
}

export const IUserRepository = 'IUserRepository';

export interface IUserRepository {
  get(id: string, options: UserFindOptions): Promise<UserEntity | null>;
  getAdmin(): Promise<UserEntity | null>;
  // hasAdmin(): Promise<boolean>;
  getByEmail(email: string, withPassword?: boolean): Promise<UserEntity | null>;
  getByStorageLabel(storageLabel: string): Promise<UserEntity | null>;
  getByOAuthId(oauthId: string): Promise<UserEntity | null>;
  getDeletedUsers(): Promise<UserEntity[]>;
  getList(filter?: UserListFilter): Promise<UserEntity[]>;
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity>;
  delete(user: UserEntity, hard?: boolean): Promise<UserEntity>;
  // updateUsage(id: string, delta: number): Promise<void>;
  // syncUsage(id?: string): Promise<void>;
}
