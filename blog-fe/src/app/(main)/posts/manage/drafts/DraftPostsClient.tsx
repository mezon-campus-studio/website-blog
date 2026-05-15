'use client';

import React, { Suspense } from 'react';
import { useMyPosts } from '@/features/posts/hooks/usePosts';
import { useDeletePost } from '@/features/posts/hooks/usePostActions';
import { PostManagementCard } from '@/features/posts/components/PostManagementCard';
import { Button, Card, CardContent } from '@/components/ui';
import { Plus, ChevronLeft, FileText } from 'lucide-react';
import Link from 'next/link';

function DraftPostsContent() {
  const { data: draftPosts, isLoading } = useMyPosts('draft');
  const { mutate: deletePost } = useDeletePost();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      deletePost(id);
    }
  };

  return (
    <div className="container py-12 pb-24 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-2">
            <Link href="/posts/manage" className="hover:underline flex items-center gap-1">
              <ChevronLeft size={14} />
              Back to Management
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <FileText className="text-primary" size={36} />
            Draft Chronicles
          </h1>
          <p className="text-muted-foreground text-lg italic">Your unfinished stories, waiting for the perfect moment.</p>
        </div>
        <Link href="/posts/create">
          <Button variant="primary" className="gap-2 shadow-xl shadow-primary/20">
            <Plus size={20} />
            Write New Story
          </Button>
        </Link>
      </header>

      <div className="space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-card-bg/20 animate-pulse border border-card-border" />
            ))}
          </div>
        ) : draftPosts && draftPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {draftPosts.map((post) => (
              <PostManagementCard 
                key={post.id} 
                post={post} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-card-border bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-card-bg flex items-center justify-center text-muted-foreground">
                <FileText size={32} strokeWidth={1} />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">No drafts found</h3>
                <p className="text-muted-foreground text-sm italic">Every masterpiece starts with a first word.</p>
              </div>
              <Link href="/posts/create">
                <Button variant="outline" className="mt-4">
                  Start a new draft
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export function DraftPostsClient() {
  return (
    <Suspense fallback={<div>Loading drafts...</div>}>
      <DraftPostsContent />
    </Suspense>
  );
}
