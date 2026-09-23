import {
  sessionReducer,
  setAccessToken,
  clearSession,
  finishInitializing,
} from '@/entities/session/model/sessionSlice';
import {
  selectAccessToken,
  selectIsAuthenticated,
  selectIsInitializing,
} from '@/entities/session/model/selectors';
import type { SessionState } from '@/entities/session/model/types';

const INITIAL_STATE: SessionState = {
  accessToken: null,
  isInitializing: true,
};

describe('sessionSlice — reducers', () => {
  it('returns the initial state for unknown actions', () => {
    expect(sessionReducer(undefined, { type: '@@INIT' })).toEqual(INITIAL_STATE);
  });

  it('setAccessToken — sets token in state', () => {
    const state = sessionReducer(INITIAL_STATE, setAccessToken('abc.def.ghi'));
    expect(state.accessToken).toBe('abc.def.ghi');
  });

  it('setAccessToken — accepts null (explicit logout token clear)', () => {
    const loggedIn: SessionState = { ...INITIAL_STATE, accessToken: 'old-token' };
    const state = sessionReducer(loggedIn, setAccessToken(null));
    expect(state.accessToken).toBeNull();
  });

  it('clearSession — wipes accessToken', () => {
    const loggedIn: SessionState = { accessToken: 'active-token', isInitializing: false };
    const state = sessionReducer(loggedIn, clearSession());
    expect(state.accessToken).toBeNull();
  });

  it('finishInitializing — sets isInitializing to false', () => {
    const state = sessionReducer(INITIAL_STATE, finishInitializing());
    expect(state.isInitializing).toBe(false);
  });
});

describe('sessionSlice — selectors', () => {
  it('selectIsAuthenticated returns true when token is set', () => {
    const state = { session: { ...INITIAL_STATE, accessToken: 'tok' } };
    expect(selectIsAuthenticated(state)).toBe(true);
  });

  it('selectIsAuthenticated returns false when token is null', () => {
    const state = { session: INITIAL_STATE };
    expect(selectIsAuthenticated(state)).toBe(false);
  });

  it('selectAccessToken returns the raw token', () => {
    const state = { session: { ...INITIAL_STATE, accessToken: 'my-token' } };
    expect(selectAccessToken(state)).toBe('my-token');
  });

  it('selectIsInitializing returns the flag value', () => {
    const state = { session: { ...INITIAL_STATE, isInitializing: false } };
    expect(selectIsInitializing(state)).toBe(false);
  });
});
