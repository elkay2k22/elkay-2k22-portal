import { Container } from '@/components/layout/Container';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { EventList } from '../components/EventList';
import { useFetch } from '@/hooks/useFetch';
import { eventService } from '@/services/eventService';

export default function EventsPage() {
  const { data, loading, error, refetch } = useFetch(() => eventService.getAll(1, 50));

  return (
    <div className="section-padding">
      <Container>
        <SectionTitle
          tag="Our Work"
          title="Charity Events"
          subtitle="Every event reflects our commitment to making a difference — one community at a time."
        />
        <EventList
          events={data ?? []}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </Container>
    </div>
  );
}
