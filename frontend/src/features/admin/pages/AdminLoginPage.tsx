import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Leaf, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { settingsService } from '@/services/settingsService';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ username, password }: FormValues) => {
    setServerError('');
    try {
      const { access_token } = await settingsService.adminLogin(username, password);
      login(access_token);
      navigate('/admin', { replace: true });
    } catch {
      setServerError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 text-white mb-3 shadow-soft">
            <Leaf size={26} />
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Elkay 2K22 Batch — Management Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Username"
              placeholder="admin"
              autoComplete="username"
              error={errors.username?.message}
              {...register('username')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {serverError && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{serverError}</p>
            )}

            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth
              size="lg"
              leftIcon={<LogIn size={18} />}
            >
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
