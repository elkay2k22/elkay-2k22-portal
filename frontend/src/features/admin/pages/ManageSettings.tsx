import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Save, Key, Wallet, Eye, EyeOff } from 'lucide-react';
import { AdminShell } from '../components/AdminShell';
import { Card, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useFetch } from '@/hooks/useFetch';
import { settingsService } from '@/services/settingsService';
import { SkeletonText, ErrorState } from '@/components/ui/Loader';

/* ── Fund form ───────────────────────────────────────────────────────────── */
const fundSchema = z.object({
  totalCollected: z.number({ invalid_type_error: 'Required' }).min(0),
  totalUtilized:  z.number({ invalid_type_error: 'Required' }).min(0),
});
type FundValues = z.infer<typeof fundSchema>;

/* ── Access code form ────────────────────────────────────────────────────── */
const codeSchema = z.object({
  code: z.string().min(4, 'Code must be at least 4 characters'),
});
type CodeValues = z.infer<typeof codeSchema>;

export default function ManageSettings() {
  const { data, loading, error, refetch } = useFetch(() => settingsService.get());
  const [fundSaved, setFundSaved]   = useState(false);
  const [codeSaved, setCodeSaved]   = useState(false);
  const [showCode, setShowCode]     = useState(false);
  const [currentCode, setCurrentCode] = useState('');

  const fundForm = useForm<FundValues>({
    resolver: zodResolver(fundSchema),
    defaultValues: { totalCollected: 0, totalUtilized: 0 },
  });

  const codeForm = useForm<CodeValues>({ resolver: zodResolver(codeSchema) });

  // Populate forms once data loads
  useEffect(() => {
    if (data?.fundSummary) {
      fundForm.reset({
        totalCollected: data.fundSummary.totalCollected,
        totalUtilized:  data.fundSummary.totalUtilized,
      });
    }
    if (data?.downloadAccessCode) {
      setCurrentCode(data.downloadAccessCode);
      codeForm.reset({ code: data.downloadAccessCode });
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveFund = async (values: FundValues) => {
    await settingsService.updateFund(values);
    setFundSaved(true);
    setTimeout(() => setFundSaved(false), 3000);
    refetch();
  };

  const saveCode = async ({ code }: CodeValues) => {
    await settingsService.updateAccessCode(code);
    setCurrentCode(code);
    setCodeSaved(true);
    setTimeout(() => setCodeSaved(false), 3000);
  };

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage fund totals, access code, and more.</p>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <>
            {/* Fund settings */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card>
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                    <Wallet size={20} className="text-blue-600" />
                  </span>
                  <CardTitle>Fund Management</CardTitle>
                </div>
                {loading ? <SkeletonText lines={4} /> : (
                  <form onSubmit={fundForm.handleSubmit(saveFund)} className="space-y-4">
                    <Input
                      label="Total Fund Collected (₹)"
                      type="number"
                      error={fundForm.formState.errors.totalCollected?.message}
                      {...fundForm.register('totalCollected', { valueAsNumber: true })}
                    />
                    <Input
                      label="Total Amount Utilized (₹)"
                      type="number"
                      error={fundForm.formState.errors.totalUtilized?.message}
                      {...fundForm.register('totalUtilized', { valueAsNumber: true })}
                    />
                    <Button
                      type="submit"
                      loading={fundForm.formState.isSubmitting}
                      leftIcon={<Save size={16} />}
                      variant={fundSaved ? 'secondary' : 'primary'}
                    >
                      {fundSaved ? '✓ Saved!' : 'Save Fund Data'}
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Access code */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
              <Card>
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50">
                    <Key size={20} className="text-purple-600" />
                  </span>
                  <CardTitle>Gallery Download Access Code</CardTitle>
                </div>
                {/* Current code display */}
                {currentCode && (
                  <div className="mb-4 flex items-center justify-between rounded-xl bg-purple-50 border border-purple-100 px-4 py-3">
                    <div>
                      <p className="text-xs text-purple-500 font-medium mb-0.5">Current Access Code</p>
                      <p className="text-sm font-mono font-bold text-purple-800 tracking-widest">
                        {showCode ? currentCode : '•'.repeat(currentCode.length)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCode((p) => !p)}
                      className="text-purple-400 hover:text-purple-600 transition-colors"
                    >
                      {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}

                <form onSubmit={codeForm.handleSubmit(saveCode)} className="space-y-4">
                  <Input
                    label="Set New Access Code"
                    placeholder="Enter new code…"
                    error={codeForm.formState.errors.code?.message}
                    {...codeForm.register('code')}
                  />
                  <Button
                    type="submit"
                    loading={codeForm.formState.isSubmitting}
                    leftIcon={<Save size={16} />}
                    variant={codeSaved ? 'secondary' : 'primary'}
                  >
                    {codeSaved ? '✓ Code Updated!' : 'Update Access Code'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
