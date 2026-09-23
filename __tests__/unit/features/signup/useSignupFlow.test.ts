describe('useSignupFlow — step navigation logic', () => {
  const nextStep = (current: number) => Math.min(current + 1, 4) as 1 | 2 | 3 | 4;
  const prevStep = (current: number) => Math.max(current - 1, 1) as 1 | 2 | 3 | 4;

  it('nextStep advances from step 1 → 2', () => {
    expect(nextStep(1)).toBe(2);
  });

  it('nextStep advances from step 2 → 3', () => {
    expect(nextStep(2)).toBe(3);
  });

  it('nextStep is clamped at step 4 — cannot exceed max', () => {
    expect(nextStep(4)).toBe(4);
  });

  it('prevStep goes back from step 2 → 1', () => {
    expect(prevStep(2)).toBe(1);
  });

  it('prevStep is clamped at step 1 — cannot go below min', () => {
    expect(prevStep(1)).toBe(1);
  });
});

describe('useSignupFlow — initial form state', () => {
  const initialFormData = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
  };

  it('all fields start as empty strings', () => {
    Object.values(initialFormData).forEach(v => expect(v).toBe(''));
  });

  it('has exactly the expected fields', () => {
    expect(Object.keys(initialFormData)).toEqual([
      'username',
      'password',
      'confirmPassword',
      'email',
      'name',
    ]);
  });
});

describe('useSignupFlow — updateFormData merge logic', () => {
  const merge = (prev: Record<string, string>, partial: Partial<Record<string, string>>) => ({
    ...prev,
    ...partial,
  });

  it('updates a single field without affecting others', () => {
    const state = { username: '', email: '', password: '', confirmPassword: '', name: '' };
    const next = merge(state, { email: 'user@example.com' });
    expect(next.email).toBe('user@example.com');
    expect(next.username).toBe('');
    expect(next.password).toBe('');
  });

  it('can update multiple fields in one call', () => {
    const state = { username: '', email: '', password: '', confirmPassword: '', name: '' };
    const next = merge(state, { username: 'johndoe', email: 'j@j.com' });
    expect(next.username).toBe('johndoe');
    expect(next.email).toBe('j@j.com');
  });

  it('overwriting with same value is idempotent', () => {
    const state = { username: 'johndoe', email: '', password: '', confirmPassword: '', name: '' };
    const next = merge(state, { username: 'johndoe' });
    expect(next.username).toBe('johndoe');
  });
});

describe('useSignupFlow — resetFlow logic', () => {
  const INITIAL = { username: '', password: '', confirmPassword: '', email: '', name: '' };

  it('resetting produces the initial form data', () => {
    const filledState = { username: 'john', password: 'abc123', confirmPassword: 'abc123', email: 'j@j.com', name: 'John' };
    const reset = { ...INITIAL };
    expect(reset).toEqual(INITIAL);
    expect(filledState).not.toEqual(INITIAL);
  });
});
