'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCreatePost } from '@/features/posts/hooks/usePosts';

const PostForm = dynamic(() => import('@/features/posts/components/PostForm').then(mod => mod.PostForm), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-card-bg/20 animate-pulse rounded-3xl border border-card-border flex items-center justify-center text-muted-foreground">Preparing workspace...</div>
});

export function CreatePostClient() {
  const router = useRouter();
  const { mutate: createPost, isPending } = useCreatePost();

  const handleSubmit = (formData: FormData) => {
    const shouldPublish = formData.get('isDraft') === 'false';
    createPost({ formData, shouldPublish }, {
      onSuccess: () => {
        router.push('/posts/manage');
      },
      onError: (error) => {
        alert(`Failed to create post: ${error.message}`);
      }
    });
  };

  return <PostForm onSubmit={handleSubmit} isLoading={isPending} />;
}
