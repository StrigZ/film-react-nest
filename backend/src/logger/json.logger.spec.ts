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

  it('omits the context field when no context is passed', () => {
    jsonLogger.log('test');

    expect(console.log).toHaveBeenCalledTimes(1);
    const record: Record<string, unknown> = JSON.parse(
      logSpy.mock.calls[0][0] as string,
    );
    expect(record).not.toHaveProperty('context');
    expect(record).toMatchObject({ level: 'log', message: 'test' });
  });
  it('puts the context argument into the context field', () => {
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
  it('puts the stack argument into the stack field', () => {
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
  it('writes fatal records to stderr with the stack field and writes to stderr', () => {
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
