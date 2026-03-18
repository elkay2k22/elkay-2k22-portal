import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { EventList } from '../components/EventList';
import { eventService } from '@/services/eventService';
import type { Event } from '@/types/event';

const PAGE_SIZE = 12;

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = async (targetPage: number) => {
    setLoading(true);
    setError(null);

    try {
      const [data, total] = await Promise.all([
        eventService.getAll(targetPage, PAGE_SIZE),
        eventService.getTotal(),
      ]);
      const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

      if (targetPage > pages) {
        setTotalPages(pages);
        return;
      }

      setEvents(data);
      setPage(targetPage);
      setTotalPages(pages);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string }; message?: string }; message?: string })
          ?.response?.data?.detail ??
        (err as { message?: string })?.message ??
        'Unable to load events';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const handlePageChange = (targetPage: number) => {
    if (targetPage < 1 || loading) {
      return;
    }
    if (targetPage > totalPages) {
      return;
    }
    if (targetPage === page) {
      return;
    }
    fetchPage(targetPage);
  };

  const handleRetry = () => {
    fetchPage(page);
  };

  return (
    <div className="section-padding bg-[#f5f7ff]">
      <Container>
        <SectionTitle
          tag="Our Work"
          title="Charity Events"
          subtitle="Every event reflects our commitment to making a difference — one community at a time."
        />
        <EventList
          events={events}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Container>
    </div>
  );
}
