import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Logger } from '@app/utils/logger';
import { ICryptoRepository } from '@app/interfaces/crypto.interface';
import { ISystemConfigRepository } from '@app/interfaces/system-config.interface';
import { IUserRepository, UserFindOptions } from '@app/interfaces/user.interface';
import { SystemConfigCore } from '@app/cores/system-config.core';
import { UserCore } from '@app/cores/user.core';
import { CreateUserDto, DeleteUserDto, mapUser, UpdateUserDto, UserResponseDto } from '@app/dtos/user.dto';
import { AuthDto } from '@app/dtos/auth.dto';
import { UserStatus } from '@app/entities/user.entity';


@Injectable()
export class UserService {
  private configCore: SystemConfigCore;
  private logger = new Logger(UserService.name);
  private userCore: UserCore;
  constructor(
    @Inject(ICryptoRepository) private cryptoRepository: ICryptoRepository,
    @Inject(ISystemConfigRepository) configRepository: ISystemConfigRepository,
    @Inject(IUserRepository) private userRepository: IUserRepository,
  ) {
    this.userCore = UserCore.create(cryptoRepository, userRepository);
    this.configCore = SystemConfigCore.create(configRepository);
  }

  async getAll(auth: AuthDto, isAll: boolean): Promise<UserResponseDto[]> {
    const users = await this.userRepository.getList({ withDeleted: !isAll });
    return users.map((user) => mapUser(user));
  }

  async get(userId: string) {
    const user = await this.userRepository.get(userId, { withDeleted: false });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return mapUser(user);
  }

  getMe(auth: AuthDto): Promise<UserResponseDto> {
    return this.findOrFail(auth.user.id, {}).then(mapUser);
  }

  create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userCore.createUser(createUserDto).then(mapUser);
  }

  async update(auth: AuthDto, dto: UpdateUserDto): Promise<UserResponseDto> {
    if (!auth.user.isAdmin && auth.user.id !== dto.id) {
      throw new ForbiddenException('您不允许更新此用户');
    }

    if (!auth.user.isAdmin) {
      delete dto.isAdmin;
      delete dto.storageLabel;
    }

    // const user = await this.findOrFail(dto.id, {});

    // if (dto.quotaSizeInBytes && user.quotaSizeInBytes !== dto.quotaSizeInBytes) {
    //   await this.userRepository.syncUsage(dto.id);
    // }

    return this.userCore.updateUser(dto.id, dto).then(mapUser);
  }

  async delete(auth: AuthDto, id: string, dto: DeleteUserDto): Promise<UserResponseDto> {
    const { force } = dto;
    const { isAdmin } = await this.findOrFail(id, {});
    if (isAdmin) {
      throw new ForbiddenException('Cannot delete admin user');
    }

    // await this.albumRepository.softDeleteAll(id);

    const status = force ? UserStatus.REMOVING : UserStatus.DELETED;
    const user = await this.userRepository.update(id, { status, deletedAt: new Date() });

    // if (force) {
    //   await this.jobRepository.queue({ name: JobName.USER_DELETION, data: { id: user.id, force } });
    // }

    return mapUser(user);
  }

  async restore(auth: AuthDto, id: string): Promise<UserResponseDto> {
    await this.findOrFail(id, { withDeleted: true });
    // await this.albumRepository.restoreAll(id);
    return this.userRepository.update(id, { deletedAt: null, status: UserStatus.ACTIVE }).then(mapUser);
  }

  async resetAdminPassword(ask: (admin: UserResponseDto) => Promise<string | undefined>) {
    const admin = await this.userRepository.getAdmin();
    if (!admin) {
      throw new BadRequestException('管理员帐号不存在');
    }

    const providedPassword = await ask(mapUser(admin));
    const password = providedPassword || this.cryptoRepository.newPassword(24);

    await this.userCore.updateUser(admin.id, { password });

    return { admin, password, provided: !!providedPassword };
  }

  private async findOrFail(id: string, options: UserFindOptions) {
    const user = await this.userRepository.get(id, options);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    return user;
  }
}
