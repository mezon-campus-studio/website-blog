'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Post } from '@/features/posts/types';
import { ArticleCard } from '@/components/cards/ArticleCard/ArticleCard';
import { Loader2, User as UserIcon, BookOpen, Calendar } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
  email?: string;
  createdAt: string;
}

import { useUserProfile } from '@/features/auth/hooks/useUserProfile';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  // 1. Fetch user profile info (using optimized hook)
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile(userId);

  // 2. Fetch user's posts
  const { data: allUserPosts, isLoading: isLoadingPosts } = useQuery<Post[]>({
    queryKey: ['posts', 'user', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/post/user/${userId}`);
      return data.data || [];
    },
    enabled: !!userId,
  });

  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = currentUser?.id === userId;
  const [activeTab, setActiveTab] = React.useState<'published' | 'shared'>('published');
  const [sharedPosts, setSharedPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const sharedListKey = 'memorizz_shared_posts';
      const existingShared = localStorage.getItem(sharedListKey);
      if (existingShared) {
        try {
          setSharedPosts(JSON.parse(existingShared));
        } catch (e) {
          setSharedPosts([]);
        }
      }
    }
  }, []);

  // Client-side filter for drafts (since BE is currently leaking them)
  const userPosts = React.useMemo(() => 
    allUserPosts?.filter(post => !post.isDraft) || [], 
    [allUserPosts]
  );

  if (isLoadingProfile || isLoadingPosts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        User not found.
      </div>
    );
  }

  const joinDate = new Date(userProfile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Header / Banner */}
      <div className="bg-gradient-to-b from-primary/10 to-background pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-primary/20 border-4 border-card-border flex items-center justify-center overflow-hidden shadow-2xl">
              {userProfile.avatar_url ? (
                <img src={userProfile.avatar_url} alt={userProfile.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={64} className="text-primary/40" />
              )}
            </div>
            
            <div className="text-center md:text-left space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">{userProfile.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Joined {joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>{userPosts?.length || 0} Stories published</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto max-w-5xl px-4 mt-12">
        {isOwnProfile ? (
          <div className="flex border-b border-card-border mb-8 gap-6">
            <button
              onClick={() => setActiveTab('published')}
              className={`pb-4 text-lg font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'published' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen size={18} />
              Published Stories ({userPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`pb-4 text-lg font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'shared' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Shared Stories ({sharedPosts.length})
            </button>
          </div>
        ) : (
          <h2 className="text-2xl font-black mb-8 border-b border-card-border pb-4 flex items-center gap-3">
            <BookOpen className="text-primary" />
            Published Stories
          </h2>
        )}

        {activeTab === 'published' ? (
          userPosts && userPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userPosts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card-bg/30 rounded-3xl border border-dashed border-card-border">
              <p className="text-muted-foreground italic">No stories published yet.</p>
            </div>
          )
        ) : (
          sharedPosts && sharedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sharedPosts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card-bg/30 rounded-3xl border border-dashed border-card-border">
              <p className="text-muted-foreground italic">No shared stories on your wall yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
