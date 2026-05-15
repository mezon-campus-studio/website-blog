"use client";

import React from 'react';
import { PostSection } from "@/components/sections/PostSection/PostSection";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { useAllPosts, useHottestPosts } from "@/features/posts/hooks/usePosts";
import { Post } from "@/features/posts/types";

export function HomePostSections() {
  const [latestPage, setLatestPage] = React.useState(1);
  const [allLatestPosts, setAllLatestPosts] = React.useState<Post[]>([]);
  
  const { data: latestPostsPage, isLoading: isLoadingLatest, isFetching: isFetchingLatest } = useAllPosts(latestPage, 6);
  const { data: hottestPosts, isLoading: isLoadingHottest } = useHottestPosts();

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
    </>
  );
}
