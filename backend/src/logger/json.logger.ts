import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]) {
    const context = optionalParams.at(-1);
    const rest = optionalParams.slice(0, -1);

    return JSON.stringify({
      level,
      message,
      context,
      ...(['fatal', 'error'].includes(level) &&
        rest.length > 0 && { stack: rest[0] }),
    });
  }
  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }
  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }
  warn(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('warn', message, ...optionalParams));
  }
  debug(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('debug', message, ...optionalParams));
  }
  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
  fatal(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('fatal', message, ...optionalParams));
  }
}
