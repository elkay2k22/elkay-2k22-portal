import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { GalleryGrid } from '../components/GalleryGrid';
import { DownloadModal } from '../components/DownloadModal';
import { useFetch } from '@/hooks/useFetch';
import { useModal } from '@/hooks/useModal';
import { galleryService } from '@/services/galleryService';
import { ErrorState } from '@/components/ui/Loader';
import type { GalleryItem } from '@/types/gallery';

export default function GalleryPage() {
  const { data, loading, error, refetch } = useFetch(() => galleryService.getAll());
  const { isOpen, open, close } = useModal();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const handleDownload = (item: GalleryItem) => {
    if (item.accessCodeRequired) {
      setSelectedItem(item);
      open();
    } else {
      window.open(item.url, '_blank');
    }
  };

  return (
    <div className="section-padding">
      <Container>
        <SectionTitle
          tag="Memories"
          title="Gallery"
          subtitle="Browse our batch photos and event videos. Enter the access code to download."
        />

        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <GalleryGrid
            items={data?.items ?? []}
            loading={loading}
            onDownload={handleDownload}
          />
        )}
      </Container>

      <DownloadModal isOpen={isOpen} onClose={close} item={selectedItem} />
    </div>
  );
}
