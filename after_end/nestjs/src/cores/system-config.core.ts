import { SystemConfig, SystemConfigEntity, SystemConfigValue, SystemConfigKey, LogLevel } from '@app/entities/system-config.entity';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Logger } from "@app/utils/logger";
import { Subject } from 'rxjs';
import { ISystemConfigRepository } from '@app/interfaces/system-config.interface';
import { get, has, set, cloneDeep, isEqual } from 'lodash';

export const defaults = Object.freeze<SystemConfig>({
  oauth: {
    enabled: true,
    clientId: '',
    autoLaunch: true,
  },
  passwordLogin: {
    enabled: true
  },
  logging: {
    enabled: true,
    level: LogLevel.LOG,
  }
})

export enum FeatureFlag {
  OAUTH = 'oauth',
  OAUTH_AUTO_LAUNCH = 'oauthAutoLaunch',
  PASSWORD_LOGIN = 'passwordLogin',
  CONFIG_FILE = 'configFile',
}
export type FeatureFlags = Record<FeatureFlag, boolean>;

let instance: SystemConfigCore | null;

@Injectable()
export class SystemConfigCore {
  private logger = new Logger(SystemConfigCore.name);
  private configCache: SystemConfigEntity | null = null;

  public config$ = new Subject<SystemConfig>();

  private constructor(private repository: ISystemConfigRepository) {}

  static create(repository: ISystemConfigRepository) {
    if (!instance) {
      instance = new SystemConfigCore(repository);
    }
    return instance;
  }

  static reset() {
    instance = null;
  }

  async requireConfig(feature: FeatureFlag) {
    const hasFeature = await this.hasFeature(feature);

    if (!hasFeature) {
      switch (feature) {
        case FeatureFlag.OAUTH:
          throw new Error('OAuth is not enabled');
        case FeatureFlag.OAUTH_AUTO_LAUNCH:
          throw new Error('OAuth auto launch is not enabled');
        case FeatureFlag.PASSWORD_LOGIN:
          throw new Error('Password login is not enabled');
        case FeatureFlag.CONFIG_FILE:
          throw new Error('Config file is not enabled');
        default: {
          throw new ForbiddenException(`Missing required feature: ${feature}`);
        }
      }
    }
  }

  async hasFeature(feature: FeatureFlag) {
    const features = await this.getFeatures();
    return features[feature] ?? false;
  }

  async getFeatures(): Promise<FeatureFlags> {
    const config = await this.getConfig();

    return {
      [FeatureFlag.OAUTH]: config.oauth.enabled,
      [FeatureFlag.OAUTH_AUTO_LAUNCH]: config.oauth.autoLaunch,
      [FeatureFlag.PASSWORD_LOGIN]: config.passwordLogin.enabled,
      [FeatureFlag.CONFIG_FILE]: !!process.env.CONFIG_FILE,
    }
  }

  public getDefaults(): SystemConfig {
    return defaults;
  }

  public async getConfig(force = false): Promise<SystemConfig> {
    const config = cloneDeep(defaults);
    const overrides = await this.repository.load();
    for (const { key, value } of overrides) {
      // set via dot notation
      set(config, key, value);
    }

    // TODO should be validated

    return config;
  }

  public async updateConfig(newConfig: SystemConfig): Promise<SystemConfig> {
    if (await this.hasFeature(FeatureFlag.CONFIG_FILE)) {
      throw new BadRequestException('Cannot update configuration while CONFIG_FILE is in use');
    }

    const updates: SystemConfigEntity[] = [];
    const deletes: SystemConfigEntity[] = [];

    for (const key of Object.values(SystemConfigKey)) {
      // get via dot notation
      const item = { key, value: get(newConfig, key) as SystemConfigValue };
      const defaultValue = get(defaults, key);
      const isMissing = !has(newConfig, key);

      if (
        isMissing ||
        item.value === null ||
        item.value === '' ||
        item.value === defaultValue ||
        isEqual(item.value, defaultValue)
      ) {
        deletes.push(item);
        continue;
      }

      updates.push(item);
    }

    if (updates.length > 0) {
      await this.repository.saveAll(updates);
    }

    if (deletes.length > 0) {
      await this.repository.deleteKeys(deletes.map((item) => item.key));
    }

    const config = await this.getConfig();

    this.config$.next(config);

    return config;
  }

  public async refreshConfig() {
    const newConfig = await this.getConfig(true);

    this.config$.next(newConfig);
  }


}
