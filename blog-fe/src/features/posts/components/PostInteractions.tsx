'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Flag } from 'lucide-react';
import { useLikePost } from '../hooks/usePostInteractions';
import { CommentSection } from './CommentSection';
import { ReportModal } from './ReportModal';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRouter } from 'next/navigation';

interface PostInteractionsProps {
  postId: string;
  postTitle?: string;
  initialLikeCount?: number;
}

export function PostInteractions({ postId, postTitle, initialLikeCount = 0 }: PostInteractionsProps) {
  const { liked, count, toggle } = useLikePost(postId, initialLikeCount);
  const [showComments, setShowComments] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const handleReport = () => {
    if (!user) {
      router.push('/signin');
      return;
    }
    setShowReport(true);
  };

  const handleLike = () => {
    if (!user) {
      router.push('/signin');
      return;
    }
    toggle();
  };

  return (
    <>
      {/* Interaction Bar */}
      <div className="flex items-center gap-1 mt-10 pt-8 border-t border-card-border">
        {/* Like */}
        <button
          id="like-button"
          onClick={handleLike}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
            liked
              ? 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20'
              : 'bg-card-bg/60 text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 border border-card-border'
          }`}
          title={liked ? 'Unlike' : 'Like'}
        >
          <Heart
            size={16}
            className={`transition-all ${liked ? 'fill-pink-500 scale-110' : 'group-hover:scale-110'}`}
          />
          <span>{count}</span>
        </button>

        {/* Comment toggle */}
        <button
          id="comment-toggle-button"
          onClick={() => setShowComments((v) => !v)}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
            showComments
              ? 'bg-primary/10 text-primary hover:bg-primary/20'
              : 'bg-card-bg/60 text-muted-foreground hover:text-primary hover:bg-primary/10 border border-card-border'
          }`}
        >
          <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
          <span>{showComments ? 'Hide' : 'Comments'}</span>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Report */}
        <button
          id="report-button"
          onClick={handleReport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-card-border transition-all group"
          title="Report this post"
        >
          <Flag size={14} className="group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Report</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-2">
          <CommentSection postId={postId} />
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        postId={postId}
        postTitle={postTitle}
      />
    </>
  );
}
