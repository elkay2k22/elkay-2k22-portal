import type { Event } from '@/types/event';
import type { GalleryItem, GalleryResponse } from '@/types/gallery';
import type { HelpRequest } from '@/types/helpRequest';
import type { AppSettings } from '@/types/settings';

// ─── Simulate network delay ────────────────────────────────────────────────
export const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// ─── Events ───────────────────────────────────────────────────────────────
export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Eid Food Distribution Drive',
    date: '2024-04-10',
    location: 'Old City, Hyderabad',
    description:
      'Distributed food packets to over 200 families in need during Eid celebrations. Volunteers from the batch personally delivered the packages door-to-door.',
    amountSpent: 18500,
    images: [
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
    ],
    tags: ['food', 'eid', 'distribution'],
    createdAt: '2024-04-11T10:00:00Z',
  },
  {
    id: '2',
    title: 'Medical Camp — Free Health Check-Up',
    date: '2024-06-22',
    location: 'Shahalibanda, Hyderabad',
    description:
      'Organised a free medical camp with 4 doctors covering general medicine, ENT, and ophthalmology. Over 150 patients received consultations and free medicines.',
    amountSpent: 32000,
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    ],
    tags: ['health', 'medical', 'community'],
    createdAt: '2024-06-23T08:30:00Z',
  },
  {
    id: '3',
    title: 'School Bag & Stationery Distribution',
    date: '2024-07-15',
    location: 'Govt. School, Chandrayangutta',
    description:
      'Provided 120 school bags loaded with notebooks, pens, pencils, and geometry boxes to underprivileged students at the start of the academic year.',
    amountSpent: 24000,
    images: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80',
    ],
    tags: ['education', 'children'],
    createdAt: '2024-07-16T09:00:00Z',
  },
  {
    id: '4',
    title: 'Ration Kit Drive — Ramadan 2025',
    date: '2025-03-18',
    location: 'Multiple Locations, Hyderabad',
    description:
      'Distributed 80 ration kits containing rice, dal, oil, sugar, and dates to families ahead of Ramadan. Kits were curated to last the entire month.',
    amountSpent: 40000,
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
    ],
    tags: ['ramadan', 'food', 'ration'],
    createdAt: '2025-03-19T07:00:00Z',
  },
  {
    id: '5',
    title: 'Blanket Distribution — Winter Relief',
    date: '2025-01-05',
    location: 'Moosarambagh, Hyderabad',
    description:
      'Distributed 100 warm blankets to homeless individuals and daily wage workers sleeping outdoors during the winter cold wave.',
    amountSpent: 15000,
    images: [
      'https://images.unsplash.com/photo-1547496502-affa22d38842?w=600&q=80',
    ],
    tags: ['winter', 'relief', 'homeless'],
    createdAt: '2025-01-06T06:00:00Z',
  },
  {
    id: '6',
    title: 'Batch Reunion & Annual Gathering 2025',
    date: '2025-02-14',
    location: 'Garden Restaurant, Banjara Hills',
    description:
      'Annual reunion of Elkay 2K22 batch members. Collected donations, reviewed NGO performance, and planned upcoming charity events for the year.',
    amountSpent: 12000,
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
      'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=80',
    ],
    tags: ['reunion', 'batch', 'planning'],
    createdAt: '2025-02-15T10:00:00Z',
  },
];

// ─── Gallery ──────────────────────────────────────────────────────────────
export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Food Drive – Eid 2024',
    type: 'image',
    category: 'school_diaries',
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&q=70',
    accessCodeRequired: true,
    uploadedAt: '2024-04-11T10:00:00Z',
  },
  {
    id: 'g2',
    title: 'Volunteers at Work',
    type: 'image',
    category: 'school_diaries',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=70',
    accessCodeRequired: true,
    uploadedAt: '2024-04-11T10:00:00Z',
  },
  {
    id: 'g3',
    title: 'Medical Camp – June 2024',
    type: 'image',
    category: 'school_diaries',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=70',
    accessCodeRequired: false,
    uploadedAt: '2024-06-23T08:00:00Z',
  },
  {
    id: 'g4',
    title: 'School Bag Distribution',
    type: 'image',
    category: 'school_diaries',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=70',
    accessCodeRequired: true,
    uploadedAt: '2024-07-16T09:00:00Z',
  },
  {
    id: 'g5',
    title: 'Children with New Stationery',
    type: 'image',
    category: 'school_diaries',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=70',
    accessCodeRequired: false,
    uploadedAt: '2024-07-16T09:30:00Z',
  },
  {
    id: 'g6',
    title: 'Ration Kit Preparation',
    type: 'image',
    category: 'school_diaries',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70',
    accessCodeRequired: true,
    uploadedAt: '2025-03-19T07:30:00Z',
  },
  {
    id: 'g7',
    title: 'Winter Blanket Relief',
    type: 'image',
    category: 'farewell',
    url: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=400&q=70',
    accessCodeRequired: false,
    uploadedAt: '2025-01-06T06:30:00Z',
  },
  {
    id: 'g8',
    title: 'Annual Batch Reunion 2025',
    type: 'image',
    category: 'farewell',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=70',
    accessCodeRequired: true,
    uploadedAt: '2025-02-15T10:00:00Z',
  },
  {
    id: 'g9',
    title: 'Group Photo – Reunion',
    type: 'image',
    category: 'farewell',
    url: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&q=70',
    accessCodeRequired: true,
    uploadedAt: '2025-02-15T10:30:00Z',
  },
  {
    id: 'g10',
    title: 'Community Smiles',
    type: 'image',
    category: 'gatherings',
    isImportantGathering: true,
    gatheringDate: '2025-03-01',
    description: 'Weekend gathering with alumni families to reconnect and plan monthly community support activities.',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=70',
    accessCodeRequired: false,
    uploadedAt: '2025-03-01T08:00:00Z',
  },
  {
    id: 'g11',
    title: 'Donation Collection Day',
    type: 'image',
    category: 'gatherings',
    isImportantGathering: false,
    url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=70',
    accessCodeRequired: false,
    uploadedAt: '2025-03-10T09:00:00Z',
  },
  {
    id: 'g12',
    title: 'Batch Founders',
    type: 'image',
    category: 'gatherings',
    isImportantGathering: true,
    gatheringDate: '2025-02-15',
    description: 'Founding members discussion circle focused on scholarship planning and transparent fund utilization.',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=70',
    accessCodeRequired: true,
    uploadedAt: '2025-02-15T11:00:00Z',
  },
];

