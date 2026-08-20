import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { MapPin, X, Lock } from 'lucide-react';

export const LocationPermissionPopup: React.FC = () => {
  const { aiMessages, sendAIMessage, language } = useAppState();

  const lastMessage = aiMessages[aiMessages.length - 1];
  const isPermissionRequired = Boolean(
    lastMessage && lastMessage.sender === 'ai' && lastMessage.locationPromptRequired
  );

  if (!isPermissionRequired) return null;

  return (
    <div className="fixed top-2 left-4 sm:left-24 z-[9999] animate-fade-in">
      <div className="w-80 sm:w-96 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-blue-200/90 dark:border-slate-800 shadow-2xl shadow-blue-900/20 ring-1 ring-slate-900/5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <MapPin className="w-5 h-5 animate-pulse text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>localhost:5173</span>
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                {language === 'ar' ? 'localhost:5173 يريد لمعرفة موقعك' : 'localhost:5173 wants to know your location'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">
                {language === 'ar'
                  ? 'يرجى تفعيل الإذن لعرض مراكز الفحص والمرافق القريبة منك.'
                  : 'GeoVision needs your location permission to search for nearby facilities accurately.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => sendAIMessage('location permission denied')}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => sendAIMessage('location permission denied')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            {language === 'ar' ? 'حظر / عدم التفعيل' : "Block / Don't Enable"}
          </button>

          <button
            type="button"
            onClick={() => sendAIMessage('enable location')}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/25 flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'السماح / تفعيل' : 'Allow / Enable'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
