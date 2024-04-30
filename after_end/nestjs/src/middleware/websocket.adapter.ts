import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter'
import { ServerOptions } from 'socket.io';
import { DataSource } from 'typeorm';
import { Logger } from '@app/utils/logger';

const logger = new Logger('debug')

export class WebSocketAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    logger.debug(this.app.get(DataSource))

    // server.adapter = createAdapter()

    return server;
  }
}
