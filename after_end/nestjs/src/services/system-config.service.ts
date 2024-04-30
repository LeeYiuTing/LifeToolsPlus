import { Injectable, Inject } from '@nestjs/common';
import { Logger } from '@app/utils/logger';
import { SystemConfigCore } from '@app/cores/system-config.core';
import { ISystemConfigRepository } from '@app/interfaces/system-config.interface';
// import { OnEvent } from '@nestjs/event-emitter';
// import { instanceToPlain } from 'class-transformer';
// import { InternalEventMap, InternalEvent } from '../repositories';
import { LogLevel, SystemConfig } from '@app/entities/system-config.entity';
// import { isEqual } from 'lodash';
import { SystemConfigDto, mapConfig } from '@app/dtos/system-config.dto';

@Injectable()
export class SystemConfigService {
  private logger = new Logger(SystemConfigService.name);
  private core: SystemConfigCore;

  constructor(
    @Inject(ISystemConfigRepository) private repository: ISystemConfigRepository,
  ) {
    this.core = SystemConfigCore.create(repository);
    this.core.config$.subscribe((config) => this.setLogLevel(config));
  }

  async init() {
    const config = await this.core.getConfig();
    this.config$.next(config);
  }

  get config$() {
    return this.core.config$;
  }

  async getConfig(): Promise<SystemConfigDto> {
    const config = await this.core.getConfig();
    return mapConfig(config);
  }

  getDefaults(): SystemConfigDto {
    const config = this.core.getDefaults();
    return mapConfig(config);
  }

  // @OnEvent(InternalEvent.VALIDATE_CONFIG)
  // validateConfig({ newConfig, oldConfig }: InternalEventMap[InternalEvent.VALIDATE_CONFIG]) {
  //   if (!isEqual(instanceToPlain(newConfig.logging), oldConfig.logging) && this.getEnvLogLevel()) {
  //     throw new Error('Logging cannot be changed while the environment variable LOG_LEVEL is set.');
  //   }
  // }

  async updateConfig(dto: SystemConfigDto): Promise<SystemConfigDto> {
    // const oldConfig = await this.core.getConfig();

    const newConfig = await this.core.updateConfig(dto);

    return mapConfig(newConfig);
  }

  private setLogLevel({ logging }: SystemConfig) {
    const envLevel = this.getEnvLogLevel();
    const configLevel = logging.enabled ? logging.level : false;
    const level = envLevel ?? configLevel;
    Logger.setLogLevel(level);
    this.logger.log(`LogLevel=${level} ${envLevel ? '(set via LOG_LEVEL)' : '(set via system config)'}`);
  }

  private getEnvLogLevel() {
    return process.env.LOG_LEVEL as LogLevel;
  }
}
