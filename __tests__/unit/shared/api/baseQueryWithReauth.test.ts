import { API_ENDPOINTS, API_ERROR_CODES, SESSION_ACTION_TYPES } from '@/shared/constants';

const mockBaseQuery = jest.fn();
jest.mock('@reduxjs/toolkit/query/react', () => ({
  ...jest.requireActual('@reduxjs/toolkit/query/react'),
  fetchBaseQuery: () => (...args: unknown[]) => mockBaseQuery(...args),
}));

const mockGetRefreshToken = jest.fn();
jest.mock('@/shared/api/authStorage', () => ({
  authStorage: { getRefreshToken: () => mockGetRefreshToken() },
}));

// Imported after the mocks so the module picks up the mocked fetchBaseQuery
const { baseQueryWithReauth } = require('@/shared/api/baseQueryWithReauth');

const urlOf = (args: any) => (typeof args === 'string' ? args : args.url);
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
const unauthorized = { error: { status: 401, data: { code: API_ERROR_CODES.TOKEN_EXPIRED } } };

const makeApi = () => ({ dispatch: jest.fn(), getState: () => ({}) }) as any;
const refreshCalls = () =>
  mockBaseQuery.mock.calls.filter(([args]) => urlOf(args) === API_ENDPOINTS.AUTH.REFRESH_TOKEN).length;
const dispatchedTypes = (api: any) => api.dispatch.mock.calls.map(([action]: any) => action.type);

// Fails the test instead of hanging when a request never resolves
const withTimeout = <T,>(promise: Promise<T>) =>
  Promise.race([promise, delay(1000).then(() => { throw new Error('request hung'); })]);

describe('baseQueryWithReauth', () => {
  beforeEach(() => {
    mockBaseQuery.mockReset();
    mockGetRefreshToken.mockReset();
  });

  it('resolves every waiting request when the refresh fails', async () => {
    mockGetRefreshToken.mockResolvedValue('refresh-token');
    mockBaseQuery.mockImplementation(async (args: any) => {
      if (urlOf(args) === API_ENDPOINTS.AUTH.REFRESH_TOKEN) {
        await delay(10);
        return { error: { status: 401, data: { code: API_ERROR_CODES.REFRESH_TOKEN_INVALID } } };
      }
      return unauthorized;
    });
    const api = makeApi();

    const results: any[] = await withTimeout(
      Promise.all([
        baseQueryWithReauth(API_ENDPOINTS.USERS.PROFILE, api, {}),
        baseQueryWithReauth(API_ENDPOINTS.AUTH.ME, api, {}),
      ]),
    );

    results.forEach(result => {
      expect(result.error.data.code).toBe(API_ERROR_CODES.REFRESH_TOKEN_EXPIRED);
    });
    expect(refreshCalls()).toBe(1);
    expect(dispatchedTypes(api)).toEqual([SESSION_ACTION_TYPES.CLEAR_SESSION]);
  });

  it('refreshes once and retries every waiting request when the refresh succeeds', async () => {
    let refreshed = false;
    mockGetRefreshToken.mockResolvedValue('refresh-token');
    mockBaseQuery.mockImplementation(async (args: any) => {
      if (urlOf(args) === API_ENDPOINTS.AUTH.REFRESH_TOKEN) {
        await delay(10);
        refreshed = true;
        return { data: { data: { accessToken: 'new-token' } } };
      }
      return refreshed ? { data: { ok: true } } : unauthorized;
    });
    const api = makeApi();

    const results: any[] = await withTimeout(
      Promise.all([
        baseQueryWithReauth(API_ENDPOINTS.USERS.PROFILE, api, {}),
        baseQueryWithReauth(API_ENDPOINTS.AUTH.ME, api, {}),
      ]),
    );

    results.forEach(result => expect(result.data).toEqual({ ok: true }));
    expect(refreshCalls()).toBe(1);
    expect(api.dispatch).toHaveBeenCalledWith({
      type: SESSION_ACTION_TYPES.SET_ACCESS_TOKEN,
      payload: 'new-token',
    });
  });

  it('returns a 401 from a public auth endpoint as-is without refreshing', async () => {
    mockBaseQuery.mockResolvedValue({
      error: { status: 401, data: { code: API_ERROR_CODES.INVALID_RESET_TOKEN } },
    });
    const api = makeApi();

    const result: any = await baseQueryWithReauth(
      { url: API_ENDPOINTS.AUTH.RESET_PASSWORD, method: 'POST', body: {} },
      api,
      {},
    );

    expect(result.error.data.code).toBe(API_ERROR_CODES.INVALID_RESET_TOKEN);
    expect(refreshCalls()).toBe(0);
    expect(api.dispatch).not.toHaveBeenCalled();
  });

  it('clears the session when a protected request gets a 401 and there is no refresh token', async () => {
    mockGetRefreshToken.mockResolvedValue(null);
    mockBaseQuery.mockResolvedValue(unauthorized);
    const api = makeApi();

    const result: any = await baseQueryWithReauth(API_ENDPOINTS.USERS.PROFILE, api, {});

    expect(result.error.data.code).toBe(API_ERROR_CODES.REFRESH_TOKEN_EXPIRED);
    expect(dispatchedTypes(api)).toEqual([SESSION_ACTION_TYPES.CLEAR_SESSION]);
  });
});
