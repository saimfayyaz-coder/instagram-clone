// Fixed values used by E2E tests. Users are created per test file through the test API (testApi.ts).
export const TEST_DATA = {
  // Never a real password: test users get random ones
  INVALID_PASSWORD: 'wrong-password-123',
  // Accessibility labels (en) of the post like button
  LIKE_LABELS: {
    LIKE: 'Like',
    UNLIKE: 'Unlike',
  },
} as const;
