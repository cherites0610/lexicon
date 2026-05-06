import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../../common/token/tokens.js';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Redis({
          host: config.getOrThrow<string>('REDIS_HOST'),
          port: config.getOrThrow<number>('REDIS_PORT'),
          username: config.get<string>('REDIS_USER'),
          password: config.get<string>('REDIS_PASSWORD'),
          db: config.getOrThrow<number>('REDIS_DB'),
        }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
