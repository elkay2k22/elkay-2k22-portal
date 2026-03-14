import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard, CalendarDays, Image as ImageIcon,
  HandHeart, Settings, LogOut,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const ADMIN_LINKS = [
  { label: 'Dashboard',     to: '/admin',          icon: <LayoutDashboard size={18} />, end: true },
  { label: 'Events',        to: '/admin/events',   icon: <CalendarDays size={18} /> },
  { label: 'Gallery',       to: '/admin/gallery',  icon: <ImageIcon size={18} /> },
  { label: 'Help Requests', to: '/admin/requests', icon: <HandHeart size={18} /> },
  { label: 'Settings',      to: '/admin/settings', icon: <Settings size={18} /> },
];

export function AdminShell({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 hidden md:flex flex-col bg-white border-r border-gray-100 shadow-card">
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 rounded-2xl p-2 bg-gradient-to-r from-primary-50 to-blue-50 ring-1 ring-primary-100">
            <span className="flex items-center justify-center h-14 w-14 rounded-xl bg-white ring-1 ring-primary-100 shadow-sm flex-shrink-0">
              <img
                src="/logo.jpg"
                alt="Elkay 2K22 Batch"
                className="h-11 w-auto object-contain"
              />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 leading-tight truncate">Elkay 2K22 Batch</p>
              <p className="text-xs font-medium text-primary-700 truncate">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {ADMIN_LINKS.map(({ label, to, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                )
              }
            >
              {icon} {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
