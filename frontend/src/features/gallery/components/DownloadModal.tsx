import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Download } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { galleryService } from '@/services/galleryService';
import type { GalleryItem } from '@/types/gallery';

const schema = z.object({
  code: z.string().min(1, 'Access code is required'),
});

type FormValues = z.infer<typeof schema>;

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GalleryItem | null;
}

export function DownloadModal({ isOpen, onClose, item }: DownloadModalProps) {
  const [serverError, setServerError]   = useState('');
  const [verified, setVerified]         = useState(false);
  const [downloading, setDownloading]   = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const handleClose = () => {
    reset();
    setServerError('');
    setVerified(false);
    onClose();
  };

  const onSubmit = async ({ code }: FormValues) => {
    setServerError('');
    try {
      const { valid } = await galleryService.verifyCode(code);
      if (valid) {
        setVerified(true);
      } else {
        setServerError('Invalid access code. Please try again.');
      }
    } catch {
      setServerError('Unable to verify. Please try again later.');
    }
  };

  const handleDownload = async () => {
    if (!item) return;
    setDownloading(true);
    try {
      // For blob URLs (local uploads) — direct download works fine
      if (item.url.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = item.url;
        a.download = item.title || 'media';
        a.click();
        return;
      }
      // For remote URLs — fetch as blob to force download dialog
      const res  = await fetch(item.url);
      const blob = await res.blob();
      const ext  = blob.type.split('/')[1] || 'jpg';
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${item.title || 'media'}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(item.url, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Download Media" size="sm">
      {!verified ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 mx-auto mb-2">
            <Lock size={22} className="text-primary-600" />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Enter the access code to download <strong className="text-gray-700">{item?.title}</strong>.
          </p>

          <Input
            label="Access Code"
            placeholder="Enter code…"
            error={errors.code?.message}
            {...register('code')}
          />

          {serverError && (
            <p className="text-sm text-red-600 text-center">{serverError}</p>
          )}

          <Button type="submit" loading={isSubmitting} fullWidth>
            Verify & Download
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 mx-auto">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-sm text-gray-700 font-medium">Access Granted!</p>
          <p className="text-xs text-gray-500">Click the button below to download <strong>{item?.title}</strong>.</p>
          <Button
            fullWidth
            leftIcon={<Download size={16} />}
            loading={downloading}
            onClick={handleDownload}
          >
            {downloading ? 'Downloading…' : 'Download Now'}
          </Button>
        </div>
      )}
    </Modal>
  );
}
