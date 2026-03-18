import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminShell } from '../components/AdminShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { eventService } from '@/services/eventService';
import { formatShortDate } from '@/utils/dateFormatter';
import { formatCurrency } from '@/utils/formatCurrency';
import { SkeletonCard, ErrorState, EmptyState } from '@/components/ui/Loader';
import { CalendarDays, MapPin, Trash2, Plus, UploadCloud, Pencil, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { Event } from '@/types/event';

const schema = z.object({
  title:       z.string().min(2, 'Title is required'),
  date:        z.string().optional(),
  location:    z.string().min(2, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  amountSpent: z.coerce.number().min(0, 'Amount must be 0 or more'),
});
type FormValues = z.infer<typeof schema>;
const PAGE_SIZE = 12;

function EventRow({
  event,
  onDelete,
  onEdit,
}: {
  event: Event;
  onDelete: (id: string) => void;
  onEdit: (event: Event) => void;
}) {
  const dateLabel = formatShortDate(event.date);

  return (
    <Card className="flex flex-col sm:flex-row sm:items-center gap-4">
      {event.images?.[0] && (
        <div className="relative w-full sm:w-24 h-20 flex-shrink-0">
          <img src={event.images[0]} alt={event.title} className="w-full h-20 object-cover rounded-xl" />
          {(event.images?.length ?? 0) > 1 && (
            <span className="absolute bottom-1 right-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              +{(event.images?.length ?? 0) - 1}
            </span>
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{event.title}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
          {!!dateLabel && <span className="flex items-center gap-1"><CalendarDays size={11} /> {dateLabel}</span>}
          <span className="flex items-center gap-1"><MapPin size={11} /> {event.location}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Badge variant="success">{formatCurrency(event.amountSpent)}</Badge>
        <Button size="sm" variant="ghost" onClick={() => onEdit(event)} className="text-blue-600 hover:bg-blue-50">
          <Pencil size={15} />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(event.id)} className="text-red-500 hover:bg-red-50">
          <Trash2 size={15} />
        </Button>
      </div>
    </Card>
  );
}

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    await eventService.remove(id);

    if (events.length === 1 && page > 1) {
      fetchPage(page - 1);
      return;
    }

    fetchPage(page);
  };

  const handleCloseModal = () => {
    reset();
    setEditingEvent(null);
    setExistingImages([]);
    setSelectedFiles([]);
    setFileError('');
    if (fileRef.current) fileRef.current.value = '';
    setModalOpen(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setExistingImages(event.images ?? []);
    reset({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      amountSpent: event.amountSpent,
    });
    setSelectedFiles([]);
    setFileError('');
    if (fileRef.current) fileRef.current.value = '';
    setModalOpen(true);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setExistingImages([]);
    reset({
      title: '',
      date: '',
      location: '',
      description: '',
      amountSpent: 0,
    });
    setSelectedFiles([]);
    setFileError('');
    if (fileRef.current) fileRef.current.value = '';
    setModalOpen(true);
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((imageUrl) => imageUrl !== url));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setFileError('');
    if (!files.length) {
      return;
    }

    const oversized = files.find((file) => file.size > 20 * 1024 * 1024);
    if (oversized) {
      setFileError('Each image must be 20 MB or smaller');
      return;
    }

    setSelectedFiles((prev) => {
      const next = [...prev];
      for (const file of files) {
        const exists = next.some(
          (f) =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified,
        );
        if (!exists) {
          next.push(file);
        }
      }
      return next;
    });

    // Let user pick more files again (even same folder) without reopening modal.
    e.currentTarget.value = '';
  };

  const removeSelectedFile = (target: File) => {
    setSelectedFiles((prev) =>
      prev.filter(
        (file) =>
          !(
            file.name === target.name &&
            file.size === target.size &&
            file.lastModified === target.lastModified
          ),
      ),
    );
  };

  const onSubmit = async (values: FormValues) => {
    const date = values.date?.trim() || undefined;
    let images: string[] = [...existingImages];
    if (selectedFiles.length) {
      const uploadedImages = await eventService.uploadImages(selectedFiles);
      images = [...images, ...uploadedImages];
    }

    if (editingEvent) {
      await eventService.update({
        id: editingEvent.id,
        title: values.title,
        date,
        location: values.location,
        description: values.description,
        amountSpent: values.amountSpent,
        images,
      });
    } else {
      await eventService.create({
        title:       values.title,
        date,
        location:    values.location,
        description: values.description,
        amountSpent: values.amountSpent,
        images,
      });
    }

    handleCloseModal();

    if (editingEvent) {
      fetchPage(page);
      return;
    }

    fetchPage(1);
  };

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
            <p className="text-sm text-gray-500 mt-1">Add, edit, or remove charity events.</p>
          </div>
          <Button leftIcon={<Plus size={16} />} onClick={handleAddEvent}>Add Event</Button>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : !events.length ? (
          <EmptyState title="No events yet" description="Click 'Add Event' to create the first one." />
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {events.map((event) => (
                <EventRow key={event.id} event={event} onDelete={handleDelete} onEdit={handleEdit} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={page <= 1 || loading}
                  className="h-9 px-2.5 rounded-[10px] border border-[#e0e6f8] bg-white
                             text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                             hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                             disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="First page"
                  title="First page"
                >
                  <ChevronsLeft size={14} />
                </button>

                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || loading}
                  className="h-9 px-3 rounded-[10px] border border-[#e0e6f8] bg-white
                             text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                             hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                             disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={14} /> Prev
                </button>

                {Array.from({ length: Math.min(totalPages, Math.max(1, page - 2) + 4) - Math.max(1, page - 2) + 1 }, (_, i) => Math.max(1, page - 2) + i).map((n) => (
                  <button
                    key={n}
                    onClick={() => handlePageChange(n)}
                    disabled={loading}
                    className={clsx(
                      'h-9 min-w-[36px] px-3 rounded-[10px] border text-[13px] font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed',
                      n === page
                        ? 'bg-[#1a2c6b] text-white border-[#1a2c6b]'
                        : 'bg-white text-[#4a5578] border-[#e0e6f8] hover:bg-[#eef1fb] hover:text-[#1a2c6b] hover:border-[#c5d0f0]'
                    )}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || loading}
                  className="h-9 px-3 rounded-[10px] border border-[#e0e6f8] bg-white
                             text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                             hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                             disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next <ChevronRight size={14} />
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={page >= totalPages || loading}
                  className="h-9 px-2.5 rounded-[10px] border border-[#e0e6f8] bg-white
                             text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                             hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                             disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Last page"
                  title="Last page"
                >
                  <ChevronsRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Add Event Modal ───────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingEvent ? 'Edit Event' : 'Add New Event'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Event Title"
            placeholder="e.g. Eid Food Drive 2026"
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date (optional)"
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
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Event Images (optional)</label>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              <UploadCloud size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500">Click to select local images</span>
              <span className="text-xs text-gray-400">You can select multiple files or add more in steps, max 20 MB each</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {!!selectedFiles.length && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">{selectedFiles.length} image(s) selected</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file) => (
                    <span
                      key={`${file.name}-${file.lastModified}-${file.size}`}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700"
                    >
                      {file.name}
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(file)}
                        className="text-gray-500 hover:text-red-600"
                        aria-label="Remove selected file"
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {!!editingEvent && !!existingImages.length && (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-gray-600">Current uploaded images</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {existingImages.map((url) => (
                    <div key={url} className="relative rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <img src={url} alt="Event" className="w-full h-20 object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 text-red-600 hover:bg-white border border-gray-200 flex items-center justify-center"
                        aria-label="Remove image"
                        title="Remove image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {fileError && <p className="text-xs text-red-600">{fileError}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" fullWidth onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={isSubmitting}>
              {editingEvent ? 'Update Event' : 'Save Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminShell>
  );
}
