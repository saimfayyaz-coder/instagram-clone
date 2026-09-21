import { SessionState } from './types';

export const selectAccessToken = (state: { session: SessionState }): string | null =>
  state.session.accessToken;

export const selectIsAuthenticated = (state: { session: SessionState }): boolean =>
  Boolean(state.session.accessToken);

export const selectIsInitializing = (state: { session: SessionState }): boolean =>
  state.session.isInitializing;
