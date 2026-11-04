import React from 'react';
import {
  AvatarEditSection,
  ProfileFieldList,
  EditProfileEditableField,
} from '@/features/edit-profile';

export interface EditProfileMainWidgetProps {
  onSelectField?: (field: EditProfileEditableField) => void;
}

export const EditProfileMainWidget: React.FC<EditProfileMainWidgetProps> = ({
  onSelectField,
}) => {
  return (
    <>
      <AvatarEditSection />
      <ProfileFieldList onSelectField={onSelectField} />
    </>
  );
};
