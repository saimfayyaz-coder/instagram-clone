export interface PostAuthor {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface PostImage {
  id: string;
  uri: string;
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

export interface FeedPage {
  posts: Post[];
  // Null when there are no more posts
  nextCursor: number | null;
}
