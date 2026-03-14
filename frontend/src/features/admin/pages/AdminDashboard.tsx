import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Image, HandHeart, Settings, TrendingUp, Users } from 'lucide-react';
import { AdminShell } from '../components/AdminShell';
import { Card } from '@/components/ui/Card';
import { useFetch } from '@/hooks/useFetch';
import { settingsService } from '@/services/settingsService';
import { helpRequestService } from '@/services/helpRequestService';
import { eventService } from '@/services/eventService';
import { formatCurrency } from '@/utils/formatCurrency';
import { Skeleton } from '@/components/ui/Loader';

const QUICK_LINKS = [
  { label: 'Manage Events',   to: '/admin/events',   icon: <CalendarDays size={22} className="text-blue-600" />,    bg: 'bg-blue-50' },
  { label: 'Manage Gallery',  to: '/admin/gallery',  icon: <Image size={22} className="text-purple-600" />,         bg: 'bg-purple-50' },
  { label: 'Help Requests',   to: '/admin/requests', icon: <HandHeart size={22} className="text-rose-600" />,       bg: 'bg-rose-50' },
  { label: 'Settings',        to: '/admin/settings', icon: <Settings size={22} className="text-amber-600" />,       bg: 'bg-amber-50' },
];

export default function AdminDashboard() {
  const { data: settings, loading: sl } = useFetch(() => settingsService.get());
  const { data: events,   loading: el } = useFetch(() => eventService.getAll(1, 100));
  const { data: requests, loading: rl } = useFetch(() => helpRequestService.getAll(1, 100));

  const pendingCount    = requests?.filter((r) => r.status === 'pending').length ?? 0;
  const fund            = settings?.fundSummary;

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of Elkay 2K22 NGO activities</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Fund Collected', value: sl ? null : formatCurrency(fund?.totalCollected ?? 0), icon: <TrendingUp size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
            { label: 'Utilized',       value: sl ? null : formatCurrency(fund?.totalUtilized ?? 0),  icon: <TrendingUp size={18} className="text-amber-600" />,   bg: 'bg-amber-50' },
            { label: 'Total Events',   value: el ? null : String(events?.length ?? 0),                icon: <CalendarDays size={18} className="text-blue-600" />,  bg: 'bg-blue-50' },
            { label: 'Pending Help',   value: rl ? null : String(pendingCount),                        icon: <Users size={18} className="text-rose-600" />,         bg: 'bg-rose-50' },
          ].map(({ label, value, icon, bg }, idx) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}>
              <Card className="flex items-start gap-3">
                <span className={`flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 ${bg}`}>{icon}</span>
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  {value === null ? (
                    <Skeleton className="h-5 w-16 mt-1 rounded" />
                  ) : (
                    <p className="text-base font-bold text-gray-900">{value}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_LINKS.map(({ label, to, icon, bg }, idx) => (
              <motion.div key={to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 + 0.2 }}>
                <Link to={to}>
                  <Card hover className="flex flex-col items-center gap-3 text-center py-6">
                    <span className={`flex items-center justify-center w-12 h-12 rounded-2xl ${bg}`}>{icon}</span>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pending requests notice */}
        {pendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center justify-between"
          >
            <p className="text-sm text-rose-700 font-medium">
              🔔 {pendingCount} help request{pendingCount > 1 ? 's' : ''} pending review
            </p>
            <Link to="/admin/requests" className="text-sm text-rose-600 font-semibold hover:underline">
              Review →
            </Link>
          </motion.div>
        )}
      </div>
    </AdminShell>
  );
}
