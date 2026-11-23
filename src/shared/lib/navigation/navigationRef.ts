import { createNavigationContainerRef, NavigationState } from '@react-navigation/native';
import { MainStackParamList } from '@/shared/types';

// Navigates the navigator that is mounted right now. A screen's own `navigation` stops working
// once Android rebuilds the app's screen (e.g. after the camera app), but this ref follows along.
export const navigationRef = createNavigationContainerRef<MainStackParamList>();

// How long to wait for a rebuilt navigator before giving up; slow phones can take a few seconds
const READY_TIMEOUT_MS = 10000;

const readyListeners = new Set<() => void>();

// Called by the NavigationContainer once it is mounted and can navigate
export const notifyNavigationReady = (): void => {
  readyListeners.forEach(listener => listener());
  readyListeners.clear();
};

// Resolves true once a navigator can take navigate() calls, or false if none shows up in time.
// A result coming back from another app (e.g. the camera) can arrive before the rebuilt screen mounts.
export const waitForNavigationReady = (): Promise<boolean> => {
  if (navigationRef.isReady()) {
    return Promise.resolve(true);
  }
  return new Promise(resolve => {
    const listener = () => {
      clearTimeout(timer);
      resolve(true);
    };
    const timer = setTimeout(() => {
      readyListeners.delete(listener);
      resolve(false);
    }, READY_TIMEOUT_MS);
    readyListeners.add(listener);
  });
};

// Last navigation state, kept in memory only. When Android destroys and recreates the screen
// while the app keeps running, the navigator starts again from this instead of the home tab.
// It is gone after a real restart, which then starts fresh as usual.
let lastState: NavigationState | undefined;

export const navigationStateMemory = {
  get: (): NavigationState | undefined => lastState,
  set: (state: NavigationState | undefined): void => {
    lastState = state;
  },
};
