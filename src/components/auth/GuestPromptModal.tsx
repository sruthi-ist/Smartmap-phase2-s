import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { X, UserCheck, Sparkles } from 'lucide-react';

export const GuestPromptModal: React.FC = () => {
  const { guestPromptOpen, setGuestPromptOpen, setLoginModalOpen } = useAppState();

  if (!guestPromptOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-level-3 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/10 text-center space-y-5 glow-blue-lg">
        
        <button
          onClick={() => setGuestPromptOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-14 h-14 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/30">
          <Sparkles className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Save Your GeoVision Discoveries
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            Sign in to save your spatial locations, dataset layer states, and conversation history across devices.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => {
              setGuestPromptOpen(false);
              setLoginModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all"
          >
            <UserCheck className="w-4 h-4" />
            Sign In / Register Account
          </button>

          <button
            onClick={() => setGuestPromptOpen(false)}
            className="w-full py-2.5 rounded-xl border border-white/70 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors glass-level-1"
          >
            Continue as Guest
          </button>
        </div>

      </div>
    </div>
  );
};
