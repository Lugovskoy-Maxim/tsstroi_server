import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { WinstonModuleOptions } from 'nest-winston';

export const getLoggerConfig = (): WinstonModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Формат для вывода в консоль
  const consoleFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ level, message, timestamp, context, stack }) => {
      const contextMsg = context ? `[${context}] ` : '';
      const stackMsg = stack ? `\n${stack}` : '';
      return `${timestamp} ${contextMsg}${level}: ${message}${stackMsg}`;
    })
  );

  // Формат для записи в файлы
  const fileFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json()
  );

  // Настройка транспортов 
  const consoleTransport = new winston.transports.Console({
    format: consoleFormat,
    level: isProduction ? 'info' : 'debug'
  });

  const fileTransport = new DailyRotateFile({
    filename: 'logs/application-%DATE%.log', // Файлы приложения
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,        // Архивировать старые логи
    maxSize: '20m',             // Макс размер файла
    maxFiles: '30d',            // Хранить логи 30 дней
    format: fileFormat,
    level: 'info'               // Уровень логирования для файлов
  });

  const exceptionTransport = new DailyRotateFile({
    filename: 'logs/exceptions-%DATE%.log', // Файлы исключений
    datePattern: 'YYYY-MM-DD',
    format: fileFormat
  });

  // Обработчики ошибок транспортов
  fileTransport.on('error', (error) => {
    console.error('Ошибка файлового транспорта:', error);
  });

  exceptionTransport.on('error', (error) => {
    console.error('Ошибка транспорта исключений:', error);
  });

  return {
    level: 'debug',             // Минимальный уровень логирования
    exitOnError: false,         
    handleExceptions: true,     
    handleRejections: true,    
    format: fileFormat,         
    transports: [              
      consoleTransport,         
      fileTransport             
    ],
    exceptionHandlers: [       
      consoleTransport, // писать в консоль и в файл
      exceptionTransport
    ],
    rejectionHandlers: [        
      consoleTransport,   // писать в консоль и в файл
      exceptionTransport
    ]
  };
};