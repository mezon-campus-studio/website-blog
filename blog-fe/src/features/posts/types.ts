export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl?: string;
  categoryId: string;
  isDraft: boolean;
  userId: string;
  category?: { name: string };
  user?: { name: string; avatar_url?: string };
  tags?: { tag: { name: string } }[];
  createdAt: string;
  updatedAt: string;
}
<<<<<<< HEAD

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  user?: { name: string; avatar_url?: string };
  createdAt: string;
}

export interface Like {
  postId: string;
  userId: string;
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
=======
>>>>>>> mezon/dev-fe
