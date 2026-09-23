import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '@/app/store/store';
import { ThemeProvider, AppInitializer } from '@/app/providers';
import { RootNavigator } from '@/app/navigation';
import '@/shared/lib/i18n';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <AppInitializer>
                <RootNavigator />
              </AppInitializer>
            </ThemeProvider>
          </PersistGate>
        </ReduxProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

export default App;
