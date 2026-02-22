import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LevelBadge } from '@/components/LevelBadge';
import { cn } from '@/utils';
import type { Region } from '@/types/region';
import { searchRegions, highlightMatch, type SearchResult } from '@/utils/search';

interface SearchBoxProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSelect?: (region: Region) => void;
}

const DEBOUNCE_MS = 300;

export function SearchBox({
  className,
  placeholder = '搜索城市或区域...',
  autoFocus = false,
  onSelect,
}: SearchBoxProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 执行搜索
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const searchResults = searchRegions(searchQuery, 10);
    setResults(searchResults);
    setIsOpen(searchResults.length > 0 || searchQuery.trim().length > 0);
    setIsLoading(false);
    setSelectedIndex(searchResults.length > 0 ? 0 : -1);
  }, []);

  // 防抖搜索
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setIsLoading(true);

      // 清除之前的定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // 设置新的防抖定时器
      debounceTimerRef.current = setTimeout(() => {
        performSearch(value);
      }, DEBOUNCE_MS);
    },
    [performSearch]
  );

  // 处理选择结果
  const handleSelect = useCallback(
    (region: Region) => {
      setQuery(region.name);
      setIsOpen(false);
      setResults([]);
      
      if (onSelect) {
        onSelect(region);
      } else {
        navigate(`/region/${region.code}`);
      }
    },
    [navigate, onSelect]
  );

  // 键盘导航
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === 'Enter' && query.trim()) {
          performSearch(query);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleSelect(results[selectedIndex].region);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, selectedIndex, handleSelect, query, performSearch]
  );

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 清理防抖定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // 高亮匹配文本组件
  const HighlightText = ({ text, query }: { text: string; query: string }) => {
    const { parts } = highlightMatch(text, query);
    return (
      <span>
        {parts.map((part, idx) =>
          part.isMatch ? (
            <span key={idx} className="bg-yellow-200 text-yellow-900 font-semibold">
              {part.text}
            </span>
          ) : (
            <span key={idx}>{part.text}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0 || query.trim()) {
              setIsOpen(true);
            }
          }}
          autoFocus={autoFocus}
          className="pl-10 pr-10 h-12 text-base"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {/* 下拉结果列表 */}
      {isOpen && (
        <Card className="absolute z-50 w-full mt-1 p-1 shadow-lg border-border max-h-[400px] overflow-auto">
          {results.length > 0 ? (
            <ul className="space-y-1" role="listbox">
              {results.map((result, index) => (
                <li
                  key={result.region.code}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors',
                    index === selectedIndex
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                  )}
                  onClick={() => handleSelect(result.region)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      <HighlightText
                        text={result.region.name}
                        query={query}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {result.region.path}
                    </div>
                  </div>
                  <LevelBadge level={result.region.level} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-8 text-center text-muted-foreground">
              {query.trim() ? (
                <div className="space-y-1">
                  <p className="text-sm">未找到匹配的区域</p>
                  <p className="text-xs">尝试输入完整城市名或行政区划代码</p>
                </div>
              ) : (
                <p className="text-sm">请输入城市名称开始搜索</p>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
