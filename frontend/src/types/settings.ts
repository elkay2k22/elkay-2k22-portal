export interface FundSummary {
  totalCollected: number;
  totalUtilized: number;
  availableBalance: number;
}

export interface ContactInfo {
  phones: string[];
  whatsapp: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  upiQrUrl?: string;
}

export interface AboutContent {
  batchHistory: string;
  ngoVision: string;
  ngoMission: string;
  groupPhotos: string[];
}

export interface AppSettings {
  fundSummary: FundSummary;
  contactInfo: ContactInfo;
  aboutContent: AboutContent;
  downloadAccessCode: string;
}
