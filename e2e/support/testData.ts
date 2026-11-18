// Fixed values used by E2E tests. The test account itself comes from env.ts (.env.e2e or CI secrets).
export const TEST_DATA = {
  // Never a real password for the test account
  INVALID_PASSWORD: 'wrong-password-123',
  // Accessibility labels (en) of the post like button
  LIKE_LABELS: {
    LIKE: 'Like',
    UNLIKE: 'Unlike',
  },
} as const;
