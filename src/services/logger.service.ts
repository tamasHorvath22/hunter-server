import { Injectable, Logger } from '@nestjs/common';
import { LoggerType } from '../enums/logger-type';

@Injectable()
export class LoggerService {

  private loggerMap: Record<string, Logger> = {};

  private getLogger(type: LoggerType): Logger {
    if (!this.loggerMap[type]) {
      this.loggerMap[type] = new Logger(type);
    }
    return this.loggerMap[type];
  }

  public info(type: LoggerType, message: string): void {
    const logger = this.getLogger(type);
    logger.log(message);
  }

  public error(type: LoggerType, message: string): void {
    const logger = this.getLogger(type);
    logger.error(message);
  }

  public warn(type: LoggerType, message: string): void {
    const logger = this.getLogger(type);
    logger.warn(message);
  }
}
