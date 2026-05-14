import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/search";
import { SearchParams } from "../types";

export const useSearch = (params: SearchParams) => {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => {
      if (params.keyword) {
        return searchApi.searchByKeyword(params);
      }
      if (params.tagId) {
        return searchApi.searchByTag(params.tagId, params.page, params.limit);
      }
      if (params.categoryId) {
        return searchApi.searchByCategory(params.categoryId, params.page, params.limit);
      }
      return Promise.reject(new Error("Missing search criteria"));
    },
    enabled: !!(params.keyword || params.tagId || params.categoryId),
  });
};
