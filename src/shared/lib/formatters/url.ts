
export const formatDisplayUrl = (rawUrl: string): string => {
  if (!rawUrl) return '';
  return rawUrl.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');
};

export const sanitizeUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};
