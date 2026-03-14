import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminShell } from '../components/AdminShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useFetch } from '@/hooks/useFetch';
import { galleryService } from '@/services/galleryService';
import { store } from '@/mocks/mockData';
import type { GalleryItem } from '@/types/gallery';
import { ErrorState, EmptyState, Skeleton } from '@/components/ui/Loader';
import { Image, Trash2, Plus, Play, Lock, UploadCloud } from 'lucide-react';

const schema = z.object({
  title:              z.string().min(2, 'Title is required'),
  type:               z.enum(['image', 'video']),
  accessCodeRequired: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

export default function ManageGallery() {
  const { data, loading, error, refetch } = useFetch(() => galleryService.getAll());
  const [modalOpen, setModalOpen]         = useState(false);
  const [preview, setPreview]             = useState<string | null>(null);
  const [fileError, setFileError]         = useState('');
  const fileRef                           = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'image', accessCodeRequired: true },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) { setPreview(null); return; }
    if (file.size > 20 * 1024 * 1024) {
      setFileError('File too large — max 20 MB');
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    reset();
    setPreview(null);
    setFileError('');
    if (fileRef.current) fileRef.current.value = '';
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this media?')) return;
    await galleryService.remove(id);
    refetch();
  };

  const onSubmit = async (values: FormValues) => {
    if (!preview) { setFileError('Please select a file'); return; }

    const item: GalleryItem = {
      id:                 String(Date.now()),
      title:              values.title,
      type:               values.type,
      url:                preview,
      thumbnailUrl:       preview,
      accessCodeRequired: values.accessCodeRequired,
      uploadedAt:         new Date().toISOString(),
    };
    store.gallery.unshift(item);
    handleClose();
    refetch();
  };

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Gallery</h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload or remove photos and videos. Manage the download access code in Settings.
            </p>
          </div>
          <Button leftIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Upload Media</Button>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : !data?.items.length ? (
          <EmptyState icon={<Image size={48} />} title="No media yet" description="Click 'Upload Media' to add the first photo." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {data.items.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    {item.type === 'video' ? <Play size={28} /> : <Image size={28} />}
                  </div>
                )}
                {item.accessCodeRequired && (
                  <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
                    <Lock size={10} className="text-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Upload Media Modal ────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={handleClose} title="Upload Media">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. Eid Gathering 2026"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('type')}
            >
              <option value="image">Photo</option>
              <option value="video">Video</option>
            </select>
          </div>

          {/* File picker */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">File</label>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              {preview ? (
                <img src={preview} alt="preview" className="h-32 w-full object-cover rounded-xl" />
              ) : (
                <>
                  <UploadCloud size={28} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Click to choose a photo or video</span>
                  <span className="text-xs text-gray-400">Max 20 MB</span>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {fileError && <p className="text-xs text-red-600">{fileError}</p>}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-blue-600"
              {...register('accessCodeRequired')}
            />
            <span className="text-sm text-gray-700">Require access code to download</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" fullWidth onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={isSubmitting}>
              Save Media
            </Button>
          </div>
        </form>
      </Modal>
    </AdminShell>
  );
}
