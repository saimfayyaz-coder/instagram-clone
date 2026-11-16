export const POST_ASPECT_RATIOS = {
  SQUARE: 1,
  PORTRAIT: 4 / 5,
  LANDSCAPE: 1.91,
} as const;

export const POST_CONFIG = {
  // Longer captions are cut with a "more" button
  CAPTION_PREVIEW_LENGTH: 90,
} as const;

export const FEED_CONFIG = {
  PAGE_SIZE: 6,
  // Fake network time for the mock feed
  MOCK_DELAY_MS: 800,
} as const;
