import { useEffect, useState, useMemo, useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { EventCard } from '../components/EventCard';
import { eventService } from '@/services/eventService';
import { SkeletonCard, EmptyState, ErrorState } from '@/components/ui/Loader';
import { CalendarDays, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/types/event';
import type { Event, EventCategory } from '@/types/event';

const PAGE_SIZE = 8;

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await eventService.getAll(1, 999);
      setAllEvents(data);
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

  const grouped = useMemo(() => {
    const map: Record<string, Event[]> = {};
    for (const cat of EVENT_CATEGORIES) {
      map[cat] = [];
    }
    for (const event of allEvents) {
      const cat = event.category && EVENT_CATEGORIES.includes(event.category as EventCategory)
        ? event.category
        : 'Other';
      if (!map[cat]) map[cat] = [];
      map[cat].push(event);
    }
    return map;
  }, [allEvents]);

  const visibleCategories = useMemo(() =>
    EVENT_CATEGORIES.filter((cat) => (grouped[cat]?.length ?? 0) > 0),
  [grouped]);

  const sortedAllEvents = useMemo(() => {
    const catOrder: Record<string, number> = {};
    EVENT_CATEGORIES.forEach((cat, i) => { catOrder[cat] = i; });
    return [...allEvents].sort((a, b) => {
      const catA = catOrder[a.category as string] ?? 999;
      const catB = catOrder[b.category as string] ?? 999;
      if (catA !== catB) return catA - catB;
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    if (activeCategory === 'All') return sortedAllEvents;
    return grouped[activeCategory] ?? [];
  }, [activeCategory, grouped, sortedAllEvents]);

  const totalPages = useMemo(() =>
    Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE)),
  [filteredEvents]);

  const paginatedEvents = useMemo(() =>
    filteredEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  [filteredEvents, page]);

  if (error) {
    return (
      <div className="section-padding bg-[#f5f7ff]">
        <Container>
          <SectionTitle tag="Our Work" title="Charity Events" subtitle="" />
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </Container>
      </div>
    );
  }

  return (
    <div className="section-padding bg-[#f5f7ff]">
      <Container>
        <SectionTitle
          tag="Our Work"
          title="Charity Events"
          subtitle="Every event reflects our commitment to making a difference — one community at a time."
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : !allEvents.length ? (
          <EmptyState
            icon={<CalendarDays size={48} />}
            title="No events yet"
            description="Our upcoming charity events will appear here."
          />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="relative w-full max-w-[240px]" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full flex items-center gap-2 pl-3 pr-3 py-2 rounded-xl border border-[#e0e6f8] bg-white
                           text-[13px] font-bold text-[#1a2c6b]
                           hover:border-[#c5d0f0] hover:shadow-sm
                           transition-all cursor-pointer"
              >
                <CalendarDays size={13} className="text-[#8b97b5] flex-shrink-0" />
                <span className="flex-1 text-left truncate">
                  {activeCategory === 'All' ? 'All Events' : activeCategory}
                </span>
                <span className="text-[11px] font-semibold text-[#b0b8d4] tabular-nums">
                  {activeCategory === 'All' ? allEvents.length : (grouped[activeCategory]?.length ?? 0)}
                </span>
                <ChevronDown size={12} className={`text-[#8b97b5] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute z-20 top-full mt-1 left-0 right-0 rounded-xl border border-[#e0e6f8] bg-white shadow-lg overflow-hidden">
                  <div className="max-h-[240px] overflow-y-auto scrollbar-hide py-1">
                  {[
                    { value: 'All', label: 'All Events', count: allEvents.length },
                    ...visibleCategories.map((cat) => ({
                      value: cat, label: cat, count: grouped[cat]?.length ?? 0,
                    })),
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => { setActiveCategory(item.value); setDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-[12px] font-semibold transition-all ${
                        activeCategory === item.value
                          ? 'text-[#1a2c6b] bg-[#eef1fb]'
                          : 'text-[#4a5578] hover:bg-[#f5f7ff]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center ${
                        activeCategory === item.value ? 'bg-[#1a2c6b]' : 'bg-transparent'
                      }`}>
                        {activeCategory === item.value && <Check size={10} className="text-white" />}
                      </div>
                      <span className="flex-1">{item.label}</span>
                      <span className="text-[10px] font-semibold text-[#b0b8d4] tabular-nums">{item.count}</span>
                    </button>
                  ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start mb-8">
              {paginatedEvents.map((event, idx) => (
                <EventCard key={event.id} event={event} index={idx} showCategory={activeCategory === 'All'} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="h-8 w-8 rounded-lg border border-[#e0e6f8] bg-white flex items-center justify-center
                             disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eef1fb] transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-8 min-w-[32px] px-2 rounded-lg border text-[12px] font-bold transition-all
                      ${n === page
                        ? 'bg-[#1a2c6b] text-white border-[#1a2c6b]'
                        : 'bg-white text-[#4a5578] border-[#e0e6f8] hover:bg-[#eef1fb]'
                      }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-8 w-8 rounded-lg border border-[#e0e6f8] bg-white flex items-center justify-center
                             disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eef1fb] transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
