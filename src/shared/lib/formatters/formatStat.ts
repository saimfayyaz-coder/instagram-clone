/**
 * Formats numeric counts (posts, followers, following, likes, views)
 * into compact, readable strings (e.g., 10.5K, 1.2M, 950).
 */
export const formatStat = (num: number): string => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 10_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num.toLocaleString();
};
