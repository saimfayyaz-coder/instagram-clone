import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
  AvatarEditSection,
  ProfileFieldList,
  EditProfileEditableField,
} from '@/features/edit-profile';
import { ms } from '@/shared/theme';

export interface EditProfileMainWidgetProps {
  onSelectField?: (field: EditProfileEditableField) => void;
}

export const EditProfileMainWidget: React.FC<EditProfileMainWidgetProps> = ({
  onSelectField,
}) => {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <AvatarEditSection />
      <ProfileFieldList onSelectField={onSelectField} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: ms(40),
  },
});
