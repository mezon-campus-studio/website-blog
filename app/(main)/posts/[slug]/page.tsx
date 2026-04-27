'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePostBySlug } from '@/features/posts/hooks/usePostActions';
import { Button } from '@/components/ui';
import { Loader2, AlertCircle, Calendar, Clock, User, ChevronLeft, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PostDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const { data: post, isLoading, error } = usePostBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-muted-foreground font-bold uppercase tracking-widest animate-pulse">
            Unfolding the Story...
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-8 bg-card-bg/30 backdrop-blur-md rounded-2xl border border-card-border shadow-2xl max-w-md mx-4">
          <AlertCircle className="mx-auto text-destructive" size={64} />
          <h2 className="text-2xl font-bold">Story not found</h2>
          <p className="text-muted-foreground italic">Maybe it was un-published or the link is broken.</p>
          <Button variant="primary" onClick={() => router.push('/')} className="mt-4">
            Back to Home
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                  {post.user?.name.charAt(0)}
                </div>
                <span>{post.user?.name}</span>
              </div>
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
            <div 
              className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-p:text-muted-foreground/90 prose-strong:text-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-16 pt-8 border-t border-card-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Share this story:</span>
                <button className="p-2 hover:bg-card-bg rounded-lg transition-colors"><Share2 size={18} /></button>
              </div>
              <div className="flex items-center gap-2">
                {post.categoryId && (
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {post.category?.name || 'Story'}
                  </span>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </article>
  );
}
