import React, { useState, useMemo } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { ThemeContext } from '@/shared/hooks/useTheme';
import { lightTheme, darkTheme, Theme } from '@/shared/theme';
import { THEME_MODES, ThemeMode } from '@/shared/constants';
import { storage, STORAGE_KEYS } from '@/shared/lib/mmkv/appStorage';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();

  const [mode, setModeState] = useState<ThemeMode>(() => {
    const savedMode = storage.getString(STORAGE_KEYS.THEME_MODE);
    if (
      savedMode === THEME_MODES.LIGHT ||
      savedMode === THEME_MODES.DARK ||
      savedMode === THEME_MODES.SYSTEM
    ) {
      return savedMode;
    }
    return THEME_MODES.SYSTEM;
  });

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    storage.setString(STORAGE_KEYS.THEME_MODE, newMode);
  };

  const activeTheme: Theme = useMemo(() => {
    if (mode === THEME_MODES.SYSTEM) {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return mode === THEME_MODES.DARK ? darkTheme : lightTheme;
  }, [mode, systemColorScheme]);

  const value = useMemo(
    () => ({
      theme: activeTheme,
      mode,
      setMode,
      isDark: activeTheme.isDark,
    }),
    [activeTheme, mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={activeTheme.isDark ? 'light-content' : 'dark-content'}
        animated
      />
      {children}
    </ThemeContext.Provider>
  );
};
