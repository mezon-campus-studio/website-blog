'use client';

import React, { useState } from 'react';
import { useMyPosts } from '@/features/posts/hooks/usePosts';
import { useDeletePost } from '@/features/posts/hooks/usePostActions';
import { PostManagementCard } from '@/features/posts/components/PostManagementCard';
import { Button, Card, CardContent } from '@/components/ui';
import { Plus, LayoutGrid, List, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

export default function ManagePostsPage() {
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const { data: posts, isLoading } = useMyPosts(filter === 'all' ? undefined : filter);
  const { mutate: deletePost } = useDeletePost();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      deletePost(id);
    }
  };

  return (
    <div className="container py-12 pb-24 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Your Chronicles</h1>
          <p className="text-muted-foreground text-lg italic">Manage and curate your stories in the digital world.</p>
        </div>
        <Link href="/posts/create">
          <Button variant="primary" className="gap-2 shadow-xl shadow-primary/20">
            <Plus size={20} />
            Write New Story
          </Button>
        </Link>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-6">
          <Card className="border-none shadow-xl bg-card-bg/30 backdrop-blur-md overflow-hidden">
            <div className="p-4 border-b border-card-border bg-card-bg/50">
              <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                <Filter size={16} className="text-primary" />
                Quick Filters
              </h3>
            </div>
            <CardContent className="p-4 flex flex-col gap-2">
              {[
                { id: 'all', label: 'All Articles', count: posts?.length },
                { id: 'published', label: 'Published', count: posts?.filter(p => !p.isDraft).length },
                { id: 'draft', label: 'Drafts', count: posts?.filter(p => p.isDraft).length }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id as any)}
                  className={twMerge(
                    "flex items-center justify-between p-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    filter === item.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {item.label}
                  <span className={twMerge(
                    "px-2 py-0.5 rounded-md text-[10px]",
                    filter === item.id ? "bg-white/20" : "bg-card-bg"
                  )}>
                    {item.count || 0}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Content Area */}
        <div className="flex-grow space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input
                type="text"
                placeholder="Search your stories..."
                className="w-full bg-card-bg/30 border-card-border rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 bg-card-bg/30 p-1 rounded-xl border border-card-border">
              <button className="p-2 bg-primary/20 text-primary rounded-lg">
                <List size={18} />
              </button>
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-card-bg/20 animate-pulse border border-card-border" />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
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
                  <Plus size={32} strokeWidth={1} />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">No articles found</h3>
                  <p className="text-muted-foreground text-sm italic">Time to start your next great chronicle.</p>
                </div>
                <Link href="/posts/create">
                  <Button variant="outline" className="mt-4">
                    Create your first post
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
