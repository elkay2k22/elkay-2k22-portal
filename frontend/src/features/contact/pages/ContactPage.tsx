import { motion } from 'framer-motion';
import { Phone, MessageCircle, Building2, CreditCard, QrCode } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SectionTitle } from '@/components/layout/SectionTitle';
import { Card, CardTitle } from '@/components/ui/Card';
import { useFetch } from '@/hooks/useFetch';
import { settingsService } from '@/services/settingsService';
import { SkeletonText, ErrorState } from '@/components/ui/Loader';

const buildWhatsappHref = (rawValue?: string): string | null => {
  if (!rawValue) {
    return null;
  }

  let digits = rawValue.replace(/\D/g, '');
  if (!digits) {
    return null;
  }

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  // Local India format like 09876543210 -> 919876543210
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = `91${digits.slice(1)}`;
  }

  // Support admin input without country code by assuming India (+91) for 10-digit numbers.
  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  // Fix malformed +91 format with trunk zero: +91 09876543210 -> 919876543210
  if (digits.startsWith('91') && digits.length === 12 && digits[2] === '0') {
    digits = `91${digits.slice(3)}`;
  }

  if (digits.length < 11 || digits.length > 15) {
    return null;
  }

  return `https://api.whatsapp.com/send?phone=${digits}`;
};

export default function ContactPage() {
  const { data, loading, error, refetch } = useFetch(() => settingsService.get());
  const contact = data?.contactInfo;
  const whatsappHref = buildWhatsappHref(contact?.whatsapp);

  return (
    <div className="section-padding">
      <Container>
        <SectionTitle
          tag="Reach Us"
          title="Contact Us"
          subtitle="Have questions or want to donate? Find all ways to reach us here."
        />

        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone & WhatsApp */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card className="h-full">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50">
                    <Phone size={20} className="text-primary-600" />
                  </span>
                  <CardTitle>Phone Numbers</CardTitle>
                </div>
                {loading ? <SkeletonText lines={3} /> : (
                  <ul className="space-y-3">
                    {(contact?.phones ?? ['Contact info loading...']).map((phone, i) => (
                      <li key={i}>
                        <a
                          href={`tel:${phone}`}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 transition-colors font-medium"
                        >
                          <Phone size={14} className="text-primary-400" />
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {!loading && whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-medium text-sm hover:bg-primary-100 transition-colors"
                  >
                    <MessageCircle size={18} /> Chat on WhatsApp
                  </a>
                )}
              </Card>
            </motion.div>

            {/* Bank Details */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
              <Card className="h-full">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                    <Building2 size={20} className="text-blue-600" />
                  </span>
                  <CardTitle>Bank Details</CardTitle>
                </div>
                {loading ? <SkeletonText lines={5} /> : (
                  <dl className="space-y-3 text-sm">
                    {[
                      ['Bank Name',       contact?.bankName],
                      ['Account Name',    contact?.accountName],
                      ['Account Number',  contact?.accountNumber],
                      ['IFSC Code',       contact?.ifscCode],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-start justify-between gap-4">
                        <dt className="text-gray-500 flex-shrink-0">{label}</dt>
                        <dd className="text-gray-900 font-medium text-right">{value ?? '—'}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </Card>
            </motion.div>

            {/* UPI */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="md:col-span-2">
              <Card>
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50">
                    <CreditCard size={20} className="text-purple-600" />
                  </span>
                  <CardTitle>UPI Payment</CardTitle>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {loading ? (
                    <SkeletonText lines={2} />
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">UPI ID</p>
                        <p className="text-lg font-bold text-gray-900 font-mono tracking-wide">
                          {contact?.upiId ?? 'Loading…'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Use any UPI app — GPay, PhonePe, Paytm, etc.
                        </p>
                      </div>
                      {contact?.upiQrUrl ? (
                        <img
                          src={contact.upiQrUrl}
                          alt="UPI QR Code"
                          className="w-32 h-32 rounded-xl border border-gray-200 object-contain"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-300">
                          <QrCode size={32} />
                          <span className="text-xs">QR Here</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </Container>
    </div>
  );
}
