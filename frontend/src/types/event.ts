export interface Event {
  id: string;
  title: string;
  date?: string;        // ISO date string (optional for completed events)
  location: string;
  description: string;
  amountSpent: number;
  images: string[];     // list of image URLs
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
  tags?: string[];
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {
  id: string;
}
