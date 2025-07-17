import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const httpTransport = new DailyRotateFile({
  filename: 'logs/http-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

export const httpLogger = winston.createLogger({
  level: 'info',
  transports: [httpTransport]
});
