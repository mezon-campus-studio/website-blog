export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl?: string;
  categoryId: string;
  isDraft: boolean;
  userId: string;
  category?: { id: string; name: string; slug: string };
  user?: { id: string; name: string; avatar_url?: string };
  tags?: { tag: { id: string; name: string } }[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    likes: number;
    comments: number;
    bookmarks: number;
    shares: number;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  content: string;
  user?: { id: string; name: string; avatar_url?: string };
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];
}

export interface LikeToggleResult {
  liked: boolean;
  likeCount: number;
}

export interface BookmarkToggleResult {
  bookmarked: boolean;
}

export type SharePlatform = 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'COPY_LINK';

export interface SharePostResult {
  shared: boolean;
  platform: SharePlatform | null;
  shareCount: number;
}

export interface CommentListResponse {
  items: Comment[];
  total: number;
  page: number;
  limit: number;
}

export type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED' | 'REVIEWED';

export interface Report {
  id: string;
  postId: string;
  userId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  post?: { id: string; title: string; userId: string; user?: { name: string; email?: string } };
  user?: { id: string; name: string; email: string };
}

