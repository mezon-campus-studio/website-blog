import { apiClient } from "@/lib/api-client";
import { SearchParams, SearchResponse } from "../types";

export const searchApi = {
  searchByKeyword: async ({ keyword }: SearchParams): Promise<SearchResponse> => {
    const response = await apiClient.get('/search', {
      params: { keyword }
    });
    return response.data;
  },

  searchByTag: async (tagId: string, page = 1, limit = 10): Promise<SearchResponse> => {
    const response = await apiClient.get(`/search/tag/${tagId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  searchByCategory: async (categoryId: string, page = 1, limit = 10): Promise<SearchResponse> => {
    const response = await apiClient.get(`/search/${categoryId}`, {
      params: { page, limit }
    });
    return response.data;
  }
};
