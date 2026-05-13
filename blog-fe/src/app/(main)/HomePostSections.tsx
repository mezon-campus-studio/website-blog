"use client";

import { PostSection } from "@/components/sections/PostSection/PostSection";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { useAllPosts, useHottestPosts } from "@/features/posts/hooks/usePosts";

export function HomePostSections() {
  const { data: latestPosts, isLoading: isLoadingLatest } = useAllPosts();
  const { data: hottestPosts, isLoading: isLoadingHottest } = useHottestPosts();

  // Pick the absolute hottest post as the Hero Section featured insight
  const featuredPost = hottestPosts?.[0];
  
  // Slice to only show a single row (e.g., top 6) excluding the featured post if it's in the hottest
  const latestRow = latestPosts?.slice(0, 6) || [];
  const hottestRow = hottestPosts?.slice(1, 7) || [];

  return (
    <>
      <HeroSection post={featuredPost} />
      
      <PostSection 
        title="The Latest Chronicles" 
        posts={latestRow} 
        isLoading={isLoadingLatest} 
      />
      <PostSection 
        title="Hottest Chronicles" 
        posts={hottestRow} 
        isLoading={isLoadingHottest} 
      />
    </>
  );
}
