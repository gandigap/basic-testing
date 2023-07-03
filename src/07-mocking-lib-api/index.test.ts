import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

const response = {
  data: 'info',
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const SOURCE_PATH = '/users';

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockedAxios.create.mockReturnThis();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    mockedAxios.get.mockResolvedValueOnce(response);

    await throttledGetDataFromApi('');

    expect(mockedAxios.create).toBeCalledWith({
      baseURL: BASE_URL,
    });
  });

  test('should perform request to correct provided url', async () => {
    mockedAxios.get.mockImplementationOnce((path) => {
      return path === SOURCE_PATH
        ? Promise.resolve(response)
        : Promise.reject();
    });

    const result = await throttledGetDataFromApi(SOURCE_PATH);

    expect(result).toEqual(response.data);
  });

  test('should return response data', async () => {
    mockedAxios.get.mockResolvedValueOnce(response);

    const result = await throttledGetDataFromApi('');

    expect(result).toEqual(response.data);
  });
});
