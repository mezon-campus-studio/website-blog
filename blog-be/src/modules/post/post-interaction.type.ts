export type PostAuthor = {
  id: string;
  name: string;
  avatar_url: string | null;
};

export type PostDetailResponse = {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  slug: string;
  content: string;
  likeCount: number;
  thumbnailUrl: string | null;
  thumbnailPublicId: string | null;
  images: unknown;
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  isActive: boolean;
  isDeleted: boolean;
  user: PostAuthor;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: {
    tag: {
      id: string;
      name: string;
    };
  }[];
  _count: {
    likes: number;
    comments: number;
    bookmarks: number;
    shares: number;
  };
  isLiked: boolean;
  isBookmarked: boolean;
};

export type LikeToggleResult = {
  liked: boolean;
  likeCount: number;
};

export type BookmarkToggleResult = {
  bookmarked: boolean;
};

export type SharePostResult = {
  shared: boolean;
  platform: string | null;
  shareCount: number;
};

export type CommentAuthor = PostAuthor;

export type CommentNode = {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: CommentAuthor;
  replies: CommentNode[];
};

export type CommentListResponse = {
  items: CommentNode[];
  total: number;
  page: number;
  limit: number;
};
