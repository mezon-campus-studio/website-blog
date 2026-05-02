'use client';

import React, { useState, useRef } from 'react';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { PostEditor } from './PostEditor';
import { useCategories, useTags } from '../hooks/useMetadata';
import { Camera, Save, Send, ChevronLeft, Tag as TagIcon, Layout } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface PostFormProps {
  initialData?: {
    title: string;
    content: string;
    categoryId: string;
    thumbnailUrl?: string;
    tags?: string[];
  };
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnailUrl || '');
  const [isDraft, setIsDraft] = useState(true);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const { data: categories } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    
    // Frontend Validation
    if (!title.trim()) {
      alert('Article title is required!');
      return;
    }
    if (content.replace(/<[^>]*>/g, '').length < 10) {
      alert('Content must be at least 10 characters long!');
      return;
    }
    if (!categoryId) {
      alert('Please select a category!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categoryId', categoryId);
    formData.append('isDraft', status === 'draft' ? 'true' : 'false');
    formData.append('tags', JSON.stringify(tags));
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    setIsDraft(status === 'draft');
    onSubmit(formData);
  };

  return (
    <form className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between sticky top-0 z-20 py-4 bg-background/80 backdrop-blur-md border-b border-card-border mb-8">
        <div className="flex items-center gap-4">
          <Link href="/posts/manage" className="p-2 hover:bg-card-bg rounded-full transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {initialData ? 'Edit Article' : 'Create New Article'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={(e) => handleSubmit(e, 'draft')}
            isLoading={isLoading && isDraft}
            disabled={isLoading}
            className="hidden sm:flex gap-2"
          >
            <Save size={18} />
            Save Draft
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            onClick={(e) => handleSubmit(e, 'published')}
            isLoading={isLoading && !isDraft}
            disabled={isLoading}
            className="gap-2"
          >
            <Send size={18} />
            {initialData ? 'Update Article' : 'Publish Article'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-xl bg-card-bg/30 backdrop-blur-md">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Article Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border-none text-4xl font-extrabold focus:ring-0 placeholder:text-muted-foreground/30 p-0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Content
                </label>
                <PostEditor content={content} onChange={setContent} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Thumbnail */}
          <Card className="border-none shadow-xl bg-card-bg/30 backdrop-blur-md overflow-hidden">
            <div className="p-4 border-b border-card-border bg-card-bg/50">
              <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                <Camera size={16} className="text-primary" />
                Thumbnail
              </h3>
            </div>
            <CardContent className="p-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-video rounded-xl bg-card-bg/50 border-2 border-dashed border-card-border hover:border-primary/50 transition-all cursor-pointer overflow-hidden group"
              >
                {thumbnailPreview ? (
                  <>
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold uppercase tracking-widest bg-primary/80 px-3 py-1 rounded-full">
                        Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Camera size={32} strokeWidth={1} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Select Image</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleThumbnailChange} 
                accept="image/*" 
                className="hidden" 
              />
              <p className="mt-3 text-[10px] text-muted-foreground leading-relaxed italic">
                Best size: 1200x630px. Supports JPG, PNG, WEBP.
              </p>
            </CardContent>
          </Card>

          {/* Meta Information */}
          <Card className="border-none shadow-xl bg-card-bg/30 backdrop-blur-md overflow-hidden">
            <div className="p-4 border-b border-card-border bg-card-bg/50">
              <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                <Layout size={16} className="text-primary" />
                Metadata
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      className={twMerge(
                        "p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all",
                        categoryId === cat.id 
                          ? "bg-primary/10 border-primary text-primary" 
                          : "bg-card-bg/50 border-card-border text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <TagIcon size={14} />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[9px] font-bold uppercase flex items-center gap-1 group"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add tag and press Enter..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="flex-grow bg-card-bg/50 border border-card-border rounded-lg px-3 py-1 text-[10px] outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};
