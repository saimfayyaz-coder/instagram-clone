import type { UseFormSetError, UseFormClearErrors, FieldValues } from 'react-hook-form';
import { parseApiError, ParsedApiError } from '../errors';

export interface ExecuteFormMutationOptions<TData, TFieldValues extends FieldValues = any> {
  mutationPromise: Promise<TData>;
  onSuccess?: (data: TData) => void | Promise<void>;
  onError?: (parsedError: ParsedApiError) => void;
  setError?: UseFormSetError<TFieldValues>;
  clearErrors?: UseFormClearErrors<TFieldValues>;
  showToast?: (message: string) => void;
}

// Unwraps mutation, maps field errors to inputs, and triggers toast for general errors
export async function executeFormMutation<TData, TFieldValues extends FieldValues = any>({
  mutationPromise,
  onSuccess,
  onError,
  setError,
  clearErrors,
  showToast,
}: ExecuteFormMutationOptions<TData, TFieldValues>): Promise<boolean> {
  if (clearErrors) {
    clearErrors('root' as any);
  }

  try {
    const data = await mutationPromise;
    if (onSuccess) {
      await onSuccess(data);
    }
    return true;
  } catch (err) {
    const parsed = parseApiError(err);

    const isGlobalHandled =
      parsed.code === 'NETWORK_ERROR' ||
      parsed.code === 'TIMEOUT_ERROR' ||
      (typeof parsed.status === 'number' && parsed.status >= 500);

    const hasFieldErrors = Boolean(
      parsed.fieldErrors && Object.keys(parsed.fieldErrors).length > 0,
    );

    // 1. If backend returned field-specific errors, map directly to form inputs
    if (hasFieldErrors && setError) {
      Object.entries(parsed.fieldErrors!).forEach(([field, msg]) => {
        setError(field as any, { message: msg });
      });
    } else if (setError && !isGlobalHandled) {
      // 2. Otherwise set root error on form (if not handled globally)
      setError('root' as any, { message: parsed.message });
    }

    // 3. Dispatch Toast if not handled globally and not an inline field error
    if (showToast && !isGlobalHandled && !hasFieldErrors) {
      showToast(parsed.message);
    }

    if (onError) {
      onError(parsed);
    }

    return false;
  }
}
