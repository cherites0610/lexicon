import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { DbModule } from './core/db/db.module.js';
import { HttpExceptionFilter } from './core/filter/http-exception.filter.js';
import { JwtAuthGuard } from './core/guard/jwt.guard.js';
import { TransformInterceptor } from './core/interceptor/transform.interceptor.js';
import { LoggerModule } from './core/logger/logger.module.js';
import { validationExceptionFactory } from './core/pipe/validation-exception.factory.js';
import { RedisModule } from './core/redis/redis.module.js';
import { ThrottlerModule } from './core/throttler/throttler.module.js';
import { UtilModule } from './module/util/util.module.js';
import { RoleGuard } from './core/guard/role.guard.js';
import { AuthModule } from './module/auth/auth.module.js';
import { UserModule } from './module/user/user.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(),
    DbModule,
    RedisModule,
    ThrottlerModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.get<string>(
            'ACCESS_TOKEN_EXPIRES_IN',
            '15m',
          ) as `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`,
        },
      }),
    }),
    UtilModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: validationExceptionFactory,
      }),
    },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard}
  ],
})
export class AppModule {}
