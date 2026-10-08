import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { User, UserState } from './types';
import { userApi } from '../api/userApi';

const initialState: UserState = {
  currentUser: null,
  isAvatarUpdating: false,
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
    setAvatarUpdating: (state, action: PayloadAction<boolean>) => {
      state.isAvatarUpdating = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('session/clearSession', (state) => {
        state.currentUser = null;
        state.isAvatarUpdating = false;
      })
      .addMatcher(
        isAnyOf(
          userApi.endpoints.uploadAvatar.matchPending,
          userApi.endpoints.deleteAvatar.matchPending,
        ),
        (state) => {
          state.isAvatarUpdating = true;
        },
      )
      .addMatcher(
        isAnyOf(
          userApi.endpoints.uploadAvatar.matchFulfilled,
          userApi.endpoints.uploadAvatar.matchRejected,
          userApi.endpoints.deleteAvatar.matchFulfilled,
          userApi.endpoints.deleteAvatar.matchRejected,
        ),
        (state) => {
          state.isAvatarUpdating = false;
        },
      )
      .addMatcher(
        isAnyOf(
          userApi.endpoints.getCurrentUser.matchFulfilled,
          userApi.endpoints.updateProfile.matchFulfilled,
          userApi.endpoints.uploadAvatar.matchFulfilled,
          userApi.endpoints.deleteAvatar.matchFulfilled,
          userApi.endpoints.addLink.matchFulfilled,
          userApi.endpoints.editLink.matchFulfilled,
          userApi.endpoints.deleteLink.matchFulfilled,
        ),
        (state, action) => {
          state.currentUser = { ...(state.currentUser || {}), ...action.payload.data.user } as User;
        },
      );
  },
});

export const { setUser, setAvatarUpdating } = userSlice.actions;
export const userReducer = userSlice.reducer;
