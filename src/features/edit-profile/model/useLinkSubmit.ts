import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  useAddLinkMutation,
  useEditLinkMutation,
  useDeleteLinkMutation,
} from '@/entities/user';
import { useToast } from '@/shared/hooks';
import { executeFormMutation } from '@/shared/lib/forms/executeFormMutation';

export interface SaveLinkPayload {
  linkId?: string;
  url: string;
  title?: string;
}

export const useLinkSubmit = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();

  const [addLink, { isLoading: isAdding }] = useAddLinkMutation();
  const [editLink, { isLoading: isEditing }] = useEditLinkMutation();
  const [deleteLink, { isLoading: isDeleting }] = useDeleteLinkMutation();

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const saveLink = useCallback(
    async (payload: SaveLinkPayload, onSuccess?: () => void) => {
      setErrorMessage(undefined);

      const mutationPromise = payload.linkId
        ? editLink({ linkId: payload.linkId, url: payload.url, title: payload.title }).unwrap()
        : addLink({ url: payload.url, title: payload.title }).unwrap();

      const success = await executeFormMutation({
        mutationPromise,
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigation.goBack();
          }
        },
        setError: (field, error) => {
          // Only show field-level errors on input; general/network errors go to toast
          if (field && field !== 'root') {
            setErrorMessage(error?.message);
          }
        },
        clearErrors: () => {
          setErrorMessage(undefined);
        },
        showToast: (message) => {
          showToast({
            message,
            type: 'error',
          });
        },
      });

      return success;
    },
    [addLink, editLink, navigation, showToast],
  );

  const removeLink = useCallback(
    async (linkId: string, onSuccess?: () => void) => {
      setErrorMessage(undefined);

      const success = await executeFormMutation({
        mutationPromise: deleteLink({ linkId }).unwrap(),
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigation.goBack();
          }
        },
        setError: (field, error) => {
          if (field && field !== 'root') {
            setErrorMessage(error?.message);
          }
        },
        clearErrors: () => {
          setErrorMessage(undefined);
        },
        showToast: (message) => {
          showToast({
            message,
            type: 'error',
          });
        },
      });

      return success;
    },
    [deleteLink, navigation, showToast],
  );

  return {
    saveLink,
    removeLink,
    isSaving: isAdding || isEditing,
    isDeleting,
    errorMessage,
    setErrorMessage,
  };
};
