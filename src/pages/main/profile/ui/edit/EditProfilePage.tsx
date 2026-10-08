import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '@/shared/components/organisms';
import { ScreenWrapper } from '@/shared/components/layout';
import { useBackHandler } from '@/shared/hooks';
import {
  EDIT_PROFILE_SUB_VIEWS,
  EditProfileSubView,
  EditProfileEditableField,
} from '@/features/edit-profile';
import { EditProfileMainWidget } from '@/widgets/edit-profile';
import { HEADER_LEFT_ICON_TYPE } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { UserLink } from '@/entities/user';
import { EditNameScreen } from './fields/EditNameScreen';
import { EditUsernameScreen } from './fields/EditUsernameScreen';
import { EditBioScreen } from './fields/EditBioScreen';
import { LinksManagerScreen } from './links/LinksManagerScreen';
import { AddEditLinkScreen } from './links/AddEditLinkScreen';

export const EditProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [activeSubView, setActiveSubView] = useState<EditProfileSubView>(
    EDIT_PROFILE_SUB_VIEWS.MAIN,
  );
  const [editingLinkContext, setEditingLinkContext] = useState<UserLink | null>(null);
  const [addEditLinkReturnTarget, setAddEditLinkReturnTarget] = useState<EditProfileSubView>(
    EDIT_PROFILE_SUB_VIEWS.MAIN,
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBackToMain = useCallback(() => {
    setActiveSubView(EDIT_PROFILE_SUB_VIEWS.MAIN);
  }, []);

  const handleSelectField = useCallback((field: EditProfileEditableField) => {
    if (field === EDIT_PROFILE_SUB_VIEWS.ADD_EDIT_LINK) {
      setEditingLinkContext(null);
      setAddEditLinkReturnTarget(EDIT_PROFILE_SUB_VIEWS.MAIN);
      setActiveSubView(EDIT_PROFILE_SUB_VIEWS.ADD_EDIT_LINK);
    } else {
      setActiveSubView(field);
    }
  }, []);

  const handleAddLinkFromManager = useCallback(() => {
    setEditingLinkContext(null);
    setAddEditLinkReturnTarget(EDIT_PROFILE_SUB_VIEWS.LINKS_MANAGER);
    setActiveSubView(EDIT_PROFILE_SUB_VIEWS.ADD_EDIT_LINK);
  }, []);

  const handleEditLinkFromManager = useCallback((link: UserLink) => {
    setEditingLinkContext(link);
    setAddEditLinkReturnTarget(EDIT_PROFILE_SUB_VIEWS.LINKS_MANAGER);
    setActiveSubView(EDIT_PROFILE_SUB_VIEWS.ADD_EDIT_LINK);
  }, []);

  const handleBackFromAddEditLink = useCallback(() => {
    setActiveSubView(addEditLinkReturnTarget);
    setEditingLinkContext(null);
  }, [addEditLinkReturnTarget]);

  const handleHardwareBack = useCallback(() => {
    if (activeSubView === EDIT_PROFILE_SUB_VIEWS.ADD_EDIT_LINK) {
      setActiveSubView(addEditLinkReturnTarget);
      setEditingLinkContext(null);
      return true;
    }
    if (activeSubView !== EDIT_PROFILE_SUB_VIEWS.MAIN) {
      setActiveSubView(EDIT_PROFILE_SUB_VIEWS.MAIN);
      return true;
    }
    return false;
  }, [activeSubView, addEditLinkReturnTarget]);

  useBackHandler(
    handleHardwareBack,
    activeSubView !== EDIT_PROFILE_SUB_VIEWS.MAIN,
  );

  if (activeSubView === EDIT_PROFILE_SUB_VIEWS.NAME) {
    return <EditNameScreen onBack={handleBackToMain} />;
  }

  if (activeSubView === EDIT_PROFILE_SUB_VIEWS.USERNAME) {
    return <EditUsernameScreen onBack={handleBackToMain} />;
  }

  if (activeSubView === EDIT_PROFILE_SUB_VIEWS.BIO) {
    return <EditBioScreen onBack={handleBackToMain} />;
  }

  if (activeSubView === EDIT_PROFILE_SUB_VIEWS.LINKS_MANAGER) {
    return (
      <LinksManagerScreen
        onBack={handleBackToMain}
        onAddLink={handleAddLinkFromManager}
        onEditLink={handleEditLinkFromManager}
      />
    );
  }

  if (activeSubView === EDIT_PROFILE_SUB_VIEWS.ADD_EDIT_LINK) {
    return (
      <AddEditLinkScreen
        onBack={handleBackFromAddEditLink}
        editingLink={editingLinkContext}
      />
    );
  }

  return (
    <ScreenWrapper
      header={
        <AppHeader
          onPressBack={handleGoBack}
          leftIconType={HEADER_LEFT_ICON_TYPE.BACK}
          leftText={t(TRANSLATION_KEYS.PROFILE_EDIT_PROFILE)}
        />
      }
    >
      <EditProfileMainWidget onSelectField={handleSelectField} />
    </ScreenWrapper>
  );
};
