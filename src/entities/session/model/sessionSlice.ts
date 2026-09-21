import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SessionState } from './types';

const initialState: SessionState = {
  accessToken: null,
  isInitializing: true,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    finishInitializing: (state) => {
      state.isInitializing = false;
    },
    clearSession: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, finishInitializing, clearSession } =
  sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;
