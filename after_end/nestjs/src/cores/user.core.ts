import { BadRequestException } from '@nestjs/common';
import sanitize from 'sanitize-filename';

import { UserEntity } from '@app/entities/user.entity';
import { IUserRepository } from '@app/interfaces/user.interface';
import { ICryptoRepository } from '@app/interfaces/crypto.interface';

const SALT_ROUNDS = 10;

let instance: UserCore | null;

export class UserCore {
  constructor(
    private cryptoRepository: ICryptoRepository,
    private userRepository: IUserRepository,
  ) {}

  static create(
    cryptoRepository: ICryptoRepository,
    userRepository: IUserRepository,
  ) {
    if (!instance) {
      instance = new UserCore(cryptoRepository, userRepository);
    }
    return instance;
  }

  static reset() {
    instance = null;
  }

  async createUser(dto: Partial<UserEntity> & { email: string }): Promise<UserEntity> {
    const user = await this.userRepository.getByEmail(dto.email);
    if (user) {
      throw new BadRequestException('该用户已存在。');
    }

    if (!Boolean(dto.isAdmin)) {
      const localAdmin = await this.userRepository.getAdmin();
      if (!localAdmin) {
        throw new BadRequestException('第一个注册的帐户必须是管理员。');
      }
    }

    const payload: Partial<UserEntity> = { ...dto };
    if (payload.password) {
      payload.password = await this.cryptoRepository.hashBcrypt(payload.password, SALT_ROUNDS);
    }

    if (payload.storageLabel) {
      payload.storageLabel = sanitize(payload.storageLabel.replaceAll('.', ''));
    }


    return await this.userRepository.create(payload);
  }


  async updateUser(id: string, dto: Partial<UserEntity>) {
    if (dto.email) {
      const duplicate = await this.userRepository.getByEmail(dto.email);
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException('电子邮件已经在使用的另一个帐户');
      }
    }

    if (dto.storageLabel) {
      const duplicate = await this.userRepository.getByStorageLabel(dto.storageLabel);
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException('Storage label 已经被另一个帐户使用');
      }
    }

    if (dto.password) {
      dto.password = await this.cryptoRepository.hashBcrypt(dto.password, SALT_ROUNDS);
    }

    if (dto.storageLabel === '') {
      dto.storageLabel = null;
    }
    return this.userRepository.update(id, dto);
  }
}
