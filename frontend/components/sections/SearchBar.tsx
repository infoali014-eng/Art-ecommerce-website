'use client';

import React from 'react';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by title, artist, medium...',
  className = '',
}) => {
  return (
    <div className={`relative w-full font-sans ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-secondary/60" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-primary/10 pl-11 pr-10 py-3.5 text-sm focus:outline-none focus:border-accent transition-colors duration-300 placeholder:text-secondary/50 text-primary"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary/60 hover:text-primary transition-colors cursor-pointer"
          aria-label="Clear Search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
export default SearchBar;
