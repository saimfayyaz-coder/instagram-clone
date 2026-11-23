import { computeResizeSize } from '@/shared/lib/media/resize/computeResizeSize';

describe('computeResizeSize', () => {
  it('leaves an image that already fits alone', () => {
    expect(computeResizeSize(500, 500, 500)).toBeNull();
    expect(computeResizeSize(300, 200, 500)).toBeNull();
  });

  it('scales a landscape photo by its width', () => {
    expect(computeResizeSize(4000, 3000, 1080)).toEqual({ width: 1080, height: 810 });
  });

  it('scales a portrait photo by its height', () => {
    expect(computeResizeSize(3000, 4000, 500)).toEqual({ width: 375, height: 500 });
  });

  it('never rounds a side down to zero', () => {
    expect(computeResizeSize(10000, 2, 500)).toEqual({ width: 500, height: 1 });
  });
});
