"use client";

import React from 'react';
import Link from "next/link";
import { PostSection } from "@/components/sections/PostSection/PostSection";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { useAllPosts, useHottestPosts } from "@/features/posts/hooks/usePosts";
import { useAllCategories } from "@/features/category/hooks/useCategories";
import { useAllTags } from "@/features/tag/hooks/useTags";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Post } from "@/features/posts/types";

export function HomePostSections() {
  const [latestPage, setLatestPage] = React.useState(1);
  const [allLatestPosts, setAllLatestPosts] = React.useState<Post[]>([]);
  
  const { data: latestPostsPage, isLoading: isLoadingLatest, isFetching: isFetchingLatest } = useAllPosts(latestPage, 6);
  const { data: hottestPosts, isLoading: isLoadingHottest } = useHottestPosts();
  const { data: categories } = useAllCategories();
  const { data: tags } = useAllTags();
  const user = useAuthStore((state) => state.user);

  // Accumulate posts when a new page is loaded
  React.useEffect(() => {
    if (latestPostsPage) {
      setAllLatestPosts(prev => {
        // Prevent duplicate posts if React Query refetches
        const newPosts = latestPostsPage.filter(lp => !prev.find(p => p.id === lp.id));
        return [...prev, ...newPosts];
      });
    }
  }, [latestPostsPage]);

  // Pick the absolute hottest post as the Hero Section featured insight
  const featuredPost = hottestPosts?.[0];
  
  // Prepare rows
  const hottestRow = hottestPosts?.slice(1, 7) || [];

  const handleLoadMoreLatest = () => {
    setLatestPage(prev => prev + 1);
  };

  return (
    <>
      <HeroSection post={featuredPost} />
      
      <PostSection 
        title="The Latest Chronicles" 
        posts={allLatestPosts} 
        isLoading={isLoadingLatest && latestPage === 1}
        isFetchingMore={isFetchingLatest}
        onLoadMore={handleLoadMoreLatest}
      />

      <PostSection 
        title="Hottest Chronicles" 
        posts={hottestRow} 
        isLoading={isLoadingHottest}
      />

      {/* Chỉ hiện khi đã đăng nhập */}
      {user && (
        <section className="container mx-auto px-4 py-16 space-y-12">

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Explore Categories</h2>
              <Link href="/categories" className="text-sm font-medium text-primary hover:underline transition">
                View all →
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {(categories || []).slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-4 py-2 rounded-xl border border-border/40 bg-card text-sm font-medium
                             transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                >
                  {cat.name}
                </Link>
              ))}
              {!categories && [...Array(6)].map((_, i) => (
                <div key={i} className="h-9 w-24 rounded-xl bg-muted/60 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Popular Tags</h2>
              <Link href="/tags" className="text-sm font-medium text-primary hover:underline transition">
                View all →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {(tags || []).slice(0, 12).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border/40
                             bg-card text-sm transition-all hover:border-primary/50
                             hover:bg-primary/5 hover:text-primary"
                >
                  <span className="text-muted-foreground">#</span>
                  {tag.name}
                </Link>
              ))}
              {!tags && [...Array(8)].map((_, i) => (
                <div key={i} className="h-8 w-20 rounded-full bg-muted/60 animate-pulse" />
              ))}
            </div>
          </div>

        </section>
      )}
    </>
  );
}