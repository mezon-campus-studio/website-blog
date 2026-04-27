'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostForm } from '@/features/posts/components/PostForm';
import { usePost, useUpdatePost } from '@/features/posts/hooks/usePostActions';
import { Button } from '@/components/ui';
import { Loader2, AlertCircle } from 'lucide-react';

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: post, isLoading, error } = usePost(id);
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost(id);

  const handleSubmit = (formData: FormData) => {
    updatePost(formData, {
      onSuccess: () => {
        router.push('/posts/manage');
      },
      onError: (err) => {
        alert('Failed to update post: ' + err.message);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-muted-foreground font-bold uppercase tracking-widest animate-pulse">
            Fetching Story Details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/50">
        <div className="text-center space-y-4 p-8 bg-card-bg/30 backdrop-blur-md rounded-2xl border border-card-border shadow-2xl">
          <AlertCircle className="mx-auto text-destructive" size={64} />
          <h2 className="text-2xl font-bold">Oops! Story not found</h2>
          <p className="text-muted-foreground italic">Maybe it was deleted or the ID is incorrect.</p>
          <Button variant="outline" onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <PostForm 
        initialData={{
          title: post.title,
          content: post.content,
          categoryId: post.categoryId,
          thumbnailUrl: post.thumbnailUrl || undefined,
          tags: post.tags?.map((t) => t.tag.name) || [],
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
