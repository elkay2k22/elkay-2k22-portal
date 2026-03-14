import api from './api';
import { delay, store } from '@/mocks/mockData';
import type { AppSettings, FundSummary, ContactInfo, AboutContent } from '@/types/settings';

const USE_MOCK = true;

// Mock admin credentials (replace with real auth when backend is ready)
const MOCK_ADMIN = { username: 'admin', password: 'admin123' };

export const settingsService = {
  /** GET /settings */
  get: async (): Promise<AppSettings> => {
    if (USE_MOCK) {
      await delay();
      return { ...store.settings };
    }
    return api.get<AppSettings>('/settings').then((r) => r.data);
  },

  /** PATCH /settings/fund  (admin) */
  updateFund: async (data: Partial<FundSummary>): Promise<FundSummary> => {
    if (USE_MOCK) {
      await delay(500);
      store.settings.fundSummary = {
        ...store.settings.fundSummary,
        ...data,
        availableBalance:
          (data.totalCollected ?? store.settings.fundSummary.totalCollected) -
          (data.totalUtilized  ?? store.settings.fundSummary.totalUtilized),
      };
      return store.settings.fundSummary;
    }
    return api.patch<FundSummary>('/settings/fund', data).then((r) => r.data);
  },

  /** PATCH /settings/contact  (admin) */
  updateContact: async (data: Partial<ContactInfo>): Promise<ContactInfo> => {
    if (USE_MOCK) {
      await delay(500);
      store.settings.contactInfo = { ...store.settings.contactInfo, ...data };
      return store.settings.contactInfo;
    }
    return api.patch<ContactInfo>('/settings/contact', data).then((r) => r.data);
  },

  /** PATCH /settings/about  (admin) */
  updateAbout: async (data: Partial<AboutContent>): Promise<AboutContent> => {
    if (USE_MOCK) {
      await delay(500);
      store.settings.aboutContent = { ...store.settings.aboutContent, ...data };
      return store.settings.aboutContent;
    }
    return api.patch<AboutContent>('/settings/about', data).then((r) => r.data);
  },

  /** PATCH /settings/access-code  (admin) */
  updateAccessCode: async (code: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(400);
      store.settings.downloadAccessCode = code;
      return;
    }
    return api.patch('/settings/access-code', { code }).then((r) => r.data);
  },

  /** POST /auth/login */
  adminLogin: async (username: string, password: string): Promise<{ access_token: string }> => {
    if (USE_MOCK) {
      await delay(700);
      if (username === MOCK_ADMIN.username && password === MOCK_ADMIN.password) {
        return { access_token: 'mock-jwt-token-elkay2k22' };
      }
      throw Object.assign(new Error('Unauthorized'), { response: { status: 401 } });
    }
    return api.post<{ access_token: string }>('/auth/login', { username, password }).then((r) => r.data);
  },
};
