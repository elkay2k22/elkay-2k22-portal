import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { GalleryGrid } from '../components/GalleryGrid';
import { GatheringsList } from '../components/GatheringsList';
import { DownloadModal } from '../components/DownloadModal';
import { useModal } from '@/hooks/useModal';
import { galleryService } from '@/services/galleryService';
import { ErrorState } from '@/components/ui/Loader';
import { clsx } from 'clsx';
import type { GalleryCategory, GalleryItem } from '@/types/gallery';

const PAGE_SIZE = 20;
const TABS: Array<{ key: GalleryCategory; label: string }> = [
  { key: 'school_diaries', label: 'School Diaries' },
  { key: 'farewell', label: 'Farewell Day' },
  { key: 'gatherings', label: 'Gatherings' },
];

export default function GalleryPage() {
  const { isOpen, open, close } = useModal();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<GalleryCategory>('school_diaries');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const fetchPage = async (targetPage: number, category: GalleryCategory = activeTab) => {
    setLoading(true);
    setError(null);

    try {
      const data = await galleryService.getAll(targetPage, PAGE_SIZE, category);
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
    fetchPage(1, activeTab);
  }, [activeTab]);

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

  const handleTabChange = (tab: GalleryCategory) => {
    if (loading || tab === activeTab) {
      return;
    }
    setActiveTab(tab);
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
          subtitle="Explore by category. School Diaries and Farewell keep the classic layout, while Gatherings include story notes."
          className="mb-6 md:mb-7"
        />

        <div className="mb-5 flex flex-wrap gap-2.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={clsx(
                'h-10 px-4 rounded-[12px] border text-[13px] font-bold transition-all',
                activeTab === tab.key
                  ? 'bg-[#1a2c6b] text-white border-[#1a2c6b]'
                  : 'bg-white text-[#4a5578] border-[#e0e6f8] hover:bg-[#eef1fb] hover:text-[#1a2c6b] hover:border-[#c5d0f0]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : activeTab === 'gatherings' ? (
          <GatheringsList
            items={items}
            loading={loading}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onDownload={handleDownload}
          />
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
