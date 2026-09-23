import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { useAppDispatch } from '../store/hooks';
import { bootstrapAuth } from '../lib/bootstrapAuth';

export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        await bootstrapAuth(dispatch);
      } finally {
        await BootSplash.hide({ fade: true });
      }
    };

    init();
  }, [dispatch]);

  return <>{children}</>;
};
