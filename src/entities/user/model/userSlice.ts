import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from './types';
import { userStorage } from '../lib/userStorage';

const initialState: UserState = {
  currentUser: userStorage.getUser(),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      if (action.payload) {
        userStorage.saveUser(action.payload);
      } else {
        userStorage.removeUser();
      }
    },
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
