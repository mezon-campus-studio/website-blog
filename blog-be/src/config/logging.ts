import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// format log
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',

  format: combine(
    errors({ stack: true }), // log stack trace
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),

  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat)
    }),

    new transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),

    new transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

export default logger;