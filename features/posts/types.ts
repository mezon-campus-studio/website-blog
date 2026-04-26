export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl?: string;
  categoryId: string;
  isDraft: boolean;
  userId: string;
  tags?: { tag: { name: string } }[];
  createdAt: string;
  updatedAt: string;
}
