/**
 * Lightweight Redux store factory for unit tests.
 *
 * Intentionally avoids redux-persist and native storage so tests run
 * in pure Node.js without any native bridges.
 */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { sessionReducer } from '@/entities/session';
import { userReducer } from '@/entities/user';
import { baseApi } from '@/shared/api';

const testRootReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type TestRootState = ReturnType<typeof testRootReducer>;

export function createTestStore(preloadedState?: Partial<TestRootState>) {
  return configureStore({
    reducer: testRootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat(baseApi.middleware),
    preloadedState: preloadedState as any,
  });
}

export type TestStore = ReturnType<typeof createTestStore>;
