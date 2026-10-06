import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface AlertPayload {
  title?: string;
  message: string;
  buttons?: AlertButton[];
}

export interface SerializableAlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertState {
  visible: boolean;
  title?: string;
  message: string;
  buttons: SerializableAlertButton[];
}

const initialState: AlertState = {
  visible: false,
  title: undefined,
  message: '',
  buttons: [],
};

// Module-level callback holder to keep Redux store strictly serializable
let alertButtonCallbacks: Array<(() => void) | undefined> = [];

export const triggerAlertButtonCallback = (index: number) => {
  const callback = alertButtonCallbacks[index];
  alertButtonCallbacks = [];
  if (callback) {
    callback();
  }
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<AlertPayload>) => {
      const buttons = action.payload.buttons && action.payload.buttons.length > 0
        ? action.payload.buttons
        : [{ text: 'OK', style: 'default' as const }];

      alertButtonCallbacks = buttons.map(b => b.onPress);

      state.visible = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.buttons = buttons.map(b => ({
        text: b.text,
        style: b.style ?? 'default',
      }));
    },
    hideAlert: (state) => {
      alertButtonCallbacks = [];
      state.visible = false;
      state.title = undefined;
      state.message = '';
      state.buttons = [];
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export const alertReducer = alertSlice.reducer;
