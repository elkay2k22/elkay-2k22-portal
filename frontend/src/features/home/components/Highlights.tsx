import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/Loader';
import { formatShortDate } from '@/utils/dateFormatter';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Event } from '@/types/event';

interface HighlightsProps {
  events: Event[];
  loading?: boolean;
}

export function Highlights({ events, loading = false }: HighlightsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!events.length) {
    return (
      <p className="text-center text-gray-500 py-8 text-sm">No events yet. Check back soon!</p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.slice(0, 3).map((event, idx) => {
          const dateLabel = formatShortDate(event.date);

          return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            <Card hover className="h-full flex flex-col">
              {/* Cover image */}
              {event.images?.[0] ? (
                <img
                  src={event.images[0]}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded-xl mb-4 -mx-0 bg-gray-100"
                />
              ) : (
                <div className="w-full h-40 rounded-xl mb-4 flex flex-col items-center justify-center gap-2
                                bg-gradient-to-br from-[#eef1fb] to-[#e8f5ee]
                                border border-[#e0e6f8]">
                  <div className="w-10 h-10 rounded-[12px] bg-white/70 flex items-center justify-center shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2c6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.45">
                      <rect x="3" y="5" width="18" height="14" rx="3"/>
                      <circle cx="12" cy="12" r="3.5"/>
                      <path d="M8.5 5l1-2h5l1 2"/>
                    </svg>
                  </div>
                  <span className="text-[11px] font-medium text-[#1a2c6b]/40">No photo</span>
                </div>
              )}

              <div className="flex-1 flex flex-col gap-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 text-base leading-snug">
                  {event.title}
                </h3>

                {!!dateLabel && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={12} className="text-primary-500 flex-shrink-0" />
                    {dateLabel}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin size={12} className="text-primary-500 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
                  {event.description}
                </p>

                <span className="inline-block self-start mt-1 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                  Spent: {formatCurrency(event.amountSpent)}
                </span>
              </div>
            </Card>
          </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View All Events <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
