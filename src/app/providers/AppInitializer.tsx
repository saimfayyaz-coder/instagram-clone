import React, { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { bootstrapAuth } from '../lib/bootstrapAuth';

export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    bootstrapAuth(dispatch);
  }, [dispatch]);

  return <>{children}</>;
};
