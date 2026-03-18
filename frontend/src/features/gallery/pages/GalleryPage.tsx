import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { GalleryGrid } from '../components/GalleryGrid';
import { DownloadModal } from '../components/DownloadModal';
import { useModal } from '@/hooks/useModal';
import { galleryService } from '@/services/galleryService';
import { ErrorState } from '@/components/ui/Loader';
import type { GalleryItem } from '@/types/gallery';

const PAGE_SIZE = 20;

export default function GalleryPage() {
  const { isOpen, open, close } = useModal();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const fetchPage = async (targetPage: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await galleryService.getAll(targetPage, PAGE_SIZE);
      setItems(data.items);
      setTotal(data.total);
      setPage(targetPage);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string }; message?: string }; message?: string })
          ?.response?.data?.detail ??
        (err as { message?: string })?.message ??
        'Unable to load gallery';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handlePageChange = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === page || loading) {
      return;
    }
    fetchPage(targetPage);
  };

  const handleRetry = () => {
    fetchPage(page);
  };

  const handleDownload = (item: GalleryItem) => {
    setSelectedItem(item);
    open();
  };

  return (
    <div className="bg-[#f5f7ff] py-8 md:py-10">
      <Container>
        <SectionTitle
          tag="Memories"
          title="Gallery"
          subtitle="Browse our batch photos and event videos. Preview freely — enter the access code to download."
          className="mb-6 md:mb-7"
        />

        {error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : (
          <GalleryGrid
            items={items}
            loading={loading}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onDownload={handleDownload}
          />
        )}
      </Container>

      <DownloadModal isOpen={isOpen} onClose={close} item={selectedItem} />
    </div>
  );
}
