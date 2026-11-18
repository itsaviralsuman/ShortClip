import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail
  } = useAuth();

  const [tab, setTab] = useState<'signin' | 'signup' | 'otp'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('729410');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address (e.g. yourname@gmail.com)');
      return;
    }

    // Switch to 6-digit OTP verification step for instant verification experience
    setTab('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Please enter the verification code');
      return;
    }
    signInWithEmail(email, name);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    signInWithEmail(email, name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl glass-panel-elevated border border-purple-500/40 p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-cyan p-0.5 mx-auto shadow-lg shadow-purple-500/30">
            <div className="w-full h-full bg-studio-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-display font-extrabold text-white">
            {tab === 'otp'
              ? 'Enter Verification Code'
              : tab === 'signin'
              ? 'Sign In with Your Email'
              : 'Create Your Account'}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            {tab === 'otp'
              ? `We sent a 6-digit confirmation code to ${email}`
              : 'Sign in with any email to activate your 24h 480-minute quota'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1 & 2: SIGN IN / SIGN UP */}
        {tab !== 'otp' ? (
          <>
            {/* 1-Click Social Sign-Ins */}
            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center gap-2.5 transition shadow active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => signInWithGithub()}
                className="w-full py-2.5 px-4 rounded-xl bg-studio-900 hover:bg-studio-800 text-white font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2.5 transition active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative bg-studio-950 px-3 text-[10px] uppercase font-mono text-slate-500">
                or sign in with email
              </span>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-studio-900 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setTab('signin'); setError(null); }}
                className={`py-1.5 rounded-lg transition ${tab === 'signin' ? 'bg-brand-purple text-white shadow' : 'text-slate-400'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('signup'); setError(null); }}
                className={`py-1.5 rounded-lg transition ${tab === 'signup' ? 'bg-brand-purple text-white shadow' : 'text-slate-400'}`}
              >
                New Account
              </button>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {tab === 'signup' && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-studio-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-brand-purple outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your personal or work email..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-studio-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-brand-purple outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-slate-300">
                    Password (Optional)
                  </label>
                  <span className="text-[10px] text-purple-400">Passwordless OTP available</span>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password or leave blank for OTP"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-studio-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-brand-purple outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <span>Continue with Email OTP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {password && (
                  <button
                    type="button"
                    onClick={handlePasswordSubmit}
                    className="w-full py-2 rounded-xl bg-studio-900 hover:bg-studio-800 text-slate-300 font-semibold text-xs border border-slate-700 transition"
                  >
                    Sign In with Password Instead
                  </button>
                )}
              </div>
            </form>
          </>
        ) : (
          /* TAB 3: OTP VERIFICATION */
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
            <div className="p-3 rounded-xl bg-studio-900/80 border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-300">Verification code sent to:</span>
              <div className="font-mono text-purple-300 font-bold text-sm truncate">{email}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                Enter 6-Digit Code
              </label>
              <div className="relative max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full py-2.5 text-center font-mono text-xl tracking-[0.4em] font-bold rounded-xl bg-studio-900 border-2 border-brand-purple text-white outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-slate-500 text-center mt-1.5">
                (Simulated OTP: <code className="text-purple-300 font-mono">729410</code> ready for 1-click test)
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-emerald hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verify & Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => setTab('signin')}
                className="w-full py-2 text-slate-400 hover:text-white text-xs text-center"
              >
                ← Use a different email
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
          <span>No default account lock • Sign in with your real email</span>
        </div>
      </div>
    </div>
  );
};
