import { Post } from "@/features/posts/types";

export interface SearchParams {
  keyword?: string;
  categoryId?: string;
  tagId?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  data: Post[];
}
