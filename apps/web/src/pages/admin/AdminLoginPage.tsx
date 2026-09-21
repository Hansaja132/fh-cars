import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from '@fh6-cars/shared';
import { z } from 'zod';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Shield, KeyRound, Mail, AlertCircle, CheckCircle2, ArrowLeft, Hash } from 'lucide-react';

type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetFormValues = z.infer<typeof resetPasswordSchema>;

export const AdminLoginPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'forgot_request' | 'forgot_verify'>('login');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [targetEmail, setTargetEmail] = useState<string>('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Login Form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Forgot Request Form
  const forgotForm = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  // Reset Password Form
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '', code: '', newPassword: '' },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);
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

  const onForgotSubmit = async (data: ForgotFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await apiService.requestForgotPassword(data.email);
      setTargetEmail(data.email);
      resetForm.setValue('email', data.email);
      setSuccessMsg(res.message);
      setMode('forgot_verify');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to request password reset code.');
    }
  };

  const onResetSubmit = async (data: ResetFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await apiService.resetPassword(data.email, data.code, data.newPassword);
      setSuccessMsg(res.message);
      loginForm.setValue('email', data.email);
      setTimeout(() => {
        setMode('login');
        setSuccessMsg('Password reset successful! Please log in with your new password.');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to verify code or reset password.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 transition-colors">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-lg space-y-6">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">
            {mode === 'login' && 'Admin Portal Sign In'}
            {mode === 'forgot_request' && 'Reset Admin Password'}
            {mode === 'forgot_verify' && 'Verify 6-Digit Code'}
          </h1>
          <p className="text-xs text-text-muted">
            {mode === 'login' && 'Authenticate to manage cars, brands, and imports'}
            {mode === 'forgot_request' && 'Enter your admin email to receive a 6-digit verification code'}
            {mode === 'forgot_verify' && `Enter the 6-digit code sent to ${targetEmail}`}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-danger/10 border border-danger/30 p-3.5 rounded-xl text-xs text-danger flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-danger shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-success/10 border border-success/30 p-3.5 rounded-xl text-xs text-success flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Admin Email</label>
              <div className="relative">
                <input
                  type="email"
                  {...loginForm.register('email')}
                  className="w-full bg-surface text-foreground placeholder:text-text-muted text-xs rounded-xl pl-9 pr-3 py-2.5 border border-border focus:outline-none focus:border-primary transition-colors"
                  placeholder="admin@example.com"
                  id="admin-login-email"
                />
                <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-[11px] text-danger">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-text-secondary">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setMode('forgot_request');
                  }}
                  className="text-xs text-primary hover:underline font-semibold"
                  id="forgot-password-link"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  {...loginForm.register('password')}
                  className="w-full bg-surface text-foreground placeholder:text-text-muted text-xs rounded-xl pl-9 pr-3 py-2.5 border border-border focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  id="admin-login-password"
                />
                <KeyRound className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-[11px] text-danger">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginForm.formState.isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs py-3 rounded-xl shadow transition-transform active:scale-98 disabled:opacity-50"
              id="admin-login-submit-btn"
            >
              {loginForm.formState.isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        )}

        {/* FORGOT STEP 1: REQUEST CODE */}
        {mode === 'forgot_request' && (
          <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Admin Email</label>
              <div className="relative">
                <input
                  type="email"
                  {...forgotForm.register('email')}
                  className="w-full bg-surface text-foreground placeholder:text-text-muted text-xs rounded-xl pl-9 pr-3 py-2.5 border border-border focus:outline-none focus:border-primary transition-colors"
                  placeholder="admin@example.com"
                  id="admin-forgot-email"
                />
                <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              </div>
              {forgotForm.formState.errors.email && (
                <p className="text-[11px] text-danger">{forgotForm.formState.errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={forgotForm.formState.isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs py-3 rounded-xl shadow transition-transform active:scale-98 disabled:opacity-50"
              id="admin-send-code-btn"
            >
              {forgotForm.formState.isSubmitting ? 'Sending Code...' : 'Send 6-Digit Code'}
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setSuccessMsg(null);
                setMode('login');
              }}
              className="w-full flex items-center justify-center space-x-1 text-xs text-text-secondary hover:text-foreground pt-2 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </form>
        )}

        {/* FORGOT STEP 2: VERIFY CODE & RESET PASSWORD */}
        {mode === 'forgot_verify' && (
          <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Target Email</label>
              <div className="relative">
                <input
                  type="email"
                  {...resetForm.register('email')}
                  readOnly
                  className="w-full bg-surface/50 text-text-muted text-xs rounded-xl pl-9 pr-3 py-2.5 border border-border cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">6-Digit Verification Code</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  {...resetForm.register('code')}
                  className="w-full bg-surface text-foreground font-mono text-center tracking-widest text-lg font-bold rounded-xl py-2 border border-border focus:outline-none focus:border-primary transition-colors"
                  placeholder="123456"
                  id="admin-reset-code"
                />
                <Hash className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              </div>
              {resetForm.formState.errors.code && (
                <p className="text-[11px] text-danger">{resetForm.formState.errors.code.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  {...resetForm.register('newPassword')}
                  className="w-full bg-surface text-foreground placeholder:text-text-muted text-xs rounded-xl pl-9 pr-3 py-2.5 border border-border focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter new password"
                  id="admin-reset-new-password"
                />
                <KeyRound className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              </div>
              {resetForm.formState.errors.newPassword && (
                <p className="text-[11px] text-danger">{resetForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={resetForm.formState.isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs py-3 rounded-xl shadow transition-transform active:scale-98 disabled:opacity-50"
              id="admin-reset-submit-btn"
            >
              {resetForm.formState.isSubmitting ? 'Verifying & Resetting...' : 'Verify Code & Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setSuccessMsg(null);
                setMode('forgot_request');
              }}
              className="w-full flex items-center justify-center space-x-1 text-xs text-text-secondary hover:text-foreground pt-2 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Resend Verification Code</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
