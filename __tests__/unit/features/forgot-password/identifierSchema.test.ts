import { identifierSchema } from '@/features/forgot-password';

describe('identifierSchema', () => {
  it('passes when identifier is a non-empty string', () => {
    expect(identifierSchema.safeParse({ identifier: 'test@example.com' }).success).toBe(true);
    expect(identifierSchema.safeParse({ identifier: 'johndoe' }).success).toBe(true);
  });

  it('fails when identifier is empty or whitespace only', () => {
    expect(identifierSchema.safeParse({ identifier: '' }).success).toBe(false);
    expect(identifierSchema.safeParse({ identifier: '   ' }).success).toBe(false);
  });
});
