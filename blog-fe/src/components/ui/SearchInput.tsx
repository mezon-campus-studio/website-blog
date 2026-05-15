'use client';

<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from './Input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearch } from '@/features/search/hooks/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
=======
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './Input';
>>>>>>> mezon/dev-fe

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
<<<<<<< HEAD
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get('q') || '');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const debouncedValue = useDebounce(value, 300);
    
    const { data: suggestions, isLoading } = useSearch({ 
      keyword: debouncedValue.length >= 2 ? debouncedValue : undefined 
    });

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
          placeholder="Search articles..."
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
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-zinc-500 italic">Searching suggestions...</div>
            ) : suggestions?.data && suggestions.data.length > 0 ? (
              <div className="py-2">
                {suggestions.data.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(post.title)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <Search size={16} className="text-zinc-400 shrink-0" />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {post.title}
                    </span>
                  </button>
                ))}
                <div 
                  className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs font-bold text-primary hover:underline cursor-pointer text-center"
                  onClick={() => handleSearch({ key: 'Enter' } as any)}
                >
                  Press Enter to see all results
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-zinc-500">No suggestions found</div>
            )}
          </div>
        )}
      </div>
=======
    return (
      <Input
        ref={ref}
        type="search"
        placeholder="Search articles..."
        startNode={<Search size={18} />}
        className={className}
        {...props}
      />
>>>>>>> mezon/dev-fe
    );
  }
);

SearchInput.displayName = 'SearchInput';
