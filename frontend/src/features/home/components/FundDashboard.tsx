import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Loader';
import { formatCurrency } from '@/utils/formatCurrency';
import type { FundSummary } from '@/types/settings';

interface FundDashboardProps {
  data: FundSummary | null;
  loading?: boolean;
}

const statItems = (data: FundSummary) => [
  {
    label:    'Total Collected',
    value:    data.totalCollected,
    icon:     <TrendingUp size={22} className="text-blue-600" />,
    bg:       'bg-blue-50',
    color:    'text-blue-700',
  },
  {
    label:    'Total Utilized',
    value:    data.totalUtilized,
    icon:     <TrendingDown size={22} className="text-amber-600" />,
    bg:       'bg-amber-50',
    color:    'text-amber-700',
  },
  {
    label:    'Available Balance',
    value:    data.availableBalance,
    icon:     <Wallet size={22} className="text-blue-600" />,
    bg:       'bg-blue-50',
    color:    'text-blue-700',
  },
];

export function FundDashboard({ data, loading = false }: FundDashboardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const total = data.totalCollected || 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statItems(data).map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
        >
          <Card className="flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color}`}>
                {formatCurrency(item.value)}
              </p>
            </div>
            {/* Mini progress bar for utilization */}
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  idx === 0 ? 'bg-blue-500' :
                  idx === 1 ? 'bg-amber-400' : 'bg-blue-400'
                }`}
                style={{ width: `${Math.min((item.value / total) * 100, 100)}%` }}
              />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
