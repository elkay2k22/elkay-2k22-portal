import { useState, type KeyboardEvent } from 'react';
import { Play, Image} from 'lucide-react';
import { motion } from 'framer-motion';
import type { GalleryItem } from '@/types/gallery';

interface MediaCardProps {
  item: GalleryItem;
  onDownload: (item: GalleryItem) => void;
}

export function MediaCard({ item, onDownload }: MediaCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleOpen = () => onDownload(item);
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer
                 border border-[#e0e6f8] bg-gradient-to-br from-[#eef1fb] to-[#e8f5ee]"
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
    >
      {/* Thumbnail */}
      {!imgError && item.thumbnailUrl ? (
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-350
                     group-hover:scale-[1.06]"
        />
      ) : item.type === 'video' ? (
        <video
          src={item.url}
          muted preload="metadata" playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <div className="w-11 h-11 rounded-[13px] bg-[#1a2c6b]/08
                          flex items-center justify-center">
            <Image size={20} className="text-[#1a2c6b]/40" />
          </div>
          <span className="text-[11px] text-[#6b7aa0] font-medium px-3 text-center
                           line-clamp-1">{item.title}</span>
        </div>
      )}

      {/* Video badge */}
      {item.type === 'video' && (
        <span className="absolute top-2 left-2 flex items-center gap-1
                         px-2 py-0.5 rounded-full bg-black/60 text-white
                         text-[10px] font-semibold backdrop-blur-sm">
          <Play size={9} className="fill-white" /> Video
        </span>
      )}

      {/* Lock badge */}
      {item.accessCodeRequired && (
        <div className="absolute top-2 right-2 w-[26px] h-[26px] rounded-[8px]
                        bg-black/55 flex items-center justify-center backdrop-blur-sm">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2" y="5" width="8" height="6" rx="1.5" stroke="white" strokeWidth="1.2"/>
            <path d="M4 5V4a2 2 0 1 1 4 0v1" stroke="white" strokeWidth="1.2"/>
          </svg>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                      transition-opacity duration-250
                      bg-gradient-to-t from-[#0b1333]/85 via-[#0b1333]/20 to-transparent
                      flex flex-col justify-end p-3">
        <p className="text-white text-[12px] font-bold mb-2 line-clamp-1">{item.title}</p>
    
      </div>
    </motion.div>
  );
}