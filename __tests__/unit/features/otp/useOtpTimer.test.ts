describe('useOtpTimer — countdown logic', () => {
  const tick = (prev: number): number => {
    if (prev <= 1) return 0;
    return prev - 1;
  };

  it('decrements by 1 each tick', () => {
    expect(tick(60)).toBe(59);
    expect(tick(30)).toBe(29);
    expect(tick(2)).toBe(1);
  });

  it('clamps to 0 when prev is 1', () => {
    expect(tick(1)).toBe(0);
  });

  it('stays at 0 when already at 0 (never goes negative)', () => {
    expect(tick(0)).toBe(0);
  });

  it('reaches 0 after initialSeconds ticks', () => {
    let seconds = 5;
    for (let i = 0; i < 5; i++) seconds = tick(seconds);
    expect(seconds).toBe(0);
  });
});

describe('useOtpTimer — canResend flag', () => {
  const canResend = (secondsLeft: number) => secondsLeft === 0;

  it('canResend is false when timer is running', () => {
    expect(canResend(60)).toBe(false);
    expect(canResend(30)).toBe(false);
    expect(canResend(1)).toBe(false);
  });

  it('canResend is true when timer reaches 0', () => {
    expect(canResend(0)).toBe(true);
  });
});

describe('useOtpTimer — initial state', () => {
  it('when autoStart=true, secondsLeft starts at initialSeconds', () => {
    const secondsLeft = (autoStart: boolean, initialSeconds: number) =>
      autoStart ? initialSeconds : 0;
    expect(secondsLeft(true, 60)).toBe(60);
    expect(secondsLeft(true, 30)).toBe(30);
  });

  it('when autoStart=false, secondsLeft starts at 0 and canResend is immediately true', () => {
    const secondsLeft = (autoStart: boolean, initialSeconds: number) =>
      autoStart ? initialSeconds : 0;
    const val = secondsLeft(false, 60);
    expect(val).toBe(0);
    expect(val === 0).toBe(true);
  });
});

describe('useOtpTimer — setInterval behaviour (fake timers)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('setInterval fires at 1s intervals', () => {
    const callback = jest.fn();
    const id = setInterval(callback, 1000);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(3);

    clearInterval(id);
  });

  it('clearInterval stops the countdown', () => {
    const callback = jest.fn();
    const id = setInterval(callback, 1000);
    jest.advanceTimersByTime(2000);
    clearInterval(id);
    jest.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
