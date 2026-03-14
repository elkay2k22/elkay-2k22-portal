import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { helpRequestService } from '@/services/helpRequestService';
import type { HelpRequestFormValues } from '@/types/helpRequest';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Enter a valid 10-digit phone number')
    .max(13)
    .regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number'),
  address: z.string().min(10, 'Please provide a complete address'),
  problemDescription: z.string().min(30, 'Please describe your situation in at least 30 characters'),
  amountNeeded: z
    .number({ invalid_type_error: 'Please enter a valid amount' })
    .min(1, 'Amount must be at least ₹1')
    .max(500000, 'Amount cannot exceed ₹5,00,000'),
});

export function HelpRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HelpRequestFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: HelpRequestFormValues) => {
    setServerError('');
    try {
      await helpRequestService.submit(data);
      setSubmitted(true);
      reset();
    } catch {
      setServerError('Failed to submit. Please try again or contact us directly.');
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center gap-4"
      >
        <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50">
          <CheckCircle size={36} className="text-blue-600" />
        </span>
        <h2 className="text-xl font-bold text-gray-900">Request Submitted!</h2>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          We've received your request. Our team will review it and reach out to you via phone shortly.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          Submit another request
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          placeholder="Enter your name"
          required
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Phone Number"
          placeholder="Enter your phone number"
          type="tel"
          required
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <Input
        label="Address"
        placeholder="House no., Street, City, State"
        required
        error={errors.address?.message}
        {...register('address')}
      />

      <Textarea
        label="Problem Description"
        placeholder="Describe your situation and how the funds will be used…"
        required
        rows={5}
        error={errors.problemDescription?.message}
        {...register('problemDescription')}
      />

      <Input
        label="Amount Needed (₹)"
        type="number"
        placeholder="e.g. 10000"
        required
        error={errors.amountNeeded?.message}
        {...register('amountNeeded', { valueAsNumber: true })}
      />

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{serverError}</p>
      )}

      <Button
        type="submit"
        loading={isSubmitting}
        fullWidth
        size="lg"
        leftIcon={<Send size={18} />}
      >
        Submit Request
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Your information is kept confidential and only reviewed by our admin team.
      </p>
    </motion.form>
  );
}
