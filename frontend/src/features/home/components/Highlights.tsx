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
        {events.slice(0, 3).map((event, idx) => (
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
                <div className="w-full h-40 rounded-xl bg-gradient-to-br from-primary-100 to-blue-100 mb-4 flex items-center justify-center">
                  <span className="text-primary-300 text-3xl">📸</span>
                </div>
              )}

              <div className="flex-1 flex flex-col gap-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 text-base leading-snug">
                  {event.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar size={12} className="text-primary-500 flex-shrink-0" />
                  {formatShortDate(event.date)}
                </div>

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
        ))}
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
