import {
  createStep1UsernameSchema,
  createStep2PasswordSchema,
  createStep3EmailSchema,
  USERNAME_REGEX,
} from '@/features/signup/model/signupSchemas';

// Use default i18n.t by not passing a custom t function
const step1 = createStep1UsernameSchema();
const step2 = createStep2PasswordSchema();
const step3 = createStep3EmailSchema();

// ─── USERNAME_REGEX sanity check ─────────────────────────────────────────────
describe('USERNAME_REGEX', () => {
  it.each(['johndoe', 'john.doe', 'john_doe', 'JohnDoe99', 'a.b_c'])(
    'allows valid username: %s',
    (u) => expect(USERNAME_REGEX.test(u)).toBe(true),
  );

  it.each(['john@doe', 'john doe', 'john#doe', 'john!'])(
    'rejects invalid username: %s',
    (u) => expect(USERNAME_REGEX.test(u)).toBe(false),
  );
});

// ─── Step 1: Username ─────────────────────────────────────────────────────────
describe('Step 1 — Username schema', () => {
  it('passes with a valid username', () => {
    expect(step1.safeParse({ username: 'johndoe' }).success).toBe(true);
  });

  it('fails when username is too short (< 3 chars)', () => {
    const result = step1.safeParse({ username: 'ab' });
    expect(result.success).toBe(false);
  });

  it('fails when username is too long (> 30 chars)', () => {
    const result = step1.safeParse({ username: 'a'.repeat(31) });
    expect(result.success).toBe(false);
  });

  it('passes at exactly 3 characters (minimum boundary)', () => {
    expect(step1.safeParse({ username: 'abc' }).success).toBe(true);
  });

  it('passes at exactly 30 characters (maximum boundary)', () => {
    expect(step1.safeParse({ username: 'a'.repeat(30) }).success).toBe(true);
  });

  it('fails with invalid characters (space, @, #)', () => {
    expect(step1.safeParse({ username: 'john doe' }).success).toBe(false);
    expect(step1.safeParse({ username: 'john@doe' }).success).toBe(false);
    expect(step1.safeParse({ username: 'john#doe' }).success).toBe(false);
  });
});

// ─── Step 2: Password ────────────────────────────────────────────────────────
describe('Step 2 — Password schema', () => {
  it('passes when passwords match and meet minimum length', () => {
    const result = step2.safeParse({ password: 'secure1', confirmPassword: 'secure1' });
    expect(result.success).toBe(true);
  });

  it('fails when password is too short (< 6 chars)', () => {
    const result = step2.safeParse({ password: '123', confirmPassword: '123' });
    expect(result.success).toBe(false);
  });

  it('fails when passwords do not match', () => {
    const result = step2.safeParse({ password: 'password1', confirmPassword: 'password2' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = result.error.format();
      expect(formatted.confirmPassword?._errors.length).toBeGreaterThan(0);
    }
  });

  it('fails when confirmPassword is empty', () => {
    const result = step2.safeParse({ password: 'password1', confirmPassword: '' });
    expect(result.success).toBe(false);
  });
});

// ─── Step 3: Email ───────────────────────────────────────────────────────────
describe('Step 3 — Email schema', () => {
  it('passes with a valid email', () => {
    expect(step3.safeParse({ email: 'user@example.com' }).success).toBe(true);
  });

  it('passes with an optional name', () => {
    expect(step3.safeParse({ email: 'user@example.com', name: 'John Doe' }).success).toBe(true);
  });

  it('passes with name omitted entirely', () => {
    expect(step3.safeParse({ email: 'user@example.com' }).success).toBe(true);
  });

  it('fails with an invalid email format', () => {
    expect(step3.safeParse({ email: 'notanemail' }).success).toBe(false);
    expect(step3.safeParse({ email: 'missing@domain' }).success).toBe(false);
  });

  it('fails when email is empty', () => {
    const result = step3.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });

  it('fails when email is only whitespace', () => {
    const result = step3.safeParse({ email: '   ' });
    expect(result.success).toBe(false);
  });
});
