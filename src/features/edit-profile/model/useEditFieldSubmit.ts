import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUpdateProfileMutation, UpdateProfilePayload } from '@/entities/user';
import { executeFormMutation } from '@/shared/lib/forms/executeFormMutation';

export const useEditFieldSubmit = () => {
  const navigation = useNavigation();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const submitField = useCallback(
    async (payload: UpdateProfilePayload, onSuccess?: () => void) => {
      setErrorMessage(undefined);

      const success = await executeFormMutation({
        mutationPromise: updateProfile(payload).unwrap(),
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigation.goBack();
          }
        },
        setError: (_field, error) => {
          setErrorMessage(error?.message);
        },
        clearErrors: () => {
          setErrorMessage(undefined);
        },
        showToast: true,
      });

      return success;
    },
    [updateProfile, navigation],
  );

  return {
    submitField,
    isSaving,
    errorMessage,
    setErrorMessage,
  };
};
