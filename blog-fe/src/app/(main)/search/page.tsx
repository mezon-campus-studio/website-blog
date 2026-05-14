"use client";

import { useSearchParams } from "next/navigation";
import { useSearch } from "@/features/search/hooks/useSearch";
import { PostSection } from "@/components/sections/PostSection/PostSection";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const { data, isLoading } = useSearch({ keyword: query });

  return (
    <div className="container mx-auto py-8">
      <PostSection 
        title={query ? `Search results for "${query}"` : "Search"} 
        posts={data?.data || []} 
        isLoading={isLoading} 
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
