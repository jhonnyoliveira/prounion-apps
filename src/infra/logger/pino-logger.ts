import pino, { Logger as LoggerType } from 'pino';
import pretty from 'pino-pretty';
import { Logger } from './logger';

export class PinoLogger implements Logger {
  private logger: LoggerType;
  private prefix = '';

  constructor(level: string, prefix = '') {
    const stream = pretty({
      colorize: true,
      translateTime: 'SYS:mm/dd HH:MM:ss',
      ignore: 'pid,hostname',
    });

    this.logger = pino(
      {
        level,
      },
      stream,
    );

    this.setPrefix(prefix);
  }

  setPrefix(prefix: string): void {
    if (!prefix.trim().endsWith('>')) {
      prefix += ' ->';
    }

    this.prefix = prefix;
  }

  info(message: string): void {
    this.logger.info(`${this.prefix} ${message}`.trim());
  }

  debug(message: string): void {
    this.logger.debug(`${this.prefix} ${message}`.trim());
  }

  error(error: any, message?: string): void {
    let errorMessage = JSON.stringify(error, null, 2);

    if (error?.message) {
      errorMessage = error.message;
    }

    this.logger.error(`${this.prefix} ${message}\n${errorMessage}`.trim());
  }

  warn(message: string): void {
    this.logger.warn(`${this.prefix} ${message}`.trim());
  }
}