export const MOCK_GALLERY_RESPONSE: GalleryResponse = {
  items: MOCK_GALLERY,
  total: MOCK_GALLERY.length,
};

// ─── Help Requests ────────────────────────────────────────────────────────
export const MOCK_HELP_REQUESTS: HelpRequest[] = [
  {
    id: 'hr1',
    name: 'Khaleel Ahmed',
    phone: '9876543210',
    address: 'H.No 4-5, Noor Nagar, Hyderabad – 500024',
    problemDescription:
      'My wife requires urgent surgery for a kidney issue. The hospital has quoted ₹80,000. I am a daily wage labourer and cannot afford this amount. Requesting financial assistance.',
    amountNeeded: 80000,
    status: 'pending',
    submittedAt: '2026-03-10T08:30:00Z',
  },
  {
    id: 'hr2',
    name: 'Fatima Begum',
    phone: '9988776655',
    address: '12-3-456, Saidabad, Hyderabad – 500059',
    problemDescription:
      "I am a widow with three school-going children. I lost my job and am struggling to pay rent and children's school fees. Need help for at least 2 months until I find work.",
    amountNeeded: 15000,
    status: 'approved',
    submittedAt: '2026-02-18T11:00:00Z',
    resolvedAt: '2026-02-20T14:00:00Z',
    notes: 'Verified by admin. Payment issued.',
  },
  {
    id: 'hr3',
    name: 'Mohammed Salim',
    phone: '9123456789',
    address: '8-2-22, Falaknuma, Hyderabad – 500053',
    problemDescription:
      'My son has a congenital heart defect and needs a surgery. We have partial insurance coverage but still need ₹45,000 for out-of-pocket expenses.',
    amountNeeded: 45000,
    status: 'resolved',
    submittedAt: '2026-01-05T09:00:00Z',
    resolvedAt: '2026-01-12T10:00:00Z',
    notes: 'Amount disbursed. Surgery completed successfully.',
  },
  {
    id: 'hr4',
    name: 'Reshma Khatoon',
    phone: '9000112233',
    address: '3-4-789, Toli Chowki, Hyderabad – 500008',
    problemDescription:
      'House damaged partially in recent rains. Need immediate help for repair of roof and walls to protect family during upcoming monsoon.',
    amountNeeded: 25000,
    status: 'pending',
    submittedAt: '2026-03-11T07:00:00Z',
  },
];

// ─── App Settings ─────────────────────────────────────────────────────────
export const MOCK_SETTINGS: AppSettings = {
  fundSummary: {
    totalCollected: 350000,
    totalUtilized: 141500,
    availableBalance: 208500,
  },
  contactInfo: {
    phones: ['+91 98765 43210', '+91 90001 12233'],
    whatsapp: '+919876543210',
    bankName: 'State Bank of India',
    accountName: 'Elkay 2K22 Batch NGO',
    accountNumber: '12345678901234',
    ifscCode: 'SBIN0012345',
    upiId: 'elkay2k22@sbi',
    upiQrUrl: '',
  },
  aboutContent: {
    batchHistory:
      'Elkay 2K22 Batch is a batch of close friends who studied together and graduated in 2022. What started as a WhatsApp group to share memories soon grew into a mission-driven community. Inspired by the challenges we witnessed around us, we formed a small fund pool to help those in need.\n\nOver the past 2+ years, we have organically grown to 200+ active members across Hyderabad and beyond. Every member contributes monthly, and every rupee is accounted for with full transparency.',
    ngoVision:
      'A society where no deserving individual is left behind — where compassion, education, and healthcare are accessible to every family, regardless of their economic status.',
    ngoMission:
      'To channel our collective resources and energy into meaningful, transparent charity work — helping families in crisis, supporting children\'s education, providing medical aid, and building a healthier, more caring community one event at a time.',
    groupPhotos: [
      'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    ],
  },
  downloadAccessCode: 'ELKAY2K22',
};

// ─── In-memory mutable store (admin can mutate during session) ─────────────
export const store = {
  events: [...MOCK_EVENTS],
  gallery: [...MOCK_GALLERY],
  helpRequests: [...MOCK_HELP_REQUESTS],
  settings: { ...MOCK_SETTINGS },
};
