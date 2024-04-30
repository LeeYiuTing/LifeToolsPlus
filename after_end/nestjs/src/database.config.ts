import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { RedisOptions } from 'ioredis';
import { QueueOptions } from 'bullmq';
import { RegisterQueueOptions } from '@nestjs/bullmq';
import { QueueName } from '@app/constant';
import { DataSource } from 'typeorm';

const url = process.env.DB_URL;
const urlOrParts = url
  ? { url }
  : {
    host: process.env.DB_HOSTNAME || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE_NAME || 'nestjs',
  };

/* eslint unicorn/prefer-module: "off" -- We can fix this when migrating to ESM*/
export const databaseConfig: MysqlConnectionOptions = {
  type: 'mysql',
  entities: [__dirname + '/entities/*.entity.{js,ts}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  // migrationsRun: false,
  ...urlOrParts,
};

export const dataSource = new DataSource(databaseConfig);

function parseRedisConfig(): RedisOptions {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl && redisUrl.startsWith('ioredis://')) {
    try {
      const decodedString = Buffer.from(redisUrl.slice(10), 'base64').toString();
      return JSON.parse(decodedString);
    } catch (error) {
      throw new Error(`Failed to decode redis options: ${error}`);
    }
  }
  return {
    host: process.env.REDIS_HOSTNAME || 'localhost',
    port: Number.parseInt(process.env.REDIS_PORT || '6379'),
    db: Number.parseInt(process.env.REDIS_DBINDEX || '0'),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
    path: process.env.REDIS_SOCKET || undefined,
  };
}
export const bullConfig: QueueOptions = {
  prefix: 'nest_bull',
  connection: parseRedisConfig(),
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: false,
  },
};

export const bullQueues: RegisterQueueOptions[] = Object.values(QueueName).map((name) => ({ name }));
