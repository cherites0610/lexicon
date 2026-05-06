import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const isProd = process.env['NODE_ENV'] === 'production';
  const app = await NestFactory.create(AppModule, { bufferLogs: isProd });
  app.setGlobalPrefix('api');

  if (isProd) {
    app.useLogger(app.get(Logger));
    app.use(helmet());
    app.enableCors({
      origin: process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) ?? [],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    });
  } else {
    const config = new DocumentBuilder()
      .setTitle('Selling-ware')
      .setDescription('API 文件')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
    app.enableCors(true);
  }
  app.enableShutdownHooks();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
