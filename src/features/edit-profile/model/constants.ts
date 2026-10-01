export const EDIT_PROFILE_SUB_VIEWS = {
  MAIN: 'main',
  NAME: 'name',
  USERNAME: 'username',
  BIO: 'bio',
  LINKS: 'links',
} as const;

export type EditProfileSubView =
  (typeof EDIT_PROFILE_SUB_VIEWS)[keyof typeof EDIT_PROFILE_SUB_VIEWS];

export type EditProfileEditableField =
  Exclude<EditProfileSubView, typeof EDIT_PROFILE_SUB_VIEWS.MAIN>;
