import api from './api';
import { delay, store } from '@/mocks/mockData';
import type { GalleryItem, GalleryResponse } from '@/types/gallery';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const galleryService = {
  /** GET /gallery */
  getAll: async (page = 1, limit = 20): Promise<GalleryResponse> => {
    if (USE_MOCK) {
      await delay();
      const start = (page - 1) * limit;
      const items = store.gallery.slice(start, start + limit);
      return { items, total: store.gallery.length };
    }
    return api.get<GalleryResponse>('/gallery/', { params: { page, limit } }).then((r) => r.data);
  },

  /** POST /gallery/verify — compare against stored access code */
  verifyCode: async (code: string): Promise<{ valid: boolean }> => {
    if (USE_MOCK) {
      await delay(600);
      // Use store.settings (mutable) so admin changes take effect immediately
      const valid = code.trim().toUpperCase() === store.settings.downloadAccessCode.toUpperCase();
      return { valid };
    }
    return api.post<{ valid: boolean }>('/gallery/verify/', { code }).then((r) => r.data);
  },

  /** POST /gallery  (admin) */
  upload: async (_formData: FormData): Promise<GalleryItem> => {
    if (USE_MOCK) {
      await delay(800);
      const item: GalleryItem = {
        id: String(Date.now()),
        title: 'New Upload',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=70',
        accessCodeRequired: true,
        uploadedAt: new Date().toISOString(),
      };
      store.gallery.unshift(item);
      return item;
    }
    return api.post<GalleryItem>('/gallery/', _formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },

  /** DELETE /gallery/:id  (admin) */
  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(400);
      store.gallery = store.gallery.filter((g) => g.id !== id);
      return;
    }
    return api.delete(`/gallery/${id}/`).then((r) => r.data);
  },
};
