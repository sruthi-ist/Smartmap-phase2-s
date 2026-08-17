import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { ShieldCheck, X, Eye, EyeOff, Lock, Mail, User, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, setUser, showToast } = useAppState();
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  if (!loginModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: 'user-registered-1',
      username: username || 'ahmed_almansoori',
      email: email || 'ahmed.almansoori@dge.gov.ae',
      name: username || 'Ahmed Al Mansoori',
      isGuest: false,
    });
    setLoginModalOpen(false);
    showToast('Signed in successfully as Ahmed Al Mansoori');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: `user-${Date.now()}`,
      username: username || 'new_citizen',
      email: email || 'citizen@dge.gov.ae',
      name: username || 'Registered Citizen',
      isGuest: false,
    });
    setLoginModalOpen(false);
    showToast('Account created! Welcome to GeoVision');
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Password reset link sent to your email');
    setTab('signin');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-level-3 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/10 space-y-6 glow-blue-lg">
        
        {/* Close Button */}
        <button
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {tab === 'signin' && 'Sign In to GeoVision'}
            {tab === 'signup' && 'Create Citizen Account'}
            {tab === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Department of Government Enablement — Abu Dhabi
          </p>
        </div>

        {/* UAE PASS Quick Login Option */}
        {tab === 'signin' && (
          <button
            onClick={handleSignIn}
            className="w-full py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-black hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Sign in with UAE PASS</span>
          </button>
        )}

        {tab === 'signin' && (
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white/80 dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute">
              Or use account
            </span>
          </div>
        )}

        {/* Tab Selector */}
        {tab !== 'forgot' && (
          <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl glass-level-1 text-xs font-extrabold">
            <button
              onClick={() => setTab('signin')}
              className={`py-2 rounded-xl transition-all ${
                tab === 'signin'
                  ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`py-2 rounded-xl transition-all ${
                tab === 'signup'
                  ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmed.almansoori@dge.gov.ae"
                  className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 rounded-xl border border-white/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="font-bold text-geovision-blue hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rtl:pr-10 rtl:pl-10 rounded-xl border border-white/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 rtl:left-3.5 rtl:right-auto"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all"
            >
              Sign In to Platform
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ahmed Al Mansoori"
                  className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 rounded-xl border border-white/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 rounded-xl border border-white/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-white/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all"
            >
              Create Account
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Registered Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmed.almansoori@dge.gov.ae"
                className="w-full px-4 py-2.5 rounded-xl border border-white/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl transition-all"
            >
              Send Reset Instructions
            </button>
            <button
              type="button"
              onClick={() => setTab('signin')}
              className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* Guest Action */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 text-center">
          <button
            onClick={() => setLoginModalOpen(false)}
            className="text-xs font-bold text-slate-500 hover:text-geovision-blue transition-colors"
          >
            Continue exploring as Guest →
          </button>
        </div>

      </div>
    </div>
  );
};
