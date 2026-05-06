import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { join } from 'path';

@Module({})
export class LoggerModule {
  static forRoot(): DynamicModule {
    if (process.env['NODE_ENV'] !== 'production') {
      return { module: LoggerModule };
    }

    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRoot({
          pinoHttp: {
            level: 'info',
            serializers: {
              req: (req: {
                id: string;
                method: string;
                url: string;
                query: Record<string, unknown>;
                params: Record<string, unknown>;
                headers: Record<string, string>;
                socket: { remoteAddress?: string };
              }) => ({
                id: req.id,
                method: req.method,
                url: req.url,
                query: req.query,
                params: req.params,
                ip: req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress,
                userAgent: req.headers['user-agent'],
              }),
            },
            transport: {
              targets: [
                {
                  target: 'pino/file',
                  level: 'info',
                  options: { destination: 1 },
                },
                {
                  target: 'pino-roll',
                  level: 'info',
                  options: {
                    file: join('logs', 'app'),
                    frequency: 'daily',
                    dateFormat: 'yyyy-MM-dd',
                    extension: '.log',
                    limit: { count: 14 },
                    mkdir: true,
                  },
                },
                {
                  target: 'pino-roll',
                  level: 'error',
                  options: {
                    file: join('logs', 'error'),
                    frequency: 'daily',
                    dateFormat: 'yyyy-MM-dd',
                    extension: '.log',
                    limit: { count: 30 },
                    mkdir: true,
                  },
                },
              ],
            },
          },
        }),
      ],
    };
  }
}
