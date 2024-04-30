import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  SystemConfigService
} from '@app/services/system-config.service';

import { Logger } from '@app/utils/logger';

@Injectable()
export class ApiService {
  private logger = new Logger(ApiService.name);

  constructor(
    private configService: SystemConfigService,
  ) {}

  async init() {
    await this.configService.init();
  }
}
