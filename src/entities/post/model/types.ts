export interface PostAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface PostImage {
  id: string;
  uri: string;
  // Smaller copy cropped for the profile grid
  thumbUri?: string;
  altText?: string;
}

export interface Post {
  id: string;
  author: PostAuthor;
  location?: string;
  images: PostImage[];
  // Width divided by height, shared by every image in the post
  aspectRatio: number;
  caption: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
}

// Shapes returned by the posts API
export interface ApiPostMedia {
  id: string;
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  altText: string;
}

export interface ApiPost {
  id: string;
  author: PostAuthor;
  media: ApiPostMedia[];
  aspectRatio: number;
  caption: string;
  location: string;
  likeCount: number;
  commentCount: number;
  hideLikeCount: boolean;
  commentsDisabled: boolean;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
}

export interface UserPostsPage {
  posts: Post[];
  // Null when there are no more posts
  nextCursor: string | null;
}

export interface FeedPage {
  posts: Post[];
  // Null when there are no more posts
  nextCursor: number | null;
}
