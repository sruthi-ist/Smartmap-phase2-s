import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { AIMessageSearchResults } from './AIMessageSearchResults';
import {
  Sparkles,
  Send,
  RefreshCw,
  History,
  ShieldCheck,
  ChevronRight,
  User,
  Bot,
  Map,
} from 'lucide-react';

export const GeoVisionPanel: React.FC = () => {
  const {
    language,
    aiMessages,
    sendAIMessage,
    aiProcessing,
    aiStepState,
    setSelectedFeature,
    user,
    setCurrentView,
    setGuestPromptOpen,
    t,
  } = useAppState();

  const [inputVal, setInputVal] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      sendAIMessage(inputVal);
      setInputVal('');
    }
  };

  const handleHistoryClick = () => {
    if (user.isGuest) {
      setGuestPromptOpen(true);
    } else {
      setCurrentView('history');
    }
  };

  return (
    <div className="w-full h-full flex flex-col glass-panel border-l border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 overflow-hidden shadow-2xl">
      
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              {t('ai.panelTitle')}
            </h2>
            <span className="text-[10px] font-bold text-geovision-blue uppercase tracking-wider">
              Spatial Intelligence Copilot
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleHistoryClick}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title={t('nav.history')}
          >
            <History className="w-4 h-4 text-geovision-blue" />
          </button>
          <button
            onClick={() => sendAIMessage('Show hospitals near Khalifa City')}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title={t('ai.newChat')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {aiMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender Badge */}
            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-slate-400">
              {msg.sender === 'user' ? (
                <>
                  <span>You</span>
                  <User className="w-3 h-3" />
                </>
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5 text-geovision-blue" />
                  <span className="text-geovision-blue font-extrabold">GeoVision AI</span>
                </>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[92%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-geovision-blue text-white font-bold rounded-tr-xs shadow-blue-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <p>{language === 'ar' ? msg.textAr : msg.textEn}</p>

              {/* Map Updated Status Badge */}
              {msg.sender === 'ai' && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 text-[11px] font-bold text-geovision-blue dark:text-blue-300">
                  <Map className="w-3.5 h-3.5" />
                  <span>Map & active layers updated automatically</span>
                </div>
              )}

              {/* Data Trust Indicator */}
              {msg.sender === 'ai' && msg.trustLevel && (
                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {msg.trustLevel === 'authoritative'
                      ? t('map.authoritativeBadge')
                      : t('map.externalBadge')}
                  </span>
                </div>
              )}

              {/* Applied Filter Chips */}
              {msg.appliedFilters && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block w-full mb-0.5">
                    {t('ai.interpretationLine')}
                  </span>
                  {msg.appliedFilters.categories?.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-geovision-blue dark:bg-blue-950/80 dark:text-blue-300"
                    >
                      {cat}
                    </span>
                  ))}
                  {msg.appliedFilters.locationName && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                      📍 {msg.appliedFilters.locationName}
                    </span>
                  )}
                  {msg.appliedFilters.distanceKm && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
                      📏 {msg.appliedFilters.distanceKm} km
                    </span>
                  )}
                </div>
              )}

              {/* Matched Feature Cards Preview with Layer & Type Filters */}
              {msg.matchedFeatures && msg.matchedFeatures.length > 0 && (
                <AIMessageSearchResults
                  features={msg.matchedFeatures}
                  setSelectedFeature={setSelectedFeature}
                  language={language}
                />
              )}

              {/* AI Recommendation Prompt Chips */}
              {msg.sender === 'ai' && (msg.recommendationsEn || msg.recommendationsAr) && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                    {t('ai.recommendationsTitle')}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {(language === 'ar'
                      ? msg.recommendationsAr
                      : msg.recommendationsEn
                    )?.map((rec, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendAIMessage(rec)}
                        className="w-full text-left rtl:text-right px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50/80 dark:bg-slate-900/80 text-geovision-blue dark:text-blue-300 hover:bg-geovision-blue hover:text-white dark:hover:bg-geovision-blue border border-blue-200/60 dark:border-slate-700 transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <span>{rec}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-geovision-blue group-hover:text-white rtl:rotate-180" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ))}

        {/* AI Processing Intermediate Feedback Loader */}
        {aiProcessing && (
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800/90 border border-blue-200/60 dark:border-slate-700/60 space-y-2.5 animate-pulse glow-blue">
            <div className="flex items-center gap-2.5 text-xs font-black text-geovision-blue">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{aiStepState || t('ai.understanding')}</span>
            </div>
            <div className="w-full bg-blue-200/60 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-geovision-blue h-full w-3/4 animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive AI Input Footer */}
      <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t('ai.inputPlaceholder')}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-geovision-blue"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-3 rounded-2xl bg-geovision-blue text-white disabled:opacity-40 hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all shrink-0"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>
      </div>

    </div>
  );
};
