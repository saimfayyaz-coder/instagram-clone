import {
  computeCropRect,
  getPanLimits,
} from '@/shared/lib/media/crop/computeCropRect';

const SQUARE_VIEWPORT = { viewportWidth: 400, viewportHeight: 400 };

describe('computeCropRect', () => {
  it('crops the centre square of a landscape photo when nothing is moved', () => {
    const rect = computeCropRect(4000, 3000, {
      ...SQUARE_VIEWPORT,
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
    expect(rect).toEqual({ x: 500, y: 0, width: 3000, height: 3000 });
  });

  it('follows a pan to the left edge', () => {
    const { x: maxPan } = getPanLimits(4000, 3000, { ...SQUARE_VIEWPORT, scale: 1 });
    const rect = computeCropRect(4000, 3000, {
      ...SQUARE_VIEWPORT,
      scale: 1,
      translateX: maxPan,
      translateY: 0,
    });
    expect(rect.x).toBe(0);
    expect(rect.width).toBe(3000);
  });

  it('crops a smaller area when zoomed in', () => {
    const rect = computeCropRect(4000, 3000, {
      ...SQUARE_VIEWPORT,
      scale: 2,
      translateX: 0,
      translateY: 0,
    });
    expect(rect).toEqual({ x: 1250, y: 750, width: 1500, height: 1500 });
  });

  it('never goes outside the image, even with a pan past the edge', () => {
    const rect = computeCropRect(4000, 3000, {
      ...SQUARE_VIEWPORT,
      scale: 1,
      translateX: 10000,
      translateY: -10000,
    });
    expect(rect.x).toBe(0);
    expect(rect.y).toBe(0);
    expect(rect.x + rect.width).toBeLessThanOrEqual(4000);
    expect(rect.y + rect.height).toBeLessThanOrEqual(3000);
  });

  it('keeps the aspect of a non-square viewport', () => {
    const rect = computeCropRect(1000, 1000, {
      viewportWidth: 400,
      viewportHeight: 500,
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
    expect(rect).toEqual({ x: 100, y: 0, width: 800, height: 1000 });
  });
});

describe('getPanLimits', () => {
  it('allows no movement along an edge that exactly fits', () => {
    expect(getPanLimits(4000, 3000, { ...SQUARE_VIEWPORT, scale: 1 }).y).toBe(0);
  });

  it('allows more movement when zoomed in', () => {
    const normal = getPanLimits(4000, 3000, { ...SQUARE_VIEWPORT, scale: 1 });
    const zoomed = getPanLimits(4000, 3000, { ...SQUARE_VIEWPORT, scale: 2 });
    expect(zoomed.x).toBeGreaterThan(normal.x);
    expect(zoomed.y).toBeGreaterThan(0);
  });
});
