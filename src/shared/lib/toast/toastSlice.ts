import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOAST_POSITIONS, TOAST_TYPES, ToastPosition, ToastType } from '@/shared/constants/ui';

export interface ToastPayload {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
}

export interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
  position: ToastPosition;
}

const initialState: ToastState = {
  visible: false,
  message: '',
  type: TOAST_TYPES.DEFAULT,
  duration: 3000,
  position: TOAST_POSITIONS.BOTTOM,
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastPayload>) => {
      state.visible = true;
      state.message = action.payload.message;
      state.type = action.payload.type ?? TOAST_TYPES.DEFAULT;
      state.duration = action.payload.duration ?? 3000;
      state.position = action.payload.position ?? TOAST_POSITIONS.BOTTOM;
    },
    hideToast: (state) => {
      state.visible = false;
      state.message = '';
      state.position = TOAST_POSITIONS.BOTTOM;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;
