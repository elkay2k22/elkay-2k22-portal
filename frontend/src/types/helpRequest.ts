export type HelpRequestStatus = 'pending' | 'approved' | 'rejected' | 'resolved';

export interface HelpRequest {
  id: string;
  name: string;
  phone: string;
  address: string;
  problemDescription: string;
  amountNeeded: number;
  status: HelpRequestStatus;
  submittedAt: string;
  resolvedAt?: string;
  notes?: string;
}

export interface HelpRequestFormValues {
  name: string;
  phone: string;
  address: string;
  problemDescription: string;
  amountNeeded: number;
}
