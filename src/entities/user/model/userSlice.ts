import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
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
      if (action.payload === null) {
        state.currentUser = null;
      } else {
        state.currentUser = { ...(state.currentUser || {}), ...action.payload } as User;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('session/clearSession', (state) => {
        state.currentUser = null;
      })
      .addMatcher(
        isAnyOf(
          userApi.endpoints.getCurrentUser.matchFulfilled,
          userApi.endpoints.updateProfile.matchFulfilled,
          userApi.endpoints.uploadAvatar.matchFulfilled,
          userApi.endpoints.deleteAvatar.matchFulfilled,
        ),
        (state, action) => {
          state.currentUser = { ...(state.currentUser || {}), ...action.payload.data.user } as User;
        },
      );
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
