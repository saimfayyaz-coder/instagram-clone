import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastPayload {
  message: string;
  type?: 'default' | 'error' | 'success';
  duration?: number;
  position?: 'bottom' | 'middle';
}

export interface ToastState {
  visible: boolean;
  message: string;
  type: 'default' | 'error' | 'success';
  duration: number;
  position: 'bottom' | 'middle';
}

const initialState: ToastState = {
  visible: false,
  message: '',
  type: 'default',
  duration: 3000,
  position: 'bottom',
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastPayload>) => {
      state.visible = true;
      state.message = action.payload.message;
      state.type = action.payload.type ?? 'default';
      state.duration = action.payload.duration ?? 3000;
      state.position = action.payload.position ?? 'bottom';
    },
    hideToast: (state) => {
      state.visible = false;
      state.message = '';
      state.position = 'bottom';
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;
