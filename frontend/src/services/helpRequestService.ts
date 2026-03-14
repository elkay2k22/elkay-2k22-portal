import api from './api';
import { delay, store } from '@/mocks/mockData';
import type { HelpRequest, HelpRequestFormValues } from '@/types/helpRequest';

const USE_MOCK = true;

export const helpRequestService = {
  /** GET /help-requests (admin) */
  getAll: async (page = 1, limit = 50): Promise<HelpRequest[]> => {
    if (USE_MOCK) {
      await delay();
      const start = (page - 1) * limit;
      return store.helpRequests.slice(start, start + limit);
    }
    return api.get<HelpRequest[]>('/help-requests', { params: { page, limit } }).then((r) => r.data);
  },

  /** POST /help-requests — public form submission */
  submit: async (payload: HelpRequestFormValues): Promise<HelpRequest> => {
    if (USE_MOCK) {
      await delay(700);
      const newReq: HelpRequest = {
        ...payload,
        id: String(Date.now()),
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      store.helpRequests.unshift(newReq);
      return newReq;
    }
    return api.post<HelpRequest>('/help-requests', payload).then((r) => r.data);
  },

  /** PATCH /help-requests/:id/status (admin) */
  updateStatus: async (id: string, status: HelpRequest['status'], notes?: string): Promise<HelpRequest> => {
    if (USE_MOCK) {
      await delay(500);
      const idx = store.helpRequests.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error('Request not found');
      store.helpRequests[idx] = {
        ...store.helpRequests[idx],
        status,
        notes,
        resolvedAt: new Date().toISOString(),
      };
      return store.helpRequests[idx];
    }
    return api.patch<HelpRequest>(`/help-requests/${id}/status`, { status, notes }).then((r) => r.data);
  },
};
