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
import type { ContactInfo } from '@/types/settings';

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

/* ── Contact form ────────────────────────────────────────────────────────── */
const contactSchema = z.object({
  phones: z.string(),
  whatsapp: z.string(),
  bankName: z.string(),
  accountName: z.string(),
  accountNumber: z.string(),
  ifscCode: z.string(),
  upiId: z.string(),
  upiQrUrl: z.string(),
});
type ContactValues = z.infer<typeof contactSchema>;

const normalizeWhatsappNumber = (value: string): string => {
  let digits = value.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  // Local India format like 09876543210 -> 919876543210
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = `91${digits.slice(1)}`;
  }

  // Common local format fallback: if 10-digit Indian mobile is provided, prefix country code.
  if (digits.length === 10) {
    return `91${digits}`;
  }

  // Fix malformed +91 format with trunk zero: +91 09876543210 -> 919876543210
  if (digits.startsWith('91') && digits.length === 12 && digits[2] === '0') {
    digits = `91${digits.slice(3)}`;
  }

  return digits;
};

export default function ManageSettings() {
  const { data, loading, error, refetch } = useFetch(() => settingsService.get());
  const [fundSaved, setFundSaved]   = useState(false);
  const [contactSaved, setContactSaved] = useState(false);
  const [codeSaved, setCodeSaved]   = useState(false);
  const [showCode, setShowCode]     = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [qrUploading, setQrUploading] = useState(false);

  const fundForm = useForm<FundValues>({
    resolver: zodResolver(fundSchema),
    defaultValues: { totalCollected: 0, totalUtilized: 0 },
  });
  const contactForm = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phones: '',
      whatsapp: '',
      bankName: '',
      accountName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
      upiQrUrl: '',
    },
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
    if (data?.contactInfo) {
      contactForm.reset({
        phones: (data.contactInfo.phones ?? []).join(', '),
        whatsapp: data.contactInfo.whatsapp ?? '',
        bankName: data.contactInfo.bankName ?? '',
        accountName: data.contactInfo.accountName ?? '',
        accountNumber: data.contactInfo.accountNumber ?? '',
        ifscCode: data.contactInfo.ifscCode ?? '',
        upiId: data.contactInfo.upiId ?? '',
        upiQrUrl: data.contactInfo.upiQrUrl ?? '',
      });
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveFund = async (values: FundValues) => {
    await settingsService.updateFund(values);
    setFundSaved(true);
    setTimeout(() => setFundSaved(false), 3000);
    refetch();
  };

  const saveContact = async (values: ContactValues) => {
    const whatsapp = normalizeWhatsappNumber(values.whatsapp);

    const payload: Partial<ContactInfo> = {
      phones: values.phones
        .split(',')
        .map((phone) => phone.trim())
        .filter(Boolean),
      whatsapp,
      bankName: values.bankName,
      accountName: values.accountName,
      accountNumber: values.accountNumber,
      ifscCode: values.ifscCode,
      upiId: values.upiId,
      upiQrUrl: values.upiQrUrl,
    };
    await settingsService.updateContact(payload);
    contactForm.setValue('whatsapp', whatsapp, { shouldDirty: false });
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 3000);
    refetch();
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setQrUploading(true);
    try {
      const { upiQrUrl } = await settingsService.uploadUpiQr(file);
      contactForm.setValue('upiQrUrl', upiQrUrl, { shouldDirty: true });
      await saveContact({ ...contactForm.getValues(), upiQrUrl });
    } finally {
      setQrUploading(false);
      e.currentTarget.value = '';
    }
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

            {/* Contact and bank details */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }}>
              <Card>
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50">
                    <Wallet size={20} className="text-emerald-600" />
                  </span>
                  <CardTitle>Contact & Bank Details</CardTitle>
                </div>

                {loading ? <SkeletonText lines={7} /> : (
                  <form onSubmit={contactForm.handleSubmit(saveContact)} className="space-y-4">
                    <Input
                      label="Phone Numbers (comma separated)"
                      placeholder="9876543210, 9000112233"
                      error={contactForm.formState.errors.phones?.message}
                      {...contactForm.register('phones')}
                    />
                    <Input
                      label="WhatsApp"
                      placeholder="+91 98765 43210"
                      error={contactForm.formState.errors.whatsapp?.message}
                      {...contactForm.register('whatsapp')}
                    />
                    <Input
                      label="Bank Name"
                      placeholder="State Bank of India"
                      error={contactForm.formState.errors.bankName?.message}
                      {...contactForm.register('bankName')}
                    />
                    <Input
                      label="Account Name"
                      placeholder="Elkay 2K22 Batch NGO"
                      error={contactForm.formState.errors.accountName?.message}
                      {...contactForm.register('accountName')}
                    />
                    <Input
                      label="Account Number"
                      placeholder="12345678901234"
                      error={contactForm.formState.errors.accountNumber?.message}
                      {...contactForm.register('accountNumber')}
                    />
                    <Input
                      label="IFSC Code"
                      placeholder="SBIN0012345"
                      error={contactForm.formState.errors.ifscCode?.message}
                      {...contactForm.register('ifscCode')}
                    />
                    <Input
                      label="UPI ID"
                      placeholder="elkay2k22@sbi"
                      error={contactForm.formState.errors.upiId?.message}
                      {...contactForm.register('upiId')}
                    />
                    <Input
                      label="UPI QR URL"
                      placeholder="https://example.com/qr.png"
                      error={contactForm.formState.errors.upiQrUrl?.message}
                      {...contactForm.register('upiQrUrl')}
                    />

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Upload QR Image</label>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleQrUpload}
                        className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
                      />
                      <p className="text-xs text-gray-500">
                        Uploading automatically stores the image and fills UPI QR URL.
                      </p>
                      {qrUploading && <p className="text-xs text-primary-600">Uploading QR image...</p>}
                    </div>

                    <Button
                      type="submit"
                      loading={contactForm.formState.isSubmitting}
                      leftIcon={<Save size={16} />}
                      variant={contactSaved ? 'secondary' : 'primary'}
                    >
                      {contactSaved ? '✓ Contact Saved!' : 'Save Contact Details'}
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
