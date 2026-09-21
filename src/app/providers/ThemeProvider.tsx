import React, { useState, useMemo } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { ThemeContext } from '@/shared/hooks/useTheme';
import { lightTheme, darkTheme, ThemeMode, Theme } from '@/shared/theme';
import { storage, STORAGE_KEYS } from '@/shared/lib/mmkv/appStorage';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();

  const [mode, setModeState] = useState<ThemeMode>(() => {
    const savedMode = storage.getString(STORAGE_KEYS.THEME_MODE);
    if (
      savedMode === 'light' ||
      savedMode === 'dark' ||
      savedMode === 'system'
    ) {
      return savedMode;
    }
    return 'system';
  });

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    storage.setString(STORAGE_KEYS.THEME_MODE, newMode);
  };

  const activeTheme: Theme = useMemo(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return mode === 'dark' ? darkTheme : lightTheme;
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
