'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PostForm } from '@/features/posts/components/PostForm';
import { useCreatePost } from '@/features/posts/hooks/usePosts';

export default function CreatePostPage() {
  const router = useRouter();
  const { mutate: createPost, isPending } = useCreatePost();

  const handleSubmit = (formData: FormData) => {
    createPost(formData, {
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
