import { TskvLogger } from './tskv.logger';

function parse(spy: jest.SpyInstance): string[][] {
  return (spy.mock.calls[0][0] as string).split('\t').map((tuple) => {
    const separatorIndex = tuple.indexOf('=');
    const key = tuple.slice(0, separatorIndex);
    const value = tuple.slice(separatorIndex + 1, tuple.length);

    return [key, value];
  });
}

describe('TskvLogger', () => {
  let tskvLogger: TskvLogger;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
    tskvLogger = new TskvLogger();
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('log without context', () => {
    tskvLogger.log('test');

    expect(console.log).toHaveBeenCalledTimes(1);
    const record = parse(logSpy);

    expect(record).toMatchObject([
      ['level', 'log'],
      ['message', 'test'],
    ]);
  });
  it('log with context', () => {
    tskvLogger.log('test', 'TskvLogger');
    expect(console.log).toHaveBeenCalledTimes(1);
    const record = parse(logSpy);
    expect(record).toMatchObject([
      ['level', 'log'],
      ['message', 'test'],
      ['context', 'TskvLogger'],
    ]);
  });
  it('correctly handles text with =', () => {
    tskvLogger.log('status=ok');
    expect(console.log).toHaveBeenCalledTimes(1);
    const record = parse(logSpy);

    expect(record).toMatchObject([
      ['level', 'log'],
      ['message', 'status=ok'],
    ]);
  });
  it('error with stack', () => {
    tskvLogger.error('test', 'Stack', 'TskvLogger');
    expect(console.error).toHaveBeenCalledTimes(1);
    const record = parse(errorSpy);

    expect(record).toMatchObject([
      ['level', 'error'],
      ['message', 'test'],
      ['context', 'TskvLogger'],
      ['stack', 'Stack'],
    ]);
  });
  it('correctly handles text with tabulation', () => {
    tskvLogger.error('a\tb\nc\\d', 'TskvLogger');
    expect(console.error).toHaveBeenCalledTimes(1);
    const record = parse(errorSpy);

    expect(record).toMatchObject([
      ['level', 'error'],
      ['message', 'a\\tb\\nc\\\\d'],
      ['context', 'TskvLogger'],
    ]);
  });
  it('correctly escapes newlines in stack', () => {
    tskvLogger.error('msg', 'line1\nline2', 'Ctx');
    expect(console.error).toHaveBeenCalledTimes(1);
    const record = parse(errorSpy);

    expect(record).toMatchObject([
      ['level', 'error'],
      ['message', 'msg'],
      ['context', 'Ctx'],
      ['stack', 'line1\\nline2'],
    ]);
  });
  it('correctly handles fatal', () => {
    tskvLogger.fatal('msg', 'line1\nline2', 'Ctx');
    expect(console.error).toHaveBeenCalledTimes(1);
    const record = parse(errorSpy);

    expect(record).toMatchObject([
      ['level', 'fatal'],
      ['message', 'msg'],
      ['context', 'Ctx'],
      ['stack', 'line1\\nline2'],
    ]);
  });
  it.each(['warn', 'debug', 'verbose'] as const)(
    '%s writes its own level',
    (level) => {
      tskvLogger[level]('msg');

      expect(logSpy).toHaveBeenCalledTimes(1);
      const record = parse(logSpy);
      expect(record).toMatchObject([
        ['level', level],
        ['message', 'msg'],
      ]);
    },
  );
});
