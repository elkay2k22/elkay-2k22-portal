import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/ui/Loader';
import { AnimatePresence, motion } from 'framer-motion';
import { RequireAuth } from './providers';

/* ── Lazy pages ─────────────────────────────────────────────────────────── */
const HomePage         = lazy(() => import('@/features/home/pages/HomePage'));
const AboutPage        = lazy(() => import('@/features/about/pages/AboutPage'));
const GalleryPage      = lazy(() => import('@/features/gallery/pages/GalleryPage'));
const EventsPage       = lazy(() => import('@/features/events/pages/EventsPage'));
const HelpRequestPage  = lazy(() => import('@/features/helpRequest/pages/HelpRequestPage'));
const ContactPage      = lazy(() => import('@/features/contact/pages/ContactPage'));

const AdminLoginPage   = lazy(() => import('@/features/admin/pages/AdminLoginPage'));
const AdminDashboard   = lazy(() => import('@/features/admin/pages/AdminDashboard'));
const ManageEvents     = lazy(() => import('@/features/admin/pages/ManageEvents'));
const ManageGallery    = lazy(() => import('@/features/admin/pages/ManageGallery'));
const ManageRequests   = lazy(() => import('@/features/admin/pages/ManageRequests'));
const ManageSettings   = lazy(() => import('@/features/admin/pages/ManageSettings'));

/* ── Page transition wrapper ─────────────────────────────────────────────── */
function PageWrapper() {
  return (
    <motion.div
      key={window.location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Outlet />
    </motion.div>
  );
}

/* ── Public layout ───────────────────────────────────────────────────────── */
function PublicLayout() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <PageWrapper />
          </Suspense>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

/* ── Admin layout ────────────────────────────────────────────────────────── */
function AdminLayout() {
  return (
    <RequireAuth>
      <div className="page-wrapper">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </RequireAuth>
  );
}

/* ── Router ───────────────────────────────────────────────────────────────  */
const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true,          element: <HomePage /> },
      { path: 'about',        element: <AboutPage /> },
      { path: 'gallery',      element: <GalleryPage /> },
      { path: 'events',       element: <EventsPage /> },
      { path: 'help-request', element: <HelpRequestPage /> },
      { path: 'contact',      element: <ContactPage /> },
    ],
  },
  {
    path: 'admin',
    children: [
      { path: 'login',  element: <Suspense fallback={<PageLoader />}><AdminLoginPage /></Suspense> },
      {
        element: <AdminLayout />,
        children: [
          { index: true,            element: <AdminDashboard /> },
          { path: 'events',         element: <ManageEvents /> },
          { path: 'gallery',        element: <ManageGallery /> },
          { path: 'requests',       element: <ManageRequests /> },
          { path: 'settings',       element: <ManageSettings /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
