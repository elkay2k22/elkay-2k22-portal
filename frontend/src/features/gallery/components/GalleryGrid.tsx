import { SkeletonCard, EmptyState } from '@/components/ui/Loader';
import { MediaCard } from './MediaCard';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Image } from 'lucide-react';
import { clsx } from 'clsx';
import type { GalleryItem } from '@/types/gallery';

interface GalleryGridProps {
  items: GalleryItem[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onDownload: (item: GalleryItem) => void;
}

export function GalleryGrid({
  items, loading = false,
  currentPage = 1, totalPages = 1,
  onPageChange, onDownload,
}: GalleryGridProps) {

  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} lines={0} />)}
    </div>
  );

  if (!items.length) return (
    <EmptyState
      icon={<Image size={48} />}
      title="No media yet"
      description="Gallery photos and videos will appear here."
    />
  );

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const pageButtons = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} onDownload={onDownload} />
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="space-y-2">
          <div className="sm:hidden flex items-center justify-center gap-2">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage <= 1}
              className="h-9 px-2.5 rounded-[10px] border border-[#e0e6f8] bg-white
                         text-[13px] font-semibold text-[#4a5578] inline-flex items-center
                         disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="First page"
              title="First page"
            >
              <ChevronsLeft size={14} />
            </button>

            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-9 px-3 rounded-[10px] border border-[#e0e6f8] bg-white
                         text-[13px] font-semibold text-[#4a5578] flex items-center gap-1
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Prev
            </button>

            <span className="h-9 px-3 rounded-[10px] border border-[#dbe2f7] bg-[#f7f9ff]
                             text-[12px] font-bold text-[#1a2c6b] inline-flex items-center">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-9 px-3 rounded-[10px] border border-[#e0e6f8] bg-white
                         text-[13px] font-semibold text-[#4a5578] flex items-center gap-1
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>

            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage >= totalPages}
              className="h-9 px-2.5 rounded-[10px] border border-[#e0e6f8] bg-white
                         text-[13px] font-semibold text-[#4a5578] inline-flex items-center
                         disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Last page"
              title="Last page"
            >
              <ChevronsRight size={14} />
            </button>
          </div>

          <div className="hidden sm:flex items-center justify-center gap-1.5 flex-wrap">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            className="h-9 px-2.5 rounded-[10px] border border-[#e0e6f8] bg-white
                       text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                       hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="First page"
            title="First page"
          >
            <ChevronsLeft size={14} />
          </button>

          {/* Prev */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-9 px-3 rounded-[10px] border border-[#e0e6f8] bg-white
                       text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                       hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} /> Prev
          </button>

          {pageButtons.map((n) => (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              className={clsx(
                'h-9 min-w-[36px] px-3 rounded-[10px] border text-[13px] font-bold transition-all',
                n === currentPage
                  ? 'bg-[#1a2c6b] text-white border-[#1a2c6b]'
                  : 'bg-white text-[#4a5578] border-[#e0e6f8] hover:bg-[#eef1fb] hover:text-[#1a2c6b] hover:border-[#c5d0f0]'
              )}
            >
              {n}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-9 px-3 rounded-[10px] border border-[#e0e6f8] bg-white
                       text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                       hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next <ChevronRight size={14} />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="h-9 px-2.5 rounded-[10px] border border-[#e0e6f8] bg-white
                       text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                       hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Last page"
            title="Last page"
          >
            <ChevronsRight size={14} />
          </button>
          </div>
        </div>
      )}
    </div>
  );
}