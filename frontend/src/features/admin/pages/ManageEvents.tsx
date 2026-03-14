import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminShell } from '../components/AdminShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useFetch } from '@/hooks/useFetch';
import { eventService } from '@/services/eventService';
import { formatShortDate } from '@/utils/dateFormatter';
import { formatCurrency } from '@/utils/formatCurrency';
import { SkeletonCard, ErrorState, EmptyState } from '@/components/ui/Loader';
import { CalendarDays, MapPin, Trash2, Plus } from 'lucide-react';
import type { Event } from '@/types/event';

const schema = z.object({
  title:       z.string().min(2, 'Title is required'),
  date:        z.string().min(1, 'Date is required'),
  location:    z.string().min(2, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  amountSpent: z.coerce.number().min(0, 'Amount must be 0 or more'),
  imageUrl:    z.string().url('Must be a valid URL').or(z.literal('')).optional(),
});
type FormValues = z.infer<typeof schema>;

function EventRow({ event, onDelete }: { event: Event; onDelete: (id: string) => void }) {
  return (
    <Card className="flex flex-col sm:flex-row sm:items-center gap-4">
      {event.images?.[0] && (
        <img src={event.images[0]} alt={event.title} className="w-full sm:w-24 h-20 object-cover rounded-xl flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{event.title}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
          <span className="flex items-center gap-1"><CalendarDays size={11} /> {formatShortDate(event.date)}</span>
          <span className="flex items-center gap-1"><MapPin size={11} /> {event.location}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Badge variant="success">{formatCurrency(event.amountSpent)}</Badge>
        <Button size="sm" variant="ghost" onClick={() => onDelete(event.id)} className="text-red-500 hover:bg-red-50">
          <Trash2 size={15} />
        </Button>
      </div>
    </Card>
  );
}

export default function ManageEvents() {
  const { data: events, loading, error, refetch } = useFetch(() => eventService.getAll(1, 100));
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    await eventService.remove(id);
    refetch();
  };

  const onSubmit = async (values: FormValues) => {
    await eventService.create({
      title:       values.title,
      date:        values.date,
      location:    values.location,
      description: values.description,
      amountSpent: values.amountSpent,
      images:      values.imageUrl ? [values.imageUrl] : [],
    });
    reset();
    setModalOpen(false);
    refetch();
  };

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
            <p className="text-sm text-gray-500 mt-1">Add, edit, or remove charity events.</p>
          </div>
          <Button leftIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Add Event</Button>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : !events?.length ? (
          <EmptyState title="No events yet" description="Click 'Add Event' to create the first one." />
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventRow key={event.id} event={event} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* ── Add Event Modal ───────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={() => { reset(); setModalOpen(false); }} title="Add New Event">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Event Title"
            placeholder="e.g. Eid Food Drive 2026"
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />
            <Input
              label="Amount Spent (₹)"
              type="number"
              placeholder="0"
              error={errors.amountSpent?.message}
              {...register('amountSpent')}
            />
          </div>
          <Input
            label="Location"
            placeholder="e.g. Saidabad, Hyderabad"
            error={errors.location?.message}
            {...register('location')}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of the event…"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
          </div>
          <Input
            label="Image URL (optional)"
            placeholder="https://example.com/photo.jpg"
            error={errors.imageUrl?.message}
            {...register('imageUrl')}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" fullWidth onClick={() => { reset(); setModalOpen(false); }}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={isSubmitting}>
              Save Event
            </Button>
          </div>
        </form>
      </Modal>
    </AdminShell>
  );
}
