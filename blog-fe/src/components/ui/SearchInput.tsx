'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Loader2, User as UserIcon } from 'lucide-react';
import { Input } from './Input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearch } from '@/features/search/hooks/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get('q') || '');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const debouncedValue = useDebounce(value, 300);
    
    const { data: suggestions, isLoading } = useSearch({ 
      keyword: debouncedValue.length >= 2 ? debouncedValue : undefined 
    });

    // Client-side authors search fallback
    const { data: allPostsData } = useQuery({
      queryKey: ['posts', 'all-published'],
      queryFn: async () => {
        try {
          const { data } = await apiClient.get('/post');
          return data.data || [];
        } catch {
          return [];
        }
      },
    });

    const suggestedAuthors = useMemo(() => {
      if (!allPostsData || debouncedValue.length < 2) return [];
      const uniqueUsersMap = new Map<string, any>();
      
      allPostsData.forEach((post: any) => {
        if (post.user && post.user.id) {
          const nameMatches = post.user.name?.toLowerCase().includes(debouncedValue.toLowerCase());
          if (nameMatches) {
            uniqueUsersMap.set(post.user.id, post.user);
          }
        }
      });
      return Array.from(uniqueUsersMap.values());
    }, [allPostsData, debouncedValue]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value.trim()) {
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        setIsOpen(false);
        onSearch?.(value);
      }
    };

    const handleSelectSuggestion = (suggestionValue: string) => {
      setValue(suggestionValue);
      router.push(`/search?q=${encodeURIComponent(suggestionValue)}`);
      setIsOpen(false);
      onSearch?.(suggestionValue);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative w-full max-w-sm" ref={containerRef}>
        <Input
          ref={ref}
          type="search"
          placeholder="Search articles or authors..."
          startNode={isLoading && debouncedValue.length >= 2 ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          className={className}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleSearch}
          {...props}
        />
        
        {isOpen && debouncedValue.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden max-h-[350px] overflow-y-auto">
            
            {/* SUGGESTED AUTHORS SECTION */}
            {suggestedAuthors.length > 0 && (
              <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
                <div className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Authors / Users
                </div>
                {suggestedAuthors.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      router.push(`/users/${user.id}`);
                      setValue('');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all text-left cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20 shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{user.name}</span>
                    <span className="text-[9px] text-zinc-400 ml-auto bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">View Wall</span>
                  </button>
                ))}
              </div>
            )}

            {/* SUGGESTED ARTICLES SECTION */}
            {isLoading ? (
              <div className="p-4 text-center text-xs text-zinc-500 italic">Searching articles...</div>
            ) : suggestions?.data && suggestions.data.length > 0 ? (
              <div className="p-2 space-y-1">
                <div className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Articles
                </div>
                {suggestions.data.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(post.title)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Search size={14} className="text-zinc-400 shrink-0" />
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {post.title}
                    </span>
                  </button>
                ))}
                <div 
                  className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-[10px] font-black tracking-wider text-primary hover:underline cursor-pointer text-center uppercase"
                  onClick={() => handleSearch({ key: 'Enter' } as any)}
                >
                  Press Enter to see all results
                </div>
              </div>
            ) : (
              suggestedAuthors.length === 0 && (
                <div className="p-4 text-center text-xs text-zinc-500">No suggestions found</div>
              )
            )}
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
