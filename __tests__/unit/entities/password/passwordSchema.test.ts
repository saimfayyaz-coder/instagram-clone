import { passwordSchema } from '@/entities/password';

describe('passwordSchema', () => {
  it('passes when password is at least 6 characters and matches confirmPassword', () => {
    const result = passwordSchema.safeParse({
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('fails when password is shorter than 6 characters', () => {
    const result = passwordSchema.safeParse({
      password: '12345',
      confirmPassword: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('fails when passwords do not match', () => {
    const result = passwordSchema.safeParse({
      password: 'password123',
      confirmPassword: 'password456',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword');
    }
  });

  it('fails when confirmPassword is empty', () => {
    const result = passwordSchema.safeParse({
      password: 'password123',
      confirmPassword: '',
    });
    expect(result.success).toBe(false);
  });
});
