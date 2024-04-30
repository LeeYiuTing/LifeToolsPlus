import { IsObject, ValidateNested, ValidateIf, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { SystemConfig } from '@app/entities/system-config.entity';
import { ValidateBoolean } from '@app/validation';
import { LogLevel } from '@app/entities/system-config.entity';
import { ApiProperty } from '@nestjs/swagger';

const isEnabled = (config: SystemConfigOAuthDto) => config.enabled;
class SystemConfigOAuthDto {
  @ValidateBoolean()
  enabled!: boolean;
  @ValidateIf(isEnabled)
  @IsNotEmpty()
  @IsString()
  clientId!: string;
  @ValidateBoolean()
  autoLaunch!: boolean;
}

class SystemConfigLoggingDto {
  @ValidateBoolean()
  enabled!: boolean;
  @ApiProperty({ enum: LogLevel, enumName: 'LogLevel' })
  @IsEnum(LogLevel)
  level!: LogLevel;
}

class SystemConfigPasswordLoginDto {
  @ValidateBoolean()
  enabled!: boolean;
}

export class SystemConfigDto implements SystemConfig {
  @Type(() => SystemConfigOAuthDto)
  @ValidateNested()
  @IsObject()
  oauth!: SystemConfigOAuthDto

  @Type(() => SystemConfigLoggingDto)
  @ValidateNested()
  @IsObject()
  logging!: SystemConfigLoggingDto;

  @Type(() => SystemConfigPasswordLoginDto)
  @ValidateNested()
  @IsObject()
  passwordLogin!: SystemConfigPasswordLoginDto;
}

export function mapConfig(config: SystemConfig): SystemConfigDto {
  return config;
}
