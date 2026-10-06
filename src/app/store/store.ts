import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { reduxPersistStorage } from '@/shared/lib/storage';
import { baseApi } from '@/shared/api';
import { sessionReducer } from '@/entities/session';
import { userReducer } from '@/entities/user';
import { toastReducer } from '@/shared/lib/toast/toastSlice';
import { alertReducer } from '@/shared/lib/alert';
import { errorInterceptorMiddleware } from './errorInterceptorMiddleware';
import { authListenerMiddleware } from './authListenerMiddleware';

const rootReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
  toast: toastReducer,
  alert: alertReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: reduxPersistStorage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      baseApi.middleware,
      authListenerMiddleware.middleware,
      errorInterceptorMiddleware,
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
