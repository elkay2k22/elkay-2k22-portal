import { useState } from 'react';
import { Download, Play, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import type { GalleryItem } from '@/types/gallery';

interface MediaCardProps {
  item: GalleryItem;
  onDownload: (item: GalleryItem) => void;
}

export function MediaCard({ item, onDownload }: MediaCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl overflow-hidden bg-gray-100 shadow-card aspect-square"
    >
      {/* Thumbnail */}
      {!imgError && item.thumbnailUrl ? (
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
          {item.type === 'video' ? <Play size={32} /> : <Image size={32} />}
          <span className="text-xs text-gray-400">{item.title}</span>
        </div>
      )}

      {/* Video badge */}
      {item.type === 'video' && (
        <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
          <Play size={10} className="fill-white" /> Video
        </span>
      )}

      {/* Hover overlay */}
      <div
        className={clsx(
          'absolute inset-0 bg-gradient-to-t from-black/70 via-transparent',
          'flex flex-col justify-end p-3 gap-2',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
        )}
      >
        <p className="text-white text-xs font-medium line-clamp-1">{item.title}</p>
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<Download size={14} />}
          onClick={(e) => { e.stopPropagation(); onDownload(item); }}
          className="self-start bg-white/90 text-gray-800 hover:bg-white"
        >
          Download
        </Button>
      </div>
    </motion.div>
  );
}
