import { motion } from 'framer-motion';
import { Calendar, MapPin, IndianRupee, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/dateFormatter';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  index?: number;
}

const ACCENTS = [
  'linear-gradient(to right,#1a2c6b,#25a065)',
];

const AMOUNT_STYLES = [
  { bg: '#eef1fb', color: '#1a2c6b' },
];

export function EventCard({ event, index = 0 }: EventCardProps) {
  const accent = ACCENTS[index % ACCENTS.length];
  const amtStyle = AMOUNT_STYLES[index % AMOUNT_STYLES.length];
  const dateLabel = formatDate(event.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="h-full"
    >
      <div className="h-full flex flex-col bg-white rounded-[22px] border border-[#e8ecf8]
                      overflow-hidden transition-all duration-200
                      hover:shadow-[0_8px_32px_rgba(26,44,107,0.1)] hover:-translate-y-0.5">

        {/* Top accent bar */}
        <div className="h-[3px] w-full flex-shrink-0" style={{ background: accent }} />

        {/* Image strip */}
        {event.images && event.images.length > 0 && (
          <div className="flex gap-2 px-4 pt-4 overflow-x-auto scrollbar-hide">
            {event.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${event.title} - ${i + 1}`}
                className="flex-shrink-0 w-24 h-16 object-cover rounded-xl border border-[#e8ecf8]"
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col gap-2.5 flex-1 p-5">

          {/* Title + amount */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[15px] font-extrabold text-[#1a2c6b] leading-snug flex-1 line-clamp-2">
              {event.title}
            </h3>
            <span className="inline-flex items-center gap-1 text-[12px] font-bold
                             px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap"
              style={{ background: amtStyle.bg, color: amtStyle.color }}>
              <IndianRupee size={10} />
              {formatCurrency(event.amountSpent).replace('₹', '')}
            </span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2.5">
            {!!dateLabel && (
              <span className="flex items-center gap-1.5 text-[12px] text-[#6b7aa0] font-medium">
                <span className="w-5 h-5 rounded-[6px] bg-[#eef1fb] flex items-center justify-center flex-shrink-0">
                  <Calendar size={11} className="text-[#1a2c6b]" />
                </span>
                {dateLabel}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-[12px] text-[#6b7aa0] font-medium">
              <span className="w-5 h-5 rounded-[6px] bg-[#e8f5ee] flex items-center justify-center flex-shrink-0">
                <MapPin size={11} className="text-[#25a065]" />
              </span>
              {event.location}
            </span>
          </div>

          {/* Description */}
          <p className="text-[13.5px] text-[#4a5578] leading-[1.7] line-clamp-3">
            {event.description}
          </p>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag size={11} className="text-[#b0b8d4] flex-shrink-0" />
              {event.tags.map((tag) => (
                <span key={tag}
                  className="text-[11px] font-600 text-[#4a5578] bg-[#f5f7ff]
                             border border-[#e8ecf8] rounded-full px-2.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}