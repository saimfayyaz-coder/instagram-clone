const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/i;

// Profiles opened from mock data have made-up ids the posts API would reject
export const isServerId = (id?: string | null): id is string =>
  Boolean(id && OBJECT_ID_PATTERN.test(id));
