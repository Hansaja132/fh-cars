import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@fh6-cars/shared';
import { z } from 'zod';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Shield, KeyRound, Mail, AlertCircle } from 'lucide-react';

type LoginFormValues = z.infer<typeof loginSchema>;

export const AdminLoginPage: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'password',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    try {
      const response = await apiService.loginAdmin(data.email, data.password);
      login(response.token, response.user);
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error?.message || 'Invalid email or password. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white">Admin Portal Sign In</h1>
          <p className="text-xs text-slate-400">Authenticate to manage cars, brands, and imports</p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/60 border border-red-500/40 p-3.5 rounded-xl text-xs text-red-200 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                className="w-full bg-slate-950 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-700 focus:outline-none focus:border-red-500"
                placeholder="admin@example.com"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
            {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <input
                type="password"
                {...register('password')}
                className="w-full bg-slate-950 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-700 focus:outline-none focus:border-red-500"
                placeholder="••••••••"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
            {errors.password && <p className="text-[11px] text-red-400">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-transform active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-[11px] text-slate-400 font-mono">
          Default seed credentials: <br />
          <span className="text-red-400">admin@example.com</span> / <span className="text-red-400">password</span>
        </div>
      </div>
    </div>
  );
};
