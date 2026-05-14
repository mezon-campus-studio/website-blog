'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const PostForm = dynamic(() => import('@/features/posts/components/PostForm').then(mod => mod.PostForm), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-card-bg/20 animate-pulse rounded-3xl border border-card-border flex items-center justify-center text-muted-foreground">Preparing workspace...</div>
});

import { useCreatePost } from '@/features/posts/hooks/usePosts';

export default function CreatePostPage() {
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

  return (
    <div className="container py-8 pb-20">
      <PostForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}
