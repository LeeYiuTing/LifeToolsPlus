import { ConsoleLogger } from '@nestjs/common';
import { isLogLevelEnabled } from '@nestjs/common/services/utils/is-log-level-enabled.util';
import { LogLevel } from '@app/entities/system-config.entity';

const LOG_LEVELS = [LogLevel.VERBOSE, LogLevel.DEBUG, LogLevel.LOG, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL];

export class Logger extends ConsoleLogger {
  private static logLevels: LogLevel[] = [LogLevel.LOG, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL]

  constructor(context: string) {
    super(context);
  }

  isLevelEnabled(level: LogLevel): boolean {
    return isLogLevelEnabled(level, Logger.logLevels);
  }

  static setLogLevel(level: LogLevel | false): void {
    Logger.logLevels = level === false ? [] : LOG_LEVELS.slice(LOG_LEVELS.indexOf(level));
  }
}
