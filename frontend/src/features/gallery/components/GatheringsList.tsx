import { CalendarDays, ChevronLeft, ChevronRight, Download, Lock, Play } from 'lucide-react';
import { clsx } from 'clsx';
import { EmptyState, Skeleton } from '@/components/ui/Loader';
import type { GalleryItem } from '@/types/gallery';

interface GatheringsListProps {
  items: GalleryItem[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onDownload: (item: GalleryItem) => void;
}

export function GatheringsList({
  items,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onDownload,
}: GatheringsListProps) {
  const formatGatheringDate = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#e0e6f8] bg-white p-4 md:p-5">
            <div className="grid md:grid-cols-[210px,1fr] gap-4">
              <Skeleton className="h-40 md:h-32 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-1/3 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-4/5 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={<CalendarDays size={44} />}
        title="No gatherings yet"
        description="Gathering moments with story notes will appear here."
      />
    );
  }

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const pageButtons = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const importantItems = items.filter(
    (item) => item.isImportantGathering && item.gatheringDate?.trim() && item.description?.trim(),
  );
  const regularItems = items.filter(
    (item) => !(item.isImportantGathering && item.gatheringDate?.trim() && item.description?.trim()),
  );

  return (
    <div className="space-y-4 md:space-y-5">
      {importantItems.length > 0 && (
        <section className="space-y-3">
          <div className="space-y-3">
            {importantItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[#dfe5f7] bg-white overflow-hidden"
              >
                <div className="grid md:grid-cols-[210px,1fr]">
                  <div className="relative h-40 md:h-full bg-[#edf2ff]">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#eef1fb] to-[#e8f5ee]" />
                    )}

                    {item.type === 'video' && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[10px] font-bold text-white">
                        <Play size={10} className="fill-white" /> Video
                      </span>
                    )}
                  </div>

                  <div className="p-4 md:p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <h4 className="text-[16px] md:text-[17px] font-extrabold text-[#1a2c6b] leading-tight">
                          {item.title}
                        </h4>
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#26613d] bg-[#e7f6ec] w-fit px-2.5 py-1 rounded-full">
                          <CalendarDays size={13} />
                          {formatGatheringDate(item.gatheringDate)}
                        </span>
                      </div>

                      {item.accessCodeRequired && (
                        <span
                          className="inline-flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#1a2c6b]/10 text-[#1a2c6b]"
                          title="Access code required for download"
                        >
                          <Lock size={14} />
                        </span>
                      )}
                    </div>

                    <p className="text-[13px] md:text-[14px] leading-relaxed text-[#556288]">
                      {item.description}
                    </p>

                    <div>
                      <button
                        onClick={() => onDownload(item)}
                        className="h-10 px-4 rounded-[11px] bg-[#1a2c6b] text-white text-[13px] font-bold
                                   inline-flex items-center gap-2 hover:bg-[#15317e] transition-colors"
                      >
                        <Download size={14} /> Open Actions
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {regularItems.length > 0 && (
        <section className="space-y-3 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {regularItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onDownload(item)}
                className="group relative rounded-2xl overflow-hidden aspect-square text-left
                           border border-[#e0e6f8] bg-[#edf2ff]"
              >
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#eef1fb] to-[#e8f5ee]" />
                )}

                {item.type === 'video' && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-bold text-white">
                    <Play size={9} className="fill-white" /> Video
                  </span>
                )}

                {item.accessCodeRequired && (
                  <span
                    className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-[8px] bg-black/55 text-white"
                    title="Access code required for download"
                  >
                    <Lock size={11} />
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 px-2.5 py-2.5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[11px] font-semibold text-white line-clamp-1">{item.title}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-9 px-3 rounded-[10px] border border-[#e0e6f8] bg-white
                       text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                       hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} /> Prev
          </button>

          {pageButtons.map((n) => (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              className={clsx(
                'h-9 min-w-[36px] px-3 rounded-[10px] border text-[13px] font-bold transition-all',
                n === currentPage
                  ? 'bg-[#1a2c6b] text-white border-[#1a2c6b]'
                  : 'bg-white text-[#4a5578] border-[#e0e6f8] hover:bg-[#eef1fb] hover:text-[#1a2c6b] hover:border-[#c5d0f0]'
              )}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-9 px-3 rounded-[10px] border border-[#e0e6f8] bg-white
                       text-[13px] font-600 text-[#4a5578] flex items-center gap-1
                       hover:bg-[#eef1fb] hover:border-[#c5d0f0] hover:text-[#1a2c6b]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
