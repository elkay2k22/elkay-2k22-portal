import { Container } from '@/components/layout/Container';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { HeroSection } from '../components/HeroSection';
import { FundDashboard } from '../components/FundDashboard';
import { Highlights } from '../components/Highlights';
import { useFetch } from '@/hooks/useFetch';
import { settingsService } from '@/services/settingsService';
import { eventService } from '@/services/eventService';
import { ErrorState } from '@/components/ui/Loader';

export default function HomePage() {
  const {
    data: settings,
    loading: settingsLoading,
    error: settingsError,
    refetch: retrySettings,
  } = useFetch(() => settingsService.get());

  const {
    data: events,
    loading: eventsLoading,
    error: eventsError,
    refetch: retryEvents,
  } = useFetch(() => eventService.getAll(1, 3));

  return (
    <>
      <HeroSection />

      {/* Fund Dashboard */}
      <section className="section-padding">
        <Container>
          <SectionTitle
            tag="Transparency"
            title="Fund Overview"
            subtitle="A transparent view of every rupee collected and utilized for our community."
          />
          {settingsError ? (
            <ErrorState message={settingsError} onRetry={retrySettings} />
          ) : (
            <FundDashboard
              data={settings?.fundSummary ?? null}
              loading={settingsLoading}
            />
          )}
        </Container>
      </section>

      {/* Event Highlights */}
      <section className="section-padding bg-gray-50">
        <Container>
          <SectionTitle
            tag="Activities"
            title="Latest Event Highlights"
            subtitle="Our most recent charity activities and batch events."
          />
          {eventsError ? (
            <ErrorState message={eventsError} onRetry={retryEvents} />
          ) : (
            <Highlights events={events ?? []} loading={eventsLoading} />
          )}
        </Container>
      </section>
    </>
  );
}
