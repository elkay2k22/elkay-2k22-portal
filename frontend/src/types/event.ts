export const EVENT_CATEGORIES = [
  'Healthcare',
  'Food Assistance',
  'Relief & Humanitarian Aid',
  'Livelihood Support',
  'Islamic Projects',
  'Community Development',
  'Education',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export interface Event {
  id: string;
  title: string;
  date?: string;
  location: string;
  description: string;
  amountSpent: number;
  images: string[];
  category?: EventCategory;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventPayload {
  title: string;
  date?: string;
  location: string;
  description: string;
  amountSpent: number;
  images?: string[];
  category?: EventCategory;
  tags?: string[];
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {
  id: string;
}
