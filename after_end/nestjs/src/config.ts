import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';
import { LogLevel } from '@app/entities/system-config.entity';

export const AppConfig: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().optional().valid('development', 'production', 'staging').default('development'),
    LOG_LEVEL: Joi.string()
      .optional()
      .valid(...Object.values(LogLevel)),

  })
};
