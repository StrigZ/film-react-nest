import { Injectable, LoggerService } from '@nestjs/common';

function escape(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('\t', '\\t')
    .replaceAll('\n', '\\n')
    .replaceAll('\r', '\\r');
}

function convertToString(value: unknown): string {
  return typeof value === 'string' ? value : String(JSON.stringify(value));
}

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]) {
    const context = optionalParams.at(-1);
    const rest = optionalParams.slice(0, -1);
    const msg = [
      ['level', level],
      ['message', escape(convertToString(message))],
    ];

    if (context !== undefined) {
      msg.push(['context', escape(convertToString(context))]);
    }

    if (['fatal', 'error'].includes(level) && rest.length > 0) {
      msg.push(['stack', escape(convertToString(rest[0]))]);
    }

    return msg.map((tuple) => tuple.join('=')).join('\t');
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
