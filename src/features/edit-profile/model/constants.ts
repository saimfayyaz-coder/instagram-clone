export const EDIT_PROFILE_SUB_VIEWS = {
  MAIN: 'main',
  NAME: 'name',
  USERNAME: 'username',
  BIO: 'bio',
  LINKS_MANAGER: 'links_manager',
  ADD_EDIT_LINK: 'add_edit_link',
} as const;

export type EditProfileSubView =
  (typeof EDIT_PROFILE_SUB_VIEWS)[keyof typeof EDIT_PROFILE_SUB_VIEWS];

export type EditProfileEditableField =
  Exclude<EditProfileSubView, typeof EDIT_PROFILE_SUB_VIEWS.MAIN>;
