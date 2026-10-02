import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyCheckUsernameQuery } from '../api/userApi';
import { createUsernameSchema } from './userValidation';
import { parseApiError } from '@/shared/lib/errors';

interface UseUsernameAvailabilityOptions {
  currentUsername?: string;
  debounceMs?: number;
}

export const useUsernameAvailability = ({
  currentUsername,
  debounceMs = 400,
}: UseUsernameAvailabilityOptions = {}) => {
  const { t } = useTranslation();
  const [triggerCheck] = useLazyCheckUsernameQuery();

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentCheckRef = useRef<string>('');

  const clearTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const resetAvailability = useCallback(() => {
    clearTimer();
    currentCheckRef.current = '';
    setIsAvailable(null);
    setIsChecking(false);
    setAvailabilityError(null);
  }, [clearTimer]);

  const checkAvailability = useCallback(
    (rawUsername: string) => {
      clearTimer();
      const trimmed = rawUsername.trim();

      if (!trimmed) {
        resetAvailability();
        return;
      }

      // If username equals the user's existing username (case-insensitive)
      if (
        currentUsername &&
        trimmed.toLowerCase() === currentUsername.trim().toLowerCase()
      ) {
        currentCheckRef.current = trimmed;
        setIsChecking(false);
        setIsAvailable(true);
        setAvailabilityError(null);
        return;
      }

      // Client validation first
      const schema = createUsernameSchema(t);
      const validationResult = schema.safeParse(trimmed);

      if (!validationResult.success) {
        currentCheckRef.current = trimmed;
        setIsChecking(false);
        setIsAvailable(false);
        setAvailabilityError(validationResult.error.issues[0]?.message || null);
        return;
      }

      // Passed client validation, prepare debounced server check
      currentCheckRef.current = trimmed;
      setIsChecking(true);
      setIsAvailable(null);
      setAvailabilityError(null);

      debounceTimerRef.current = setTimeout(async () => {
        try {
          const result = await triggerCheck({ username: trimmed }).unwrap();
          if (currentCheckRef.current === trimmed) {
            setIsChecking(false);
            const isAvail = Boolean(
              result.data?.isAvailable ?? (result.data as any)?.available,
            );
            if (isAvail) {
              setIsAvailable(true);
              setAvailabilityError(null);
            } else {
              setIsAvailable(false);
              setAvailabilityError(
                result.message || 'This username is already taken.',
              );
            }
          }
        } catch (error) {
          if (currentCheckRef.current === trimmed) {
            setIsChecking(false);
            setIsAvailable(false);
            const parsed = parseApiError(error);
            setAvailabilityError(parsed.message || 'Unable to check username.');
          }
        }
      }, debounceMs);
    },
    [clearTimer, currentUsername, debounceMs, resetAvailability, t, triggerCheck],
  );

  const verifyImmediate = useCallback(
    async (rawUsername: string): Promise<boolean> => {
      clearTimer();
      const trimmed = rawUsername.trim();

      if (!trimmed) {
        setIsAvailable(false);
        setAvailabilityError('Username is required.');
        return false;
      }

      if (
        currentUsername &&
        trimmed.toLowerCase() === currentUsername.trim().toLowerCase()
      ) {
        setIsAvailable(true);
        setAvailabilityError(null);
        return true;
      }

      const schema = createUsernameSchema(t);
      const validationResult = schema.safeParse(trimmed);
      if (!validationResult.success) {
        setIsAvailable(false);
        setAvailabilityError(validationResult.error.issues[0]?.message || null);
        return false;
      }

      try {
        setIsChecking(true);
        const result = await triggerCheck({ username: trimmed }).unwrap();
        setIsChecking(false);
        const isAvail = Boolean(
          result.data?.isAvailable ?? (result.data as any)?.available,
        );
        if (isAvail) {
          setIsAvailable(true);
          setAvailabilityError(null);
          return true;
        } else {
          setIsAvailable(false);
          setAvailabilityError(
            result.message || 'This username is already taken.',
          );
          return false;
        }
      } catch (error) {
        setIsChecking(false);
        setIsAvailable(false);
        const parsed = parseApiError(error);
        setAvailabilityError(parsed.message || 'Unable to check username.');
        return false;
      }
    },
    [clearTimer, currentUsername, t, triggerCheck],
  );

  return {
    isAvailable,
    isChecking,
    availabilityError,
    checkAvailability,
    resetAvailability,
    verifyImmediate,
  };
};
