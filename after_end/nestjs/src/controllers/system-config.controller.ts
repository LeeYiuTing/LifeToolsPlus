import { Body, Controller, Get, Put, Query } from '@nestjs/common';

import { SystemConfigService } from '@app/services/system-config.service';
import { SystemConfigDto } from '@app/dtos/system-config.dto';
import { Authenticated } from '@app/middleware/auth.guard';

@Controller('system-config')
@Authenticated({ admin: true })
export class SystemConfigController {
  constructor(private readonly service: SystemConfigService) {}

  @Get()
  getConfig(): Promise<SystemConfigDto> {
    return this.service.getConfig()
  }

  @Get('defaults')
  getConfigDefaults(): SystemConfigDto {
    return this.service.getDefaults()
  }

  @Put()
  updateConfig(@Body() dto: SystemConfigDto): Promise<SystemConfigDto> {
    return this.service.updateConfig(dto)
  }
}
