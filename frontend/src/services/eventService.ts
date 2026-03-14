import api from './api';
import { delay, store } from '@/mocks/mockData';
import type { Event, CreateEventPayload, UpdateEventPayload } from '@/types/event';

// ── Set to false once the FastAPI backend is ready ────────────────────────
const USE_MOCK = true;

export const eventService = {
  /** GET /events */
  getAll: async (page = 1, limit = 10): Promise<Event[]> => {
    if (USE_MOCK) {
      await delay();
      const start = (page - 1) * limit;
      return store.events.slice(start, start + limit);
    }
    return api.get<Event[]>('/events', { params: { page, limit } }).then((r) => r.data);
  },

  /** GET /events/:id */
  getById: async (id: string): Promise<Event> => {
    if (USE_MOCK) {
      await delay(300);
      const ev = store.events.find((e) => e.id === id);
      if (!ev) throw new Error('Event not found');
      return ev;
    }
    return api.get<Event>(`/events/${id}`).then((r) => r.data);
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
    return api.post<Event>('/events', payload).then((r) => r.data);
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
    return api.patch<Event>(`/events/${id}`, payload).then((r) => r.data);
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
