import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export const useBackHandler = (
  handler: () => boolean,
  enabled: boolean = true,
): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handler,
    );

    return () => {
      subscription.remove();
    };
  }, [handler, enabled]);
};
