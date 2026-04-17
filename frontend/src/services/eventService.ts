import api from './api';
import { delay, store } from '@/mocks/mockData';
import type { Event, CreateEventPayload, UpdateEventPayload } from '@/types/event';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return 'http://localhost:8000';
  }
})();

const normalizeMediaUrl = (url: string): string => {
  const raw = (url ?? '').trim();
  if (!raw) {
    return raw;
  }

  if (/^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?/i.test(raw)) {
    return raw.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?/i, API_ORIGIN);
  }

  if (/^https?:\/\/0\.0\.0\.0(?::\d+)?/i.test(raw)) {
    return raw.replace(/^https?:\/\/0\.0\.0\.0(?::\d+)?/i, API_ORIGIN);
  }

  if (raw.startsWith('/')) {
    return `${API_ORIGIN}${raw}`;
  }

  if (raw.startsWith('uploads/')) {
    return `${API_ORIGIN}/${raw}`;
  }

  return raw;
};

const normalizeEvent = (event: Event): Event => ({
  ...event,
  images: (event.images ?? []).map(normalizeMediaUrl),
});

export const eventService = {
  /** GET /events */
  getAll: async (page = 1, limit = 10): Promise<Event[]> => {
    if (USE_MOCK) {
      await delay();
      const start = (page - 1) * limit;
      return store.events.slice(start, start + limit);
    }
    return api.get<Event[]>('/events/', { params: { page, limit } }).then((r) => r.data.map(normalizeEvent));
  },

  /** GET /events/count */
  getTotal: async (): Promise<number> => {
    if (USE_MOCK) {
      await delay(150);
      return store.events.length;
    }
    return api.get<{ total: number }>('/events/count').then((r) => r.data.total);
  },

  /** GET /events/:id */
  getById: async (id: string): Promise<Event> => {
    if (USE_MOCK) {
      await delay(300);
      const ev = store.events.find((e) => e.id === id);
      if (!ev) throw new Error('Event not found');
      return ev;
    }
    return api.get<Event>(`/events/${id}/`).then((r) => normalizeEvent(r.data));
  },

  /** POST /events  (admin) */
  create: async (payload: CreateEventPayload): Promise<Event> => {
    if (USE_MOCK) {
      await delay(500);
      const newEvent: Event = {
        ...payload,
        id: String(Date.now()),
        images: payload.images ?? [],
        createdAt: new Date().toISOString(),
      };
      store.events.unshift(newEvent);
      return newEvent;
    }
    return api.post<Event>('/events/', payload).then((r) => normalizeEvent(r.data));
  },

  /** POST /events/upload-images (admin) */
  uploadImages: async (files: File[]): Promise<string[]> => {
    if (USE_MOCK) {
      await delay(500);
      return files.map((file) => URL.createObjectURL(file));
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return api.post<{ urls: string[] }>('/events/upload-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.urls.map(normalizeMediaUrl));
  },

  /** PATCH /events/:id  (admin) */
  update: async ({ id, ...payload }: UpdateEventPayload): Promise<Event> => {
    if (USE_MOCK) {
      await delay(500);
      const idx = store.events.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error('Event not found');
      store.events[idx] = { ...store.events[idx], ...payload };
      return store.events[idx];
    }
    return api.patch<Event>(`/events/${id}`, payload).then((r) => normalizeEvent(r.data));
  },

  /** DELETE /events/:id  (admin) */
  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(400);
      store.events = store.events.filter((e) => e.id !== id);
      return;
    }
    return api.delete(`/events/${id}`).then((r) => r.data);
  },
};
