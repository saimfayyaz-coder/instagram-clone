/* eslint-disable @typescript-eslint/no-var-requires */

jest.mock('react-native-mmkv', () => {
  const store = new Map<string, string>();
  const mmkvInstance = {
    getString: jest.fn((k: string) => store.get(k)),
    set: jest.fn((k: string, v: string | boolean | number) => store.set(k, String(v))),
    getBoolean: jest.fn((k: string) => store.get(k) === 'true'),
    getNumber: jest.fn((k: string) => Number(store.get(k))),
    delete: jest.fn((k: string) => store.delete(k)),
    remove: jest.fn((k: string) => store.delete(k)),
    clearAll: jest.fn(() => store.clear()),
    contains: jest.fn((k: string) => store.has(k)),
  };
  return { createMMKV: jest.fn(() => mmkvInstance), MMKV: jest.fn(() => mmkvInstance) };
});

jest.mock('react-native-keychain', () => {
  const store = new Map<string, string>();
  return {
    SECURITY_LEVEL: { ANY: 'ANY', SECURE_SOFTWARE: 'SECURE_SOFTWARE' },
    ACCESSIBLE: { WHEN_UNLOCKED: 'WHEN_UNLOCKED' },
    setGenericPassword: jest.fn((_user: string, pass: string, opts?: { service?: string }) => {
      store.set(opts?.service ?? 'default', pass);
      return Promise.resolve({ service: opts?.service ?? 'default' });
    }),
    getGenericPassword: jest.fn((opts?: { service?: string }) => {
      const val = store.get(opts?.service ?? 'default');
      return Promise.resolve(val ? { username: '', password: val } : false);
    }),
    resetGenericPassword: jest.fn((opts?: { service?: string }) => {
      store.delete(opts?.service ?? 'default');
      return Promise.resolve(true);
    }),
  };
});

jest.mock('react-native-keyboard-controller', () => {
  const React = require('react');
  const { ScrollView } = require('react-native');
  return {
    KeyboardProvider: ({ children }: { children: React.ReactNode }) => children,
    KeyboardAwareScrollView: React.forwardRef((props: any, ref: any) =>
      React.createElement(ScrollView, { ...props, ref }),
    ),
    useKeyboardHandler: jest.fn(),
    useReanimatedKeyboardAnimation: jest.fn(() => ({ height: { value: 0 }, progress: { value: 0 } })),
  };
});

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn().mockResolvedValue(undefined),
  isVisible: jest.fn().mockResolvedValue(false),
  useHideAnimation: jest.fn(() => ({ container: {}, logo: {}, brand: {} })),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: any }) => children,
    SafeAreaConsumer: ({ children }: { children: (i: any) => any }) => children(inset),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    SafeAreaView: ({ children }: { children: any }) => children,
  };
});

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');
jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');

jest.mock('react-native-localize', () => ({
  getLocales: () => [{ countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false }],
  getCountry: () => 'US',
  getCurrencies: () => ['USD'],
  findBestLanguageTag: () => ({ languageTag: 'en', isRTL: false }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
