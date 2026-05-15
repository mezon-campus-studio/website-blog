'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePost } from '@/features/posts/hooks/usePostActions';
import { Button } from '@/components/ui';
import { Loader2, AlertCircle, Calendar, Clock, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PostInteractions } from '@/features/posts/components/PostInteractions';
import apiClient from '@/lib/api-client';
import { useUserProfile } from '@/features/auth/hooks/useUserProfile';

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: post, isLoading, error } = usePost(id);
  
  // Optimized: Use centralized hook with caching
  const { data: authorProfile } = useUserProfile(post?.userId || '');

  const displayAuthorName = post?.user?.name || authorProfile?.name || 'Unknown Author';

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="w-full flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-muted-foreground font-bold uppercase tracking-widest animate-pulse text-center">
            Unfolding the Story...
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-6 py-20">
        <div className="flex flex-col items-center text-center space-y-6 p-10 bg-card-bg/50 backdrop-blur-xl rounded-3xl border border-card-border shadow-2xl w-full max-w-lg">
          <div className="bg-destructive/10 p-4 rounded-full">
            <AlertCircle className="text-destructive" size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Story not found</h2>
            <p className="text-muted-foreground text-lg italic max-w-sm mx-auto">
              Maybe it was un-published or the link is broken.
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => router.push('/')} 
            className="px-8 h-12 text-base font-bold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1"
          >
            Back to Home Feed
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        {post.thumbnailUrl ? (
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 sm:p-12">
          <div className="container mx-auto max-w-4xl">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:gap-3 transition-all mb-6 bg-primary/10 backdrop-blur-md px-4 py-2 rounded-full"
            >
              <ChevronLeft size={16} />
              Back to Feed
            </Link>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight drop-shadow-2xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
              <Link href={`/users/${post.userId}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                   {displayAuthorName.charAt(0)}
                </div>
                <span>{displayAuthorName}</span>
              </Link>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={16} />
                5 min read
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-grow">
            {/* Category tag */}
            {post.categoryId && (
              <div className="mb-6">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {post.category?.name || 'Story'}
                </span>
              </div>
            )}

            <div 
              className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-p:text-muted-foreground/90 prose-strong:text-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Like / Comment / Report */}
            <PostInteractions postId={post.id} postTitle={post.title} />
          </main>
        </div>
      </div>
    </article>
  );
}

