export const POST_ASPECT_RATIOS = {
  SQUARE: 1,
  PORTRAIT: 4 / 5,
  LANDSCAPE: 1.91,
} as const;

// Order the crop-shape button cycles through; square first, like Instagram
export const POST_ASPECT_RATIO_CYCLE = [
  POST_ASPECT_RATIOS.SQUARE,
  POST_ASPECT_RATIOS.PORTRAIT,
  POST_ASPECT_RATIOS.LANDSCAPE,
] as const;

export type PostAspectRatio = (typeof POST_ASPECT_RATIOS)[keyof typeof POST_ASPECT_RATIOS];

// Mirrors the server's POST_LIMITS; keep both in sync
export const POST_LIMITS = {
  MAX_IMAGES: 10,
  CAPTION_MAX_LENGTH: 2200,
  MAX_HASHTAGS: 30,
  MAX_MENTIONS: 20,
  LOCATION_MAX_LENGTH: 100,
  ALT_TEXT_MAX_LENGTH: 300,
} as const;

export const POST_CONFIG = {
  // Longer captions are cut with a "more" button
  CAPTION_PREVIEW_LENGTH: 90,
  // The caption counter appears once the caption is this long
  CAPTION_COUNTER_FROM: POST_LIMITS.CAPTION_MAX_LENGTH - 200,
} as const;

export const USER_POSTS_CONFIG = {
  // Six rows of the three-column profile grid
  PAGE_SIZE: 18,
  // Skeleton rows on the profile grid while the first page loads
  GRID_SKELETON_ROWS: 4,
  // Skeleton cards on a user's post feed while it loads
  FEED_SKELETON_POSTS: 2,
  // Least posts the user's post feed renders on open
  FEED_MIN_INITIAL_RENDER: 3,
} as const;

export const FEED_CONFIG = {
  PAGE_SIZE: 10,
  // Starts loading the next page about one post before the end
  END_REACHED_THRESHOLD: 1,
  // Enough to fill the screen on first load
  SKELETON_POSTS: 2,
} as const;
