import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { API_ENDPOINTS, HTTP_METHODS, UPLOAD_TIMEOUT_MS } from '@/shared/constants';
import { ApiPost, FEED_TAG, userPostsTag } from '@/entities/post';

export interface UploadedPostImage {
  id: string;
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
}

export interface CreatePostBody {
  mediaIds: string[];
  aspectRatio: number;
  caption: string;
  location: string;
  altTexts: string[];
  // Lets the server return the same post when a create is retried
  clientRequestId: string;
}

export const createPostApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    uploadPostImage: builder.mutation<ApiSuccessResponse<{ media: UploadedPostImage }>, FormData>({
      query: formData => ({
        url: API_ENDPOINTS.MEDIA.POST_IMAGES,
        method: HTTP_METHODS.POST,
        body: formData,
        timeout: UPLOAD_TIMEOUT_MS,
      }),
      extraOptions: {
        skipGlobalErrorToast: true,
      },
    }),

    createPost: builder.mutation<ApiSuccessResponse<{ post: ApiPost }>, CreatePostBody>({
      query: body => ({
        url: API_ENDPOINTS.POSTS.CREATE,
        method: HTTP_METHODS.POST,
        body,
      }),
      extraOptions: {
        skipGlobalErrorToast: true,
      },
      invalidatesTags: result =>
        result ? [userPostsTag(result.data.post.author.id), FEED_TAG] : [],
    }),
  }),
});
