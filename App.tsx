import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '@/app/store/store';
import { ThemeProvider, AppInitializer } from '@/app/providers';
import { RootNavigator } from '@/app/navigation';
import { ToastOverlay, AlertOverlay } from '@/shared/components/molecules';
import '@/shared/lib/i18n';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ThemeProvider>
                <BottomSheetModalProvider>
                  <AppInitializer>
                    <RootNavigator />
                    <ToastOverlay />
                    <AlertOverlay />
                  </AppInitializer>
                </BottomSheetModalProvider>
              </ThemeProvider>
            </PersistGate>
          </ReduxProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
