import { SkeletonCard, EmptyState, ErrorState } from '@/components/ui/Loader';
import { EventCard } from './EventCard';
import { CalendarDays } from 'lucide-react';
import type { Event } from '@/types/event';

interface EventListProps {
  events: Event[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function EventList({ events, loading = false, error, onRetry }: EventListProps) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {events.map((event, idx) => (
        <EventCard key={event.id} event={event} index={idx} />
      ))}
    </div>
  );
}
