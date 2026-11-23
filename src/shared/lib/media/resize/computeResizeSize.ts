export interface ImageSize {
  width: number;
  height: number;
}

// Scales the longest side down to maxEdge, keeping the aspect ratio.
// Returns null when the image already fits, so it is never enlarged or re-encoded for nothing.
export const computeResizeSize = (
  width: number,
  height: number,
  maxEdge: number,
): ImageSize | null => {
  const longest = Math.max(width, height);
  if (longest <= maxEdge) {
    return null;
  }
  const scale = maxEdge / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};
