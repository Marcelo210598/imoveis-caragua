'use client';

import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Buscar por bairro, cidade ou tipo...',
  className = '',
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      onSearchRef.current(value);
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
      />
    </div>
  );
}
