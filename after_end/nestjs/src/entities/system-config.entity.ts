import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('system_config')
export class SystemConfigEntity<T = SystemConfigValue> {
  @PrimaryColumn()
  key!: SystemConfigKey;

  @Column({ type: 'varchar', nullable: true, transformer: { to: JSON.stringify, from: JSON.parse } })
  value!: T | T[];
}

export type SystemConfigValue = string | number | boolean;

export enum SystemConfigKey {
  OAUTH_AUTO_LAUNCH = 'oauth.autoLaunch',
  OAUTH_ENABLED = 'oauth.enabled',
  OAUTH_CLIENT_ID = 'oauth.clientId',

  PASSWORD_LOGIN_ENABLED = 'passwordLogin.enabled',
}

export enum LogLevel {
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

// default
export interface SystemConfig {
  logging: {
    enabled: boolean;
    level: LogLevel;
  };
  oauth: {
    enabled: boolean;
    clientId: string;
    autoLaunch: boolean;
  },
  passwordLogin: {
    enabled: boolean;
  },

}
