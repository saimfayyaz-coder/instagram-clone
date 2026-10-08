import React, { useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/shared/components/molecules';
import { Icon } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { useAppSelector } from '@/app/store/hooks';
import {
  selectCurrentUser,
  getUserDisplayName,
  useUpdateProfileMutation,
  GenderType,
  formatGenderLabel,
} from '@/entities/user';
import { MAIN_ROUTES, APP_ICONS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';
import { EDIT_PROFILE_SUB_VIEWS, EditProfileEditableField } from '../model/constants';
import { LinksSection } from './LinksSection';
import { GenderSelectionBottomSheet } from './GenderSelectionBottomSheet';
import { ms } from '@/shared/theme';

export interface ProfileFieldListProps {
  onSelectField?: (field: EditProfileEditableField) => void;
}

export const ProfileFieldList: React.FC<ProfileFieldListProps> = ({
  onSelectField,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const currentUser = useAppSelector(selectCurrentUser);
  const [updateProfile] = useUpdateProfileMutation();
  const genderSheetRef = useRef<BottomSheetModal | null>(null);

  const handleNavigateToName = useCallback(() => {
    if (onSelectField) {
      onSelectField(EDIT_PROFILE_SUB_VIEWS.NAME);
    } else {
      navigation.navigate(MAIN_ROUTES.EDIT_PROFILE_NAME);
    }
  }, [navigation, onSelectField]);

  const handleNavigateToUsername = useCallback(() => {
    if (onSelectField) {
      onSelectField(EDIT_PROFILE_SUB_VIEWS.USERNAME);
    } else {
      navigation.navigate(MAIN_ROUTES.EDIT_PROFILE_USERNAME);
    }
  }, [navigation, onSelectField]);

  const handleNavigateToBio = useCallback(() => {
    if (onSelectField) {
      onSelectField(EDIT_PROFILE_SUB_VIEWS.BIO);
    } else {
      navigation.navigate(MAIN_ROUTES.EDIT_PROFILE_BIO);
    }
  }, [navigation, onSelectField]);

  const handleNavigateToAddLink = useCallback(() => {
    if (onSelectField) {
      onSelectField(EDIT_PROFILE_SUB_VIEWS.ADD_EDIT_LINK);
    }
  }, [onSelectField]);

  const handleNavigateToLinks = useCallback(() => {
    if (onSelectField) {
      onSelectField(EDIT_PROFILE_SUB_VIEWS.LINKS_MANAGER);
    } else {
      navigation.navigate(MAIN_ROUTES.EDIT_PROFILE_LINKS);
    }
  }, [navigation, onSelectField]);

  const handleOpenGender = useCallback(() => {
    genderSheetRef.current?.present();
  }, []);

  const handleSelectGender = useCallback(
    async (gender: GenderType) => {
      try {
        await updateProfile({ gender }).unwrap();
      } catch {
        // Silently handled
      }
    },
    [updateProfile],
  );

  const genderDisplayValue = useMemo(() => {
    return (
      formatGenderLabel(currentUser?.gender, t) ||
      t(TRANSLATION_KEYS.PROFILE_GENDER_PREFER_NOT_TO_SAY)
    );
  }, [currentUser?.gender, t]);

  const genderChevron = useMemo(
    () => (
      <Icon
        type="Ionicons"
        name={APP_ICONS.CHEVRON_DOWN}
        size={18}
        color={theme.colors.textSecondary}
      />
    ),
    [theme.colors.textSecondary],
  );

  return (
    <View style={styles.container}>
      {/* 1. Name */}
      <FormField
        label={t(TRANSLATION_KEYS.PROFILE_NAME)}
        value={getUserDisplayName(currentUser)}
        placeholder={t(TRANSLATION_KEYS.PROFILE_NAME_PLACEHOLDER)}
        editable={false}
        onPress={handleNavigateToName}
      />

      {/* 2. Username */}
      <FormField
        label={t(TRANSLATION_KEYS.PROFILE_USERNAME)}
        value={currentUser?.username}
        placeholder={t(TRANSLATION_KEYS.PROFILE_USERNAME)}
        editable={false}
        onPress={handleNavigateToUsername}
      />

      {/* 3. Bio (single-line height, horizontally scrollable) */}
      <FormField
        label={t(TRANSLATION_KEYS.PROFILE_BIO)}
        value={currentUser?.bio}
        placeholder={t(TRANSLATION_KEYS.PROFILE_BIO_PLACEHOLDER)}
        editable={false}
        horizontalScroll
        onPress={handleNavigateToBio}
      />

      {/* 4. Links Section */}
      <LinksSection
        links={currentUser?.links}
        onAddLink={handleNavigateToAddLink}
        onOpenLinks={handleNavigateToLinks}
      />

      {/* 5. Gender (with chevron-down on right) */}
      <FormField
        label={t(TRANSLATION_KEYS.PROFILE_GENDER)}
        value={genderDisplayValue}
        placeholder={t(TRANSLATION_KEYS.PROFILE_GENDER_PREFER_NOT_TO_SAY)}
        editable={false}
        onPress={handleOpenGender}
        rightElement={genderChevron}
      />

      <GenderSelectionBottomSheet
        bottomSheetRef={genderSheetRef}
        currentGender={currentUser?.gender}
        onSelect={handleSelectGender}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ms(16),
    marginTop: ms(8),
  },
});
