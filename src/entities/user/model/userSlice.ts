import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from './types';
import { userApi } from '../api/userApi';

const initialState: UserState = {
  currentUser: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('session/clearSession', (state) => {
        state.currentUser = null;
      })
      .addMatcher(
        userApi.endpoints.getCurrentUser.matchFulfilled,
        (state, action) => {
          state.currentUser = action.payload.data.user;
        },
      );
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
