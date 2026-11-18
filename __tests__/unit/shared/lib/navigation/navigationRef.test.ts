import {
  navigationStateMemory,
  notifyNavigationReady,
  waitForNavigationReady,
} from '@/shared/lib/navigation';

describe('waitForNavigationReady', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('resolves true once the rebuilt navigator mounts', async () => {
    const ready = waitForNavigationReady();
    notifyNavigationReady();
    await expect(ready).resolves.toBe(true);
  });

  it('gives up when no navigator mounts in time', async () => {
    const ready = waitForNavigationReady();
    jest.advanceTimersByTime(10000);
    await expect(ready).resolves.toBe(false);
  });

  it('ignores a navigator that mounts after it gave up', async () => {
    const ready = waitForNavigationReady();
    jest.advanceTimersByTime(10000);
    notifyNavigationReady();
    await expect(ready).resolves.toBe(false);
  });
});

describe('navigationStateMemory', () => {
  it('returns the last saved state', () => {
    const state = { key: 'root', index: 0, routes: [] } as any;
    navigationStateMemory.set(state);
    expect(navigationStateMemory.get()).toBe(state);
    navigationStateMemory.set(undefined);
    expect(navigationStateMemory.get()).toBeUndefined();
  });
});
