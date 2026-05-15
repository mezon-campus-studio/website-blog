"use client";
<<<<<<< HEAD
import React from 'react';
=======
>>>>>>> mezon/dev-fe

import { PostSection } from "@/components/sections/PostSection/PostSection";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { useAllPosts, useHottestPosts } from "@/features/posts/hooks/usePosts";
<<<<<<< HEAD
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

=======

export function HomePostSections() {
  const { data: latestPosts, isLoading: isLoadingLatest } = useAllPosts();
  const { data: hottestPosts, isLoading: isLoadingHottest } = useHottestPosts();

  // Pick the absolute hottest post as the Hero Section featured insight
  const featuredPost = hottestPosts?.[0];
  
  // Slice to only show a single row (e.g., top 6) excluding the featured post if it's in the hottest
  const latestRow = latestPosts?.slice(0, 6) || [];
  const hottestRow = hottestPosts?.slice(1, 7) || [];

>>>>>>> mezon/dev-fe
  return (
    <>
      <HeroSection post={featuredPost} />
      
      <PostSection 
        title="The Latest Chronicles" 
<<<<<<< HEAD
        posts={allLatestPosts} 
        isLoading={isLoadingLatest && latestPage === 1}
        isFetchingMore={isFetchingLatest}
        onLoadMore={handleLoadMoreLatest}
=======
        posts={latestRow} 
        isLoading={isLoadingLatest} 
>>>>>>> mezon/dev-fe
      />
      <PostSection 
        title="Hottest Chronicles" 
        posts={hottestRow} 
        isLoading={isLoadingHottest} 
      />
    </>
  );
}
