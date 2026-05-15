'use client';

import React, { useState } from 'react';
import { useComments, useAddComment, useDeleteComment } from '../hooks/usePostInteractions';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/components/ui';
import { MessageCircle, Trash2, Loader2, Send } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: comments, isLoading } = useComments(postId);
  const { mutate: addComment, isPending: isAdding } = useAddComment(postId);
  const { mutate: deleteComment } = useDeleteComment(postId);
  const user = useAuthStore((s) => s.user);

  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isAdding) return;
    addComment(text.trim(), {
      onSuccess: () => setText(''),
    });
  };

  return (
    <div className="mt-12 space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-px h-8 bg-card-border" />
        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <MessageCircle size={16} className="text-primary" />
          {isLoading ? '—' : (comments?.length ?? 0)} Comments
        </h2>
      </div>

      {/* Comment list */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-9 h-9 rounded-full bg-card-bg/50 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-card-bg/50 rounded" />
                <div className="h-4 w-full bg-card-bg/50 rounded" />
              </div>
            </div>
          ))
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="group flex gap-3 p-4 rounded-2xl bg-card-bg/40 border border-card-border/50 hover:border-card-border transition-all"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-primary/20">
                {comment.user?.name?.charAt(0) ?? '?'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold">{comment.user?.name ?? 'Anonymous'}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground/90 leading-relaxed">{comment.content}</p>
              </div>

              {/* Delete (only own comments) */}
              {user && (user.id === comment.userId || comment.userId === 'me') && (
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 self-start"
                  title="Delete comment"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic text-center py-6">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-primary/20">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              placeholder="Write a comment... (Enter to send)"
              rows={2}
              className="w-full bg-card-bg/50 border border-card-border rounded-2xl px-4 py-3 pr-14 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
            />
            <button
              type="submit"
              disabled={!text.trim() || isAdding}
              className="absolute right-3 bottom-3 w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isAdding ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </form>
      ) : (
        <div 
          onClick={() => window.location.href = '/signin'}
          className="flex gap-3 items-center p-4 bg-card-bg/30 border border-card-border border-dashed rounded-2xl cursor-pointer hover:bg-card-bg/50 transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground shrink-0 border border-card-border">
            ?
          </div>
          <p className="text-sm text-muted-foreground font-medium group-hover:text-primary transition-colors">
            Share your thoughts... <span className="font-bold underline ml-1">Sign in to comment</span>
          </p>
        </div>
      )}
    </div>
  );
}
