import { SkeletonCard, EmptyState } from '@/components/ui/Loader';
import { MediaCard } from './MediaCard';
import { Image } from 'lucide-react';
import type { GalleryItem } from '@/types/gallery';

interface GalleryGridProps {
  items: GalleryItem[];
  loading?: boolean;
  onDownload: (item: GalleryItem) => void;
}

export function GalleryGrid({ items, loading = false, onDownload }: GalleryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} lines={0} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={<Image size={48} />}
        title="No media yet"
        description="Gallery photos and videos will appear here."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} onDownload={onDownload} />
      ))}
    </div>
  );
}
