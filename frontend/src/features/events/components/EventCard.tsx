import { motion } from 'framer-motion';
import { Calendar, MapPin, IndianRupee, Tag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/dateFormatter';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Card hover className="flex flex-col gap-4">
        {/* Images strip */}
        {event.images && event.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 pb-1">
            {event.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${event.title} - ${i + 1}`}
                className="flex-shrink-0 w-28 h-20 object-cover rounded-xl"
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-2 flex-1">
          <CardHeader className="mb-0">
            <CardTitle className="line-clamp-2 text-base">{event.title}</CardTitle>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full flex-shrink-0">
              <IndianRupee size={11} />
              {formatCurrency(event.amountSpent).replace('₹', '')}
            </span>
          </CardHeader>

          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-primary-500" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-primary-500" />
              {event.location}
            </span>
          </div>

          <CardBody className="line-clamp-3 text-sm mt-1">{event.description}</CardBody>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <Tag size={12} className="text-gray-400" />
              {event.tags.map((tag) => (
                <Badge key={tag} variant="neutral">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
