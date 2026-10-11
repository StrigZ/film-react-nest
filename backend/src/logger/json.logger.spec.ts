import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let jsonLogger: JsonLogger;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
    jsonLogger = new JsonLogger();
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('log without context', () => {
    jsonLogger.log('test');

    expect(console.log).toHaveBeenCalledTimes(1);
    const record: Record<string, unknown> = JSON.parse(
      logSpy.mock.calls[0][0] as string,
    );
    expect(record).not.toHaveProperty('context');
    expect(record).toMatchObject({ level: 'log', message: 'test' });
  });
  it('log with context', () => {
    jsonLogger.log('test', 'JsonLogger');
    expect(console.log).toHaveBeenCalledTimes(1);
    const record: Record<string, unknown> = JSON.parse(
      logSpy.mock.calls[0][0] as string,
    );
    expect(record).toMatchObject({
      level: 'log',
      message: 'test',
      context: 'JsonLogger',
    });
  });
  it('error with stack', () => {
    jsonLogger.error('test', 'Stack', 'JsonLogger');
    expect(console.error).toHaveBeenCalledTimes(1);
    const record: Record<string, unknown> = JSON.parse(
      errorSpy.mock.calls[0][0] as string,
    );
    expect(record).toMatchObject({
      level: 'error',
      message: 'test',
      context: 'JsonLogger',
      stack: 'Stack',
    });
  });
  it('correctly handles fatal', () => {
    jsonLogger.fatal('test', 'Stack', 'JsonLogger');
    expect(console.error).toHaveBeenCalledTimes(1);
    const record: Record<string, unknown> = JSON.parse(
      errorSpy.mock.calls[0][0] as string,
    );
    expect(record).toMatchObject({
      level: 'fatal',
      message: 'test',
      context: 'JsonLogger',
      stack: 'Stack',
    });
  });
  it.each(['warn', 'debug', 'verbose'] as const)(
    '%s writes its own level',
    (level) => {
      jsonLogger[level]('msg');

      expect(logSpy).toHaveBeenCalledTimes(1);
      const record = JSON.parse(logSpy.mock.calls[0][0] as string) as Record<
        string,
        unknown
      >;
      expect(record).toMatchObject({ level, message: 'msg' });
    },
  );
});
