export type MediaType = 'image' | 'video';
export type GalleryCategory = 'school_diaries' | 'farewell' | 'gatherings';

export interface GalleryItem {
  id: string;
  title: string;
  type: MediaType;
  category: GalleryCategory;
  isImportantGathering?: boolean;
  gatheringDate?: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  accessCodeRequired: boolean;
  uploadedAt?: string;
}

export interface GalleryResponse {
  items: GalleryItem[];
  total: number;
}
