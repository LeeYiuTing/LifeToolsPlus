import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';

import { Logger } from '@app/utils/logger';
import { isDev, envName, excludePaths } from './constant';
import { serverVersion } from '@app/utils/version';
import { ApiModule } from '@app/app.module';
import { useSwagger } from '@app/utils/misc';
// import { WebSocketAdapter } from '@app/middleware/websocket.adapter';

async function bootstrap() {
  const logger = new Logger('Server');
  const port = Number(process.env.SERVER_PORT) || 3001;

  const app = await NestFactory.create<NestExpressApplication>(ApiModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  app.set('etag', 'strong');
  app.use(cookieParser());
  app.use(json({ limit: '10mb' }));
  if (isDev) {
    app.enableCors();
  }
  // app.useWebSocketAdapter(new WebSocketAdapter(app));

  useSwagger(app, isDev);

  app.setGlobalPrefix('api', { exclude: excludePaths });

  await app.listen(port);
  // server.requestTimeout = 30 * 60 * 1000;
  logger.log(`Server is listening on ${await app.getUrl()} [v${serverVersion}] [${envName}] `);
}

void bootstrap();
