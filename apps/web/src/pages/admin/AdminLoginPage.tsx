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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 transition-colors">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Admin Portal Sign In</h1>
          <p className="text-xs text-text-muted">Authenticate to manage cars, brands, and imports</p>
        </div>

        {errorMsg && (
          <div className="bg-danger/10 border border-danger/30 p-3.5 rounded-xl text-xs text-danger flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-danger shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                className="w-full bg-surface text-foreground placeholder:text-text-muted text-xs rounded-xl pl-9 pr-3 py-2.5 border border-border focus:outline-none focus:border-primary transition-colors"
                placeholder="admin@example.com"
              />
              <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3" />
            </div>
            {errors.email && <p className="text-[11px] text-danger">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Password</label>
            <div className="relative">
              <input
                type="password"
                {...register('password')}
                className="w-full bg-surface text-foreground placeholder:text-text-muted text-xs rounded-xl pl-9 pr-3 py-2.5 border border-border focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
              <KeyRound className="w-4 h-4 text-text-muted absolute left-3 top-3" />
            </div>
            {errors.password && <p className="text-[11px] text-danger">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs py-3 rounded-xl shadow transition-transform active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="p-3 bg-surface rounded-xl border border-border text-center text-[11px] text-text-muted font-mono">
          Default seed credentials: <br />
          <span className="text-primary font-bold">admin@example.com</span> / <span className="text-primary font-bold">password</span>
        </div>
      </div>
    </div>
  );
};
