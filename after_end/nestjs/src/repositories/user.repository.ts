import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { UserEntity } from '@app/entities/user.entity';
import {
  IUserRepository,
  UserFindOptions,
  UserListFilter,
} from '@app/interfaces/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) {}

  async get(userId: string, options: UserFindOptions): Promise<UserEntity | null> {
    options = options || {};
    return this.userRepository.findOne({
      where: { id: userId },
      withDeleted: options.withDeleted,
    });
  }

  async getAdmin(): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { isAdmin: true } });
  }

  async getByEmail(email: string, withPassword?: boolean): Promise<UserEntity | null> {
    let builder = this.userRepository.createQueryBuilder('user').where({ email });

    if (withPassword) {
      builder = builder.addSelect('user.password');
    }

    return builder.getOne();
  }

  async getByStorageLabel(storageLabel: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { storageLabel } });
  }

  async getByOAuthId(oauthId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { oauthId } });
  }

  async getDeletedUsers(): Promise<UserEntity[]> {
    return this.userRepository.find({ withDeleted: true, where: { deletedAt: Not(IsNull()) } });
  }

  async getList({ withDeleted }: UserListFilter = {}): Promise<UserEntity[]> {
    return this.userRepository.find({
      withDeleted,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  create(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.save(user);
  }

  update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    return this.save({ ...user, id });
  }

  async delete(user: UserEntity, hard?: boolean): Promise<UserEntity> {
    return hard ? this.userRepository.remove(user) : this.userRepository.softRemove(user);
  }

  private async save(user: Partial<UserEntity>) {
    const { id } = await this.userRepository.save(user);
    return this.userRepository.findOneOrFail({ where: { id }, withDeleted: true });
  }
}