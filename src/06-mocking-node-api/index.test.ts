import path from 'path';
import fsp from 'fs/promises';
import fs from 'fs';

import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

const timeout = 1000;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockedTimeout = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();

    doStuffByTimeout(callback, timeout);

    expect(mockedTimeout).toBeCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockedInterval = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, timeout);

    expect(mockedInterval).toBeCalledWith(callback, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, timeout);

    expect(callback).not.toBeCalled();

    jest.runOnlyPendingTimers();

    expect(callback).toBeCalledTimes(1);

    jest.runOnlyPendingTimers();

    expect(callback).toBeCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const mockJoin = jest.spyOn(path, 'join');
    const pathToFile = 'path/file.txt';
    await readFileAsynchronously(pathToFile);

    expect(mockJoin).toBeCalled();
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    const content = await readFileAsynchronously('test.txt');
    expect(content).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest
      .spyOn(fsp, 'readFile')
      .mockResolvedValue({ toString: () => '' } as Buffer);

    const content = await readFileAsynchronously('test.txt');
    expect(typeof content).toBe('string');
  });
});
