/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Dev-only warning shown when system animations are off (Detox E2E turns them off).
// Its LogBox banner covers the bottom of the screen and blocks taps in E2E tests.
LogBox.ignoreLogs(['[Reanimated] Reduced motion setting is enabled']);

AppRegistry.registerComponent(appName, () => App);
