'use client';

import React from 'react';
import { Post } from '../types';
import { Card, CardContent } from '@/components/ui';
import { Edit, Trash2, Eye, Calendar, Clock, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface PostManagementCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

export const PostManagementCard: React.FC<PostManagementCardProps> = ({ post, onDelete }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="group overflow-hidden border-none shadow-lg bg-card-bg/30 backdrop-blur-md hover:bg-card-bg/50 transition-all duration-500">
      <CardContent className="p-0 flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-48 aspect-video sm:aspect-square overflow-hidden">
          {post.thumbnailUrl ? (
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              <FileText size={32} strokeWidth={1} />
            </div>
          )}
          <div className={twMerge(
            "absolute top-3 left-3 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest backdrop-blur-md",
            post.isDraft 
              ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" 
              : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
          )}>
            {post.isDraft ? 'Draft' : 'Published'}
          </div>
        </div>

        {/* Info */}
        <div className="flex-grow p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                5 min read
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 italic">
              {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
            </p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <Link 
                href={`/posts/edit/${post.id}`}
                className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                title="Edit"
              >
                <Edit size={16} />
              </Link>
              <button 
                onClick={() => onDelete?.(post.id)}
                className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-white transition-all shadow-sm"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <Link 
              href={`/posts/${post.slug}`} // View on public site
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <Eye size={14} />
              View Live
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
