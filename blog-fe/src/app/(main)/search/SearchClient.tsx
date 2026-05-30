'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/features/search/hooks/useSearch";
import { PostSection } from "@/components/sections/PostSection/PostSection";
import Link from 'next/link';
import { User as UserIcon } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const { data, isLoading } = useSearch({ keyword: query });

  // Query all published posts to build the complete client-side list of authors
  const { data: allPostsData } = useQuery({
    queryKey: ['posts', 'all-published'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/post');
        return data.data || [];
      } catch {
        return [];
      }
    },
  });

  // Extract unique authors whose names match the search query from the posts list
  const matchedAuthors = React.useMemo(() => {
    if (!allPostsData || !query) return [];
    const uniqueUsersMap = new Map<string, any>();
    
    allPostsData.forEach((post: any) => {
      if (post.user && post.user.id) {
        const nameMatches = post.user.name?.toLowerCase().includes(query.toLowerCase());
        if (nameMatches) {
          uniqueUsersMap.set(post.user.id, post.user);
        }
      }
    });

    return Array.from(uniqueUsersMap.values());
  }, [allPostsData, query]);

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      {/* Authors / Users Match Section */}
      {!isLoading && query && matchedAuthors.length > 0 && (
        <div className="mb-12 bg-card-bg/25 border border-card-border p-6 rounded-3xl backdrop-blur-xl">
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <UserIcon size={16} className="text-primary" />
            Authors Matching "{query}"
          </h2>
          <div className="flex flex-wrap gap-4">
            {matchedAuthors.map((user: any) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="flex items-center gap-3 p-3 bg-card-bg/40 border border-card-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-2xl transition-all group shrink-0"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold group-hover:text-primary transition-colors">{user.name}</div>
                  <div className="text-[10px] text-muted-foreground">View Profile Wall</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Articles Section */}
      <PostSection 
        title={query ? `Articles matching "${query}"` : "Search"} 
        posts={data?.data || []} 
        isLoading={isLoading} 
      />
    </div>
  );
}

export function SearchClient() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8 text-center text-muted-foreground animate-pulse">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
