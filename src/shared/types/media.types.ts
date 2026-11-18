import { MaskShape } from '@/shared/constants/media';

export type { MaskShape };

// A local image file, whatever library produced it
export interface MediaAsset {
  uri: string;
  width: number;
  height: number;
  mime?: string;
  fileName?: string;
}

export interface MediaAlbum {
  title: string;
  // Unknown for Recents, since one photo can be in several albums
  count?: number;
}

export interface CropOptions {
  // Width divided by height of the crop area
  aspect: number;
  mask: MaskShape;
  // Output width in pixels; height follows the aspect
  size: number;
  quality: number;
}

