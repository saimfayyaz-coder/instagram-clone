import { ApiPost, Post } from '../model/types';

export const mapApiPost = (post: ApiPost): Post => ({
  id: post.id,
  author: post.author,
  location: post.location || undefined,
  images: post.media.map(item => ({
    id: item.id,
    uri: item.url,
    thumbUri: item.thumbUrl,
    altText: item.altText || undefined,
  })),
  aspectRatio: post.aspectRatio,
  caption: post.caption,
  likeCount: post.likeCount,
  commentCount: post.commentCount,
  createdAt: post.createdAt,
  isLiked: post.isLiked,
  isSaved: post.isSaved,
});
