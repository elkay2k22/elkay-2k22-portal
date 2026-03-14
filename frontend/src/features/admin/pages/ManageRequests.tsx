import { AdminShell } from '../components/AdminShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useFetch } from '@/hooks/useFetch';
import { helpRequestService } from '@/services/helpRequestService';
import { formatDate } from '@/utils/dateFormatter';
import { formatCurrency } from '@/utils/formatCurrency';
import { SkeletonCard, ErrorState, EmptyState } from '@/components/ui/Loader';
import { HandHeart, Phone, MapPin } from 'lucide-react';
import type { HelpRequest } from '@/types/helpRequest';
import { useState } from 'react';

const statusBadgeVariant = {
  pending:  'warning' as const,
  approved: 'success' as const,
  rejected: 'danger'  as const,
  resolved: 'info'    as const,
};

function RequestCard({ req, onStatusChange }: { req: HelpRequest; onStatusChange: () => void }) {
  const [loading, setLoading] = useState(false);

  const approve = async () => {
    setLoading(true);
    await helpRequestService.updateStatus(req.id, 'approved');
    onStatusChange();
    setLoading(false);
  };

  const reject = async () => {
    setLoading(true);
    await helpRequestService.updateStatus(req.id, 'rejected');
    onStatusChange();
    setLoading(false);
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">{req.name}</p>
          <p className="text-xs text-gray-500">{formatDate(req.submittedAt)}</p>
        </div>
        <Badge variant={statusBadgeVariant[req.status]} dot>
          {req.status}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Phone size={11} /> {req.phone}</span>
        <span className="flex items-center gap-1"><MapPin size={11} /> {req.address}</span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{req.problemDescription}</p>

      <p className="text-sm font-semibold text-primary-700">
        Amount Needed: {formatCurrency(req.amountNeeded)}
      </p>

      {req.status === 'pending' && (
        <div className="flex gap-2 pt-1">
          <Button size="sm" loading={loading} onClick={approve} className="flex-1">
            Approve
          </Button>
          <Button size="sm" variant="danger" loading={loading} onClick={reject} className="flex-1">
            Reject
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function ManageRequests() {
  const { data: requests, loading, error, refetch } = useFetch(() => helpRequestService.getAll(1, 100));

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Review and action community help requests.</p>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : !requests?.length ? (
          <EmptyState icon={<HandHeart size={48} />} title="No requests yet" description="Help requests submitted by the community will appear here." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <RequestCard key={req.id} req={req} onStatusChange={refetch} />
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
