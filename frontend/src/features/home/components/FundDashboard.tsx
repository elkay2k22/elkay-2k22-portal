import { motion } from 'framer-motion';
import { HandHeart } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Loader';
import { formatCurrency } from '@/utils/formatCurrency';
import type { FundSummary } from '@/types/settings';

interface FundDashboardProps {
  data: FundSummary | null;
  loading?: boolean;
}

export function FundDashboard({ data, loading = false }: FundDashboardProps) {
  if (loading) {
    return (
      <Skeleton className="h-40 rounded-3xl" />
    );
  }

  if (!data) return null;

  const donated = data.totalUtilized;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="relative overflow-hidden border border-primary-100 bg-white text-gray-900 shadow-card">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary-600 via-primary-500 to-[#25a065]" />
        <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-primary-100/70" />
        <div className="pointer-events-none absolute -bottom-16 right-20 h-44 w-44 rounded-full bg-[#25a065]/10" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-600">Donation</p>
            <h3 className="mt-2 text-3xl font-extrabold leading-tight text-primary-700 md:text-4xl">
              {formatCurrency(donated)}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Amount directly contributed to activities and help requests.
            </p>
          </div>

          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <HandHeart size={28} className="text-primary-600" />
          </div>
        </div>

        <div className="relative z-10 mt-5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-4/5 rounded-full bg-primary-500" />
        </div>
      </Card>
    </motion.div>
  );
}
