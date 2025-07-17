import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import { WinstonModule } from 'nest-winston';
import { getCorsConfig } from './configs/cors.config';
import { getLoggerConfig } from './configs/logger.config';
import { httpLogger } from './configs/http-logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(getLoggerConfig())
  });

  // Безопасность 
  app.use(helmet());
  app.use(cookieParser());

  // Логирование HTTP запросов
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      httpLogger.http({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: Date.now() - start,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
    });
    next();
  });

  // CORS - с настройками из конфига
  app.enableCors(getCorsConfig());

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port).then(() => {
    console.log(` Server is running on port ${port}`);
  });
}

bootstrap().catch(err => {
  console.error('❌ Fatal error during startup:', err);
  process.exit(1);
});