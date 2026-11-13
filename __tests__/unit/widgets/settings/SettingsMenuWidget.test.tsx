import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {},
  useReducedMotion: () => false,
  ReduceMotion: { System: 'system', Always: 'always', Never: 'never' },
}));
jest.mock('react-native-gesture-handler', () => ({ __esModule: true, GestureDetector: ({ children }: any) => children }));
jest.mock('@gorhom/bottom-sheet', () => {
  const R = require('react');
  const RN = require('react-native');
  const Modal = R.forwardRef(({ children }: any, ref: any) => {
    R.useImperativeHandle(ref, () => ({ present: jest.fn(), dismiss: jest.fn() }));
    return <RN.View>{children}</RN.View>;
  });
  return {
    __esModule: true,
    BottomSheetModal: Modal,
    BottomSheetView: (p: any) => <RN.View {...p} />,
    BottomSheetFlatList: (p: any) => <RN.FlatList {...p} />,
    BottomSheetBackdrop: () => null,
  };
});
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
}));
jest.mock('react-native-restart', () => ({ restart: jest.fn() }));
jest.mock('react-native-image-crop-picker', () => ({ openCamera: jest.fn(), openPicker: jest.fn() }));
jest.mock('@react-native-camera-roll/camera-roll', () => ({ CameraRoll: { getPhotos: jest.fn(), getAlbums: jest.fn() } }));
jest.mock('@react-native-community/image-editor', () => ({ cropImage: jest.fn() }));

const i18n = require('@/shared/lib/i18n/i18n').default;
const { ThemeContext } = require('@/shared/hooks/useTheme');
const { lightTheme, darkTheme } = require('@/shared/theme');
const { sessionReducer } = require('@/entities/session');
const { userReducer } = require('@/entities/user');
const { baseApi } = require('@/shared/api');
const { registerAlert } = require('@/shared/lib/alert');
const { MAIN_ROUTES, TEST_IDS, THEME_MODES } = require('@/shared/constants');
const { SettingsMenuWidget } = require('@/widgets/settings');

const makeStore = () =>
  configureStore({
    reducer: combineReducers({
      session: sessionReducer,
      user: userReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    }),
    middleware: (getDefault: any) =>
      getDefault({ serializableCheck: false }).concat(baseApi.middleware),
  });

const renderWidget = async (mode: string, theme = lightTheme) => {
  const store = makeStore();
  let tree!: ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme, mode, setMode: jest.fn(), isDark: theme.isDark }}>
          <SettingsMenuWidget />
        </ThemeContext.Provider>
      </Provider>,
    );
  });
  return { store, tree };
};

const textsOf = (tree: ReactTestRenderer) =>
  tree.root.findAll(node => typeof node.props.children === 'string').map(node => node.props.children);

const pressById = async (tree: ReactTestRenderer, testID: string) => {
  const target = tree.root.find(node => node.props.testID === testID && typeof node.props.onPress === 'function');
  await act(async () => target.props.onPress());
};

describe('SettingsMenuWidget', () => {
  afterEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
    });
    mockNavigate.mockClear();
  });

  it('shows the current theme and language in light mode', async () => {
    const { tree } = await renderWidget(THEME_MODES.SYSTEM);
    const texts = textsOf(tree);
    expect(texts).toContain('System Default');
    expect(texts).toContain('English (US)');
    expect(texts).toContain('Log out');
  });

  it('renders in dark mode with the dark label', async () => {
    const { tree } = await renderWidget(THEME_MODES.DARK, darkTheme);
    expect(textsOf(tree)).toContain('Dark');
  });

  it('renders in Urdu', async () => {
    await act(async () => {
      await i18n.changeLanguage('ur');
    });
    const { tree } = await renderWidget(THEME_MODES.LIGHT);
    expect(textsOf(tree)).toContain('اردو');
  });

  it('opens Edit profile', async () => {
    const { tree } = await renderWidget(THEME_MODES.SYSTEM);
    await pressById(tree, TEST_IDS.SETTINGS.EDIT_PROFILE);
    expect(mockNavigate).toHaveBeenCalledWith(MAIN_ROUTES.EDIT_PROFILE);
  });

  it('asks for confirmation before logging out', async () => {
    // Stands in for AlertOverlay, which isn't rendered here
    const openAlert = jest.fn();
    registerAlert(openAlert);
    const { tree } = await renderWidget(THEME_MODES.SYSTEM);
    await pressById(tree, TEST_IDS.SETTINGS.LOGOUT);
    registerAlert(null);
    const alert = openAlert.mock.calls[0][0];
    expect(alert.title).toBe('Log out of your account?');
    expect(alert.buttons.map((b: any) => b.style)).toEqual(['cancel', 'destructive']);
  });
});
