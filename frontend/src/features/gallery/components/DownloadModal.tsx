import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Download, Eye } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
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
  const [codeVerified, setCodeVerified] = useState(false);
  const [downloading, setDownloading]   = useState(false);
  /** true  → show the access-code form (download gated)
   *  false → show the main action panel (preview + download) */
  const [showCodeForm, setShowCodeForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!isOpen) return;
    setServerError('');
    setDownloading(false);
    setCodeVerified(false);
    setShowCodeForm(false);
    reset();
  }, [isOpen, item, reset]);

  const handleClose = () => {
    reset();
    setServerError('');
    setCodeVerified(false);
    setShowCodeForm(false);
    onClose();
  };

  /* ── Preview: always allowed, no code needed ── */
  const handlePreview = () => {
    if (!item) return;
    window.open(item.url, '_blank');
  };

  /* ── Download button clicked ── */
  const handleDownloadClick = () => {
    if (!item) return;
    if (item.accessCodeRequired && !codeVerified) {
      // Show the access-code form before downloading
      setShowCodeForm(true);
    } else {
      doDownload();
    }
  };

  /* ── Verify code then download ── */
  const onSubmit = async ({ code }: FormValues) => {
    setServerError('');
    try {
      const { valid } = await galleryService.verifyCode(code);
      if (valid) {
        setCodeVerified(true);
        setShowCodeForm(false);
        doDownload();
      } else {
        setServerError('Invalid access code. Please try again.');
      }
    } catch {
      setServerError('Unable to verify. Please try again later.');
    }
  };

  /* ── Actual download logic ── */
  const doDownload = async () => {
    if (!item) return;
    setDownloading(true);
    try {
      if (item.url.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = item.url;
        a.download = item.title || 'media';
        a.click();
        handleClose();
        return;
      }

      const apiBase = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, '');
      const downloadUrl = `${apiBase}/gallery/${item.id}/download`;

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      handleClose();
    } catch {
      setServerError('Download failed. Please try again.');
      setDownloading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Media" size="sm">

      {/* ── Access-code form (only shown when download is requested) ── */}
      {showCodeForm ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="w-[52px] h-[52px] rounded-[15px] bg-[#eef1fb]
                          flex items-center justify-center mx-auto">
            <Lock size={22} className="text-[#1a2c6b]" />
          </div>
          <div className="text-center">
            <p className="text-[17px] font-extrabold text-[#1a2c6b] mb-1">Download Protected</p>
            <p className="text-[13px] text-[#6b7aa0] leading-relaxed">
              Enter the access code to download{' '}
              <strong className="text-[#1a2c6b] font-bold">{item?.title}</strong>.
            </p>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#4a5578] mb-1.5 tracking-[0.3px]">
              Access Code
            </label>
            <input
              placeholder="Enter code…"
              className="w-full h-[42px] border-[1.5px] border-[#e0e6f8] rounded-[11px]
                         px-3.5 text-[14px] text-[#1a2c6b] font-medium outline-none
                         focus:border-[#1a2c6b] transition-colors"
              {...register('code')}
            />
            {errors.code && (
              <p className="text-[12px] text-red-500 mt-1">{errors.code.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-[12px] text-red-500 text-center">{serverError}</p>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => { setShowCodeForm(false); setServerError(''); reset(); }}
              className="h-[44px] rounded-[11px] bg-[#f5f7ff] border border-[#e0e6f8]
                         text-[#1a2c6b] text-[13px] font-bold flex items-center justify-center gap-1.5
                         hover:bg-[#eef1fb] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[44px] rounded-[11px] font-bold text-[14px] text-white
                         flex items-center justify-center gap-2
                         bg-gradient-to-r from-[#1a2c6b] to-[#25a065]
                         hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? 'Verifying…' : (
                <>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <circle cx="7.5" cy="7.5" r="6" stroke="white" strokeWidth="1.3"/>
                    <path d="M5 7.5l2 2 3-3" stroke="white" strokeWidth="1.4"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Verify &amp; Download
                </>
              )}
            </button>
          </div>
        </form>

      ) : (
        /* ── Default action panel (preview always free, download may require code) ── */
        <div className="text-center space-y-4">
          <div className="w-[52px] h-[52px] rounded-[15px] bg-[#e8f5ee]
                          flex items-center justify-center mx-auto">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="10" stroke="#25a065" strokeWidth="1.8"/>
              <path d="M9 13l3 3 5-5" stroke="#25a065" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-[17px] font-extrabold text-[#1a2c6b] mb-1">Choose an action</p>
            <p className="text-[13px] text-[#6b7aa0]">
              You can preview or download{' '}
              <strong className="text-[#1a2c6b] font-bold">{item?.title}</strong>.
            </p>
          </div>
          {serverError && (
            <p className="text-[12px] text-red-500 text-center">{serverError}</p>
          )}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handlePreview}
              className="h-[44px] rounded-[11px] bg-[#f5f7ff] border border-[#e0e6f8]
                         text-[#1a2c6b] text-[13px] font-bold flex items-center justify-center gap-1.5
                         hover:bg-[#eef1fb] transition-colors"
            >
              <Eye size={15} /> Preview
            </button>
            <button
              onClick={handleDownloadClick}
              disabled={downloading}
              className="h-[44px] rounded-[11px] bg-[#1a2c6b] text-white text-[13px] font-bold
                         flex items-center justify-center gap-1.5
                         hover:bg-[#25a065] transition-colors disabled:opacity-60"
            >
              <Download size={15} />
              {downloading ? 'Downloading…' : 'Download'}
            </button>
          </div>
        </div>
      )}

    </Modal>
  );
}
