import { otpSchema } from '@/features/verify-otp/model/otpSchema';

describe('otpSchema', () => {
  it('passes with exactly 6 numeric digits', () => {
    expect(otpSchema.safeParse({ otp: '123456' }).success).toBe(true);
    expect(otpSchema.safeParse({ otp: '000000' }).success).toBe(true);
    expect(otpSchema.safeParse({ otp: '999999' }).success).toBe(true);
  });

  it('fails with fewer than 6 digits', () => {
    expect(otpSchema.safeParse({ otp: '12345' }).success).toBe(false);
    expect(otpSchema.safeParse({ otp: '1' }).success).toBe(false);
    expect(otpSchema.safeParse({ otp: '' }).success).toBe(false);
  });

  it('fails with more than 6 digits', () => {
    expect(otpSchema.safeParse({ otp: '1234567' }).success).toBe(false);
  });

  it('fails with non-numeric characters', () => {
    expect(otpSchema.safeParse({ otp: 'abc123' }).success).toBe(false);
    expect(otpSchema.safeParse({ otp: '12 456' }).success).toBe(false);
    expect(otpSchema.safeParse({ otp: '123-56' }).success).toBe(false);
  });

  it('fails with only whitespace', () => {
    // After trim it becomes empty
    expect(otpSchema.safeParse({ otp: '      ' }).success).toBe(false);
  });
});
