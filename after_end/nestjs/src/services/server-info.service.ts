import { Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { Logger } from '@app/utils/logger';
import { SystemConfigCore } from '@app/cores/system-config.core';
import { serverVersion } from '@app/utils/version';
import { ISystemConfigRepository } from '@app/interfaces/system-config.interface';
import { ServerFeaturesDto } from '@app/dtos/server-info.dto';
import { isDev } from '@app/constant';

@Injectable()
export class ServerInfoService {
  private logger = new Logger(ServerInfoService.name);
  private configCore: SystemConfigCore;
  private releaseVersion = serverVersion;
  private releaseVersionCheckedAt: dayjs.Dayjs | null = null;

  constructor(
    @Inject(ISystemConfigRepository) configRepository: ISystemConfigRepository,
  ) {
    this.configCore = SystemConfigCore.create(configRepository);
  }

  onConnect() {}

  async init(): Promise<void> {
    await this.handleVersionCheck();

    const featureFlags = await this.getFeatures();
    // TODO
    // if (featureFlags.configFile) {
    //   await this.setAdminOnboarding();
    // }
  }

  getVersion() {
    return serverVersion;
  }

  getFeatures(): Promise<ServerFeaturesDto> {
    return this.configCore.getFeatures();
  }

  async handleVersionCheck(): Promise<boolean> {
    try {
      if (isDev) {
        return true;
      }
      // TODO
      // const { newVersionCheck } = await this.configCore.getConfig();
      // if (!newVersionCheck.enabled) {
      //   return true;
      // }
    } catch (e) {

    }
  }
}
