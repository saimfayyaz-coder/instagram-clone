import { loginSchema } from '@/features/login-by-email/model/loginSchema';

describe('loginSchema', () => {
  describe('identifier field', () => {
    it('passes with a valid email identifier', () => {
      const result = loginSchema.safeParse({ identifier: 'user@example.com', password: 'pass123' });
      expect(result.success).toBe(true);
    });

    it('passes with a username identifier', () => {
      const result = loginSchema.safeParse({ identifier: 'johndoe', password: 'pass123' });
      expect(result.success).toBe(true);
    });

    it('fails when identifier is empty', () => {
      const result = loginSchema.safeParse({ identifier: '', password: 'pass123' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().identifier?._errors).toHaveLength(1);
      }
    });

    it('fails when identifier is only whitespace (trimmed to empty)', () => {
      const result = loginSchema.safeParse({ identifier: '   ', password: 'pass123' });
      expect(result.success).toBe(false);
    });
  });

  describe('password field', () => {
    it('passes with exactly 6 characters', () => {
      const result = loginSchema.safeParse({ identifier: 'user', password: '123456' });
      expect(result.success).toBe(true);
    });

    it('fails when password is empty', () => {
      const result = loginSchema.safeParse({ identifier: 'user', password: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().password?._errors.length).toBeGreaterThan(0);
      }
    });

    it('fails when password has fewer than 6 characters', () => {
      const result = loginSchema.safeParse({ identifier: 'user', password: '123' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().password?._errors.length).toBeGreaterThan(0);
      }
    });

    it('passes with a long password', () => {
      const result = loginSchema.safeParse({ identifier: 'user', password: 'super-secure-password-123!' });
      expect(result.success).toBe(true);
    });
  });
});
