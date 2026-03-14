export type MediaType = 'image' | 'video';

export interface GalleryItem {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  accessCodeRequired: boolean;
  uploadedAt?: string;
}

export interface GalleryResponse {
  items: GalleryItem[];
  total: number;
}
