import { SkeletonCard, EmptyState, ErrorState } from '@/components/ui/Loader';
import { EventCard } from './EventCard';
import { CalendarDays, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { Event } from '@/types/event';

interface EventListProps {
  events: Event[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function EventList({
  events,
  loading = false,
  error,
  onRetry,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: EventListProps) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  if (loading) {
    return (
<div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!events.length) {
    return (
      <EmptyState
        icon={<CalendarDays size={48} />}
        title="No events yet"
        description="Our upcoming charity events will appear here."
      />
    );
  }

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const pageButtons = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {events.map((event, idx) => (
          <EventCard key={event.id} event={event} index={idx} />
        ))}
      </div>

      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1 || loading}
            className="h-9 px-2.5 rounded-[10px] border border-[#e0e6f8] bg-white
                       text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                       hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="First page"
            title="First page"
          >
            <ChevronsLeft size={14} />
          </button>

          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
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
              disabled={loading}
              className={clsx(
                'h-9 min-w-[36px] px-3 rounded-[10px] border text-[13px] font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed',
                n === currentPage
                  ? 'bg-[#1a2c6b] text-white border-[#1a2c6b]'
                  : 'bg-white text-[#4a5578] border-[#e0e6f8] hover:bg-[#eef1fb] hover:text-[#1a2c6b] hover:border-[#c5d0f0]'
              )}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            className="h-9 px-3 rounded-[10px] border border-[#e0e6f8] bg-white
                       text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                       hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next <ChevronRight size={14} />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages || loading}
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
      )}
    </div>
  );
}
