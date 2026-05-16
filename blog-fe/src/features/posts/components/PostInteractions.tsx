'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Flag, Bookmark } from 'lucide-react';
import { useLikePost, useBookmarkPost } from '../hooks/usePostInteractions';
import { CommentSection } from './CommentSection';
import { ReportModal } from './ReportModal';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRouter } from 'next/navigation';

interface PostInteractionsProps {
  postId: string;
  postTitle?: string;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  initialLikeCount?: number;
  commentCount?: number;
}

export function PostInteractions({ 
  postId, 
  postTitle, 
  initialLiked = false, 
  initialBookmarked = false,
  initialLikeCount = 0,
  commentCount = 0
}: PostInteractionsProps) {
  const { mutate: toggleLike, isPending: isLiking } = useLikePost(postId);
  const { mutate: toggleBookmark, isPending: isBookmarking } = useBookmarkPost(postId);
  
  // Use local state for immediate feedback, but sync with props
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [likesCount, setLikesCount] = useState(initialLikeCount);

  useEffect(() => {
    setIsLiked(initialLiked);
    setIsBookmarked(initialBookmarked);
    setLikesCount(initialLikeCount);
  }, [initialLiked, initialBookmarked, initialLikeCount]);

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
    if (isLiking) return;

    // Optimistic update
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    toggleLike(undefined, {
      onError: () => {
        // Revert on error
        setIsLiked(isLiked);
        setLikesCount(likesCount);
      }
    });
  };

  const handleBookmark = () => {
    if (!user) {
      router.push('/signin');
      return;
    }
    if (isBookmarking) return;

    // Optimistic update
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);

    toggleBookmark(undefined, {
      onError: () => {
        // Revert on error
        setIsBookmarked(isBookmarked);
      }
    });
  };

  return (
    <>
      {/* Interaction Bar */}
      <div className="flex items-center gap-1 mt-10 pt-8 border-t border-card-border">
        {/* Like */}
        <button
          id="like-button"
          onClick={handleLike}
          disabled={isLiking}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
            isLiked
              ? 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20'
              : 'bg-card-bg/60 text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 border border-card-border'
          }`}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart
            size={16}
            className={`transition-all ${isLiked ? 'fill-pink-500 scale-110' : 'group-hover:scale-110'}`}
          />
          <span>{likesCount}</span>
        </button>

        {/* Bookmark */}
        <button
          id="bookmark-button"
          onClick={handleBookmark}
          disabled={isBookmarking}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
            isBookmarked
              ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
              : 'bg-card-bg/60 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 border border-card-border'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
        >
          <Bookmark
            size={16}
            className={`transition-all ${isBookmarked ? 'fill-amber-500 scale-110' : 'group-hover:scale-110'}`}
          />
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
          <span>{showComments ? 'Hide' : commentCount > 0 ? `${commentCount} Comments` : 'Comments'}</span>
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
