import { BullModule } from '@nestjs/bullmq';
import { Module, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

import { services } from '@app/services';
import { repositories } from '@app/repositories';
import { controllers } from '@app/controllers';
import { databaseConfig, bullConfig, bullQueues } from '@app/database.config';
import { entities } from '@app/entities';
import { AuthGuard } from '@app/middleware/auth.guard';
import { ErrorInterceptor } from '@app/middleware/error.interceptor';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from '@app/services/api.service';
import { Logger } from '@app/utils/logger';
import { AppConfig } from '@app/config';

const providers = [Logger];
const common = [...services, ...providers, ...repositories];

const middleware = [
  { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true, whitelist: true }) },
  { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
  { provide: APP_GUARD, useClass: AuthGuard },
]

const imports = [
  BullModule.forRoot(bullConfig),
  BullModule.registerQueue(...bullQueues),
  ConfigModule.forRoot(AppConfig),
  EventEmitterModule.forRoot(),
  TypeOrmModule.forRoot(databaseConfig),
  TypeOrmModule.forFeature(entities),
]

@Module({
  imports: [...imports],
  controllers: [...controllers],
  providers: [...common, ...middleware],
})
export class ApiModule implements OnModuleInit {
  constructor(private service: ApiService) {}

  async onModuleInit() {
    await this.service.init();
  }
}

@Module({
  imports: [...imports],
  providers: [...common, SchedulerRegistry],
})
export class AdminModule {}

@Module({
  imports: [
    ConfigModule.forRoot(AppConfig),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [...controllers],
  providers: [...common, ...middleware, SchedulerRegistry],
})
export class AppTestModule {}
