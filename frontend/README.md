# Elkay 2K22 — Frontend

A production-ready mobile-first web app for the **Elkay 2K22 Batch & NGO** community.  
Built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and Zustand.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| **React 18 + Vite** | UI framework & dev server |
| **TypeScript** | Type safety |
| **Tailwind CSS 3** | Utility-first styling |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client |
| **Zustand** | Global auth state management |
| **React Hook Form + Zod** | Forms & validation |
| **Framer Motion** | Page & component animations |
| **Lucide React** | Icon library |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
cd frontend
cp .env.example .env    # configure API base URL
npm install
npm run dev
```

The app starts at **http://localhost:5173**

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | FastAPI backend base URL | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | App display name | `Elkay 2K22` |
| `VITE_APP_ENV` | Environment | `development` |

---

## Project Structure

```
src/
  app/
    router.tsx          ← All routes (lazy-loaded pages)
    providers.tsx       ← Auth guard, global providers
  
  components/
    ui/                 ← Button, Card, Input, Modal, Badge, Loader
    layout/             ← Navbar, Footer, Container, SectionTitle
  
  features/
    home/               ← Hero, Fund Dashboard, Event Highlights
    about/              ← Batch history, Vision & Mission
    gallery/            ← Photo grid + download access code modal
    events/             ← Charity event list and cards
    helpRequest/        ← Public help request form
    contact/            ← Phone, WhatsApp, bank & UPI details
    admin/              ← Login, Dashboard, Manage (Events/Gallery/Requests/Settings)
  
  hooks/
    useFetch.ts         ← Generic data-fetching hook
    useModal.ts         ← Modal open/close hook
  
  services/
    api.ts              ← Axios instance with auth interceptors
    eventService.ts
    galleryService.ts
    helpRequestService.ts
    settingsService.ts
  
  types/                ← TypeScript interfaces for all entities
  utils/
    formatCurrency.ts   ← INR formatter
    dateFormatter.ts    ← Date/time helpers
  styles/
    globals.css         ← Tailwind + custom base styles
```

---

## API Endpoint Reference

All API calls hit `VITE_API_BASE_URL`. Backend is FastAPI.

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/settings` | App settings, fund data, contact info, about |
| `GET` | `/events` | List all events |
| `GET` | `/events/:id` | Single event |
| `GET` | `/gallery` | Gallery items |
| `POST` | `/gallery/verify` | Verify gallery download code |
| `POST` | `/help-requests` | Submit a help request |

### Admin Endpoints (Bearer token required)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Admin login → returns JWT |
| `POST` | `/events` | Create event |
| `PATCH` | `/events/:id` | Update event |
| `DELETE` | `/events/:id` | Delete event |
| `POST` | `/gallery` | Upload media |
| `DELETE` | `/gallery/:id` | Remove media item |
| `GET` | `/help-requests` | List all requests |
| `PATCH` | `/help-requests/:id/status` | Approve / reject request |
| `PATCH` | `/settings/fund` | Update fund totals |
| `PATCH` | `/settings/contact` | Update contact info |
| `PATCH` | `/settings/about` | Update about content |
| `PATCH` | `/settings/access-code` | Update gallery access code |

---

## Admin Access

Navigate to `/admin/login`. On successful login a JWT is stored in `localStorage` and Zustand persists the auth state.

---

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Type-check + production build
npm run preview      # Preview production build locally
npm run type-check   # TypeScript check only
npm run lint         # ESLint
```

---

## Design System

- **Primary color** — Emerald / Green (`primary-*` tokens in Tailwind config)
- **Background** — Light gray (`bg-gray-50`)
- **Cards** — White with `shadow-card` and `rounded-2xl`
- **Typography** — Inter (body) + Poppins (headings) from Google Fonts
- **Animations** — Framer Motion, 200–400 ms ease-out transitions
- **Icons** — Lucide React

---

## Backend

Backend (FastAPI) lives in `../backend/`.  
Connect by setting `VITE_API_BASE_URL` in `.env`.
