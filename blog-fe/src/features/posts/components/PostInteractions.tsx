'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Flag, Bookmark, Share2, Copy, User } from 'lucide-react';
import { useLikePost, useBookmarkPost, useSharePost } from '../hooks/usePostInteractions';
import { CommentSection } from './CommentSection';
import { ReportModal } from './ReportModal';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Post } from '../types';

interface PostInteractionsProps {
  postId: string;
  postTitle?: string;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  initialLikeCount?: number;
  commentCount?: number;
  post?: Post;
}

export function PostInteractions({ 
  postId, 
  postTitle, 
  initialLiked = false, 
  initialBookmarked = false,
  initialLikeCount = 0,
  commentCount = 0,
  post
}: PostInteractionsProps) {
  const { mutate: toggleLike, isPending: isLiking } = useLikePost(postId);
  const { mutate: toggleBookmark, isPending: isBookmarking } = useBookmarkPost(postId);
  const { mutate: sharePost, isPending: isSharing } = useSharePost(postId);
  
  // Use local state for immediate feedback, but sync with props
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [likesCount, setLikesCount] = useState(initialLikeCount);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLiked(initialLiked);
    setIsBookmarked(initialBookmarked);
    setLikesCount(initialLikeCount);
  }, [initialLiked, initialBookmarked, initialLikeCount]);

  // Click outside to close share popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleShareAction = (platform: 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'COPY_LINK' | 'SHARE_TO_WALL') => {
    if (isSharing) return;

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = postTitle || 'Check out this amazing story on Memorizz!';

    // Map SHARE_TO_WALL to COPY_LINK for the backend tracking
    const bePlatform = platform === 'SHARE_TO_WALL' ? 'COPY_LINK' : platform;

    sharePost({ platform: bePlatform }, {
      onSuccess: () => {
        if (platform === 'SHARE_TO_WALL') {
          // Save to localStorage shared posts
          if (typeof window !== 'undefined' && post) {
            const sharedListKey = 'memorizz_shared_posts';
            const existingShared = localStorage.getItem(sharedListKey);
            let sharedArray: any[] = [];
            if (existingShared) {
              try {
                sharedArray = JSON.parse(existingShared);
              } catch (e) {
                sharedArray = [];
              }
            }
            if (!sharedArray.some((p: any) => p.id === post.id)) {
              const sharedItem = {
                ...post,
                sharedAt: new Date().toISOString(),
              };
              sharedArray = [sharedItem, ...sharedArray];
              localStorage.setItem(sharedListKey, JSON.stringify(sharedArray));
              toast.success('Post shared to your wall successfully!', {
                description: 'Visit your profile to see your shared stories.',
              });
            } else {
              toast.info('This post is already shared to your wall!');
            }
          }
        } else if (platform === 'COPY_LINK') {
          navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!', {
            description: 'You can now paste it anywhere to share.',
          });
        } else {
          let url = '';
          if (platform === 'FACEBOOK') {
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          } else if (platform === 'TWITTER') {
            url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
          } else if (platform === 'LINKEDIN') {
            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          }

          if (url) {
            window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
            toast.success(`Redirecting to share on ${platform.charAt(0) + platform.slice(1).toLowerCase()}...`);
          }
        }
        setIsShareOpen(false);
      },
      onError: () => {
        toast.error('Failed to register share. Please try again.');
      }
    });
  };

  return (
    <>
      {/* Interaction Bar */}
      <div className="flex items-center gap-3 mt-10 pt-8 border-t border-card-border relative">
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

        {/* Share Popover container */}
        <div className="relative" ref={shareRef}>
          <button
            id="share-button"
            onClick={() => setIsShareOpen(!isShareOpen)}
            disabled={isSharing}
            className={`group flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
              isShareOpen 
                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                : 'bg-card-bg/60 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 border border-card-border'
            }`}
            title="Share post"
          >
            <Share2 size={16} className="group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {isShareOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-56 bg-card border border-card-border rounded-xl shadow-xl overflow-hidden z-40 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleShareAction('SHARE_TO_WALL')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-left"
                >
                  <User size={16} className="text-primary" />
                  <span className="font-bold">Share to Wall</span>
                </button>
                <div className="h-px bg-card-border my-1" />
                <button
                  onClick={() => handleShareAction('FACEBOOK')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-colors cursor-pointer text-left"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#1877F2]">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleShareAction('TWITTER')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-foreground/10 hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-foreground">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X / Twitter</span>
                </button>
                <button
                  onClick={() => handleShareAction('LINKEDIN')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600/10 hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#0A66C2]">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </button>
                <div className="h-px bg-card-border my-1" />
                <button
                  onClick={() => handleShareAction('COPY_LINK')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-left"
                >
                  <Copy size={16} className="text-muted-foreground" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          )}
        </div>

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
