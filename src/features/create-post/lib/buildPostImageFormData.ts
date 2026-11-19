import { MediaAsset } from '@/shared/types';
import { isAndroid, MIME_TYPES, UPLOAD_FIELDS } from '@/shared/constants';

export const buildPostImageFormData = (image: MediaAsset, aspectRatio: number): FormData => {
  const formData = new FormData();
  formData.append(UPLOAD_FIELDS.ASPECT_RATIO, String(aspectRatio));
  formData.append(UPLOAD_FIELDS.POST_IMAGE, {
    uri: isAndroid ? image.uri : image.uri.replace('file://', ''),
    name: image.fileName || `post-${Date.now()}.jpg`,
    type: image.mime || MIME_TYPES.JPEG,
  } as unknown as Blob);
  return formData;
};
