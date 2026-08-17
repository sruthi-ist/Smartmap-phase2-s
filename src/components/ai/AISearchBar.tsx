import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Sparkles, Mic, ArrowRight, Compass } from 'lucide-react';
import { VoiceSearchOverlay } from './VoiceSearchOverlay';

interface AISearchBarProps {
  compact?: boolean;
}

export const AISearchBar: React.FC<AISearchBarProps> = ({ compact = false }) => {
  const { sendAIMessage, t } = useAppState();
  const [queryText, setQueryText] = useState('');
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Rotating placeholder prompts
  const placeholders = [
    t('prompt.hospitalsKhalifa'),
    t('prompt.schoolsYas'),
    t('prompt.parksAbuDhabi'),
    t('prompt.govReem'),
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      sendAIMessage(queryText);
      setQueryText('');
    }
  };

  const handleSuggestedClick = (promptKey: string) => {
    const text = t(promptKey);
    sendAIMessage(text);
  };

  const suggestedKeys = [
    'prompt.hospitalsKhalifa',
    'prompt.schoolsYas',
    'prompt.parksAbuDhabi',
    'prompt.govReem',
    'prompt.healthcareCompare',
  ];

  return (
    <div className="w-full flex flex-col items-center gap-3.5">
      {/* Voice Search Overlay Modal */}
      <VoiceSearchOverlay isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />

      {/* Main 72px Floating AI Command Bar */}
      <form
        onSubmit={handleSubmit}
        className={`relative w-full glass-panel rounded-3xl shadow-xl border transition-all duration-200 focus-within:ring-2 focus-within:ring-geovision-blue focus-within:border-geovision-blue glow-blue ${
          compact ? 'p-2' : 'p-3 sm:p-3.5 min-h-[68px] sm:min-h-[72px]'
        }`}
      >
        <div className="flex items-center gap-3 px-2 h-full">
          
          {/* Animated GeoVision AI Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-geovision-blue text-white shadow-md shadow-blue-500/30 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={placeholders[placeholderIndex]}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base font-semibold focus:outline-hidden"
          />

          {/* Microphone Voice Button */}
          <button
            type="button"
            onClick={() => setVoiceOpen(true)}
            className="p-2.5 text-slate-400 hover:text-geovision-blue dark:hover:text-blue-400 rounded-2xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-all shrink-0"
            title="Voice Search"
          >
            <Mic className="w-5 h-5 text-geovision-blue" />
          </button>

          {/* Submit Arrow Button */}
          <button
            type="submit"
            disabled={!queryText.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-geovision-blue text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all shrink-0"
          >
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </form>

      {/* Suggested Prompt Chips */}
      {!compact && (
        <div className="w-full flex flex-wrap items-center justify-center gap-2 mt-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-geovision-blue" />
            {t('hero.suggestedLabel')}
          </span>
          {suggestedKeys.map((key, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestedClick(key)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50/80 dark:bg-slate-800/90 text-geovision-blue dark:text-blue-300 border border-blue-200/60 dark:border-slate-700 hover:border-geovision-blue hover:bg-geovision-blue hover:text-white dark:hover:bg-geovision-blue dark:hover:text-white shadow-2xs transition-all transform hover:-translate-y-0.5"
            >
              {t(key)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
