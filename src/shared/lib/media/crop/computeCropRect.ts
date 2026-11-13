export interface CropTransform {
  scale: number;
  translateX: number;
  translateY: number;
  viewportWidth: number;
  viewportHeight: number;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Smallest scale at which the image fully covers the viewport
export const getCoverScale = (
  imageWidth: number,
  imageHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): number => Math.max(viewportWidth / imageWidth, viewportHeight / imageHeight);

// How far the image can move before an edge shows inside the viewport
export const getPanLimits = (
  imageWidth: number,
  imageHeight: number,
  { scale, viewportWidth, viewportHeight }: Omit<CropTransform, 'translateX' | 'translateY'>,
) => {
  'worklet';
  const cover = Math.max(viewportWidth / imageWidth, viewportHeight / imageHeight);
  return {
    x: Math.max(0, (imageWidth * cover * scale - viewportWidth) / 2),
    y: Math.max(0, (imageHeight * cover * scale - viewportHeight) / 2),
  };
};

// Maps what's visible in the viewport back to pixels of the original image
export const computeCropRect = (
  imageWidth: number,
  imageHeight: number,
  { scale, translateX, translateY, viewportWidth, viewportHeight }: CropTransform,
): CropRect => {
  const shownScale =
    getCoverScale(imageWidth, imageHeight, viewportWidth, viewportHeight) * Math.max(scale, 1);
  const shownWidth = imageWidth * shownScale;
  const shownHeight = imageHeight * shownScale;

  const left = (shownWidth - viewportWidth) / 2 - translateX;
  const top = (shownHeight - viewportHeight) / 2 - translateY;

  const width = Math.min(viewportWidth / shownScale, imageWidth);
  const height = Math.min(viewportHeight / shownScale, imageHeight);

  return {
    x: Math.round(Math.min(Math.max(0, left / shownScale), imageWidth - width)),
    y: Math.round(Math.min(Math.max(0, top / shownScale), imageHeight - height)),
    width: Math.round(width),
    height: Math.round(height),
  };
};
