'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './Input';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        placeholder="Search articles..."
        startNode={<Search size={18} />}
        className={className}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
