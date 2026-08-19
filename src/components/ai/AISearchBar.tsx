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
        className={`relative w-full glass-panel rounded-3xl shadow-xl border transition-all duration-200 focus-within:ring-2 focus-within:ring-[#215A9E] focus-within:border-[#215A9E] glow-blue ${
          compact ? 'p-2' : 'p-3 sm:p-3.5 min-h-[68px] sm:min-h-[72px]'
        }`}
      >
        <div className="flex items-center gap-3 px-2 h-full">
          
          {/* Animated GeoVision AI Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#215A9E] text-white shadow-md shadow-[#215A9E]/30 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={placeholders[placeholderIndex]}
            className="w-full bg-transparent text-[#063360] dark:text-white placeholder-[#545860] dark:placeholder-slate-400 text-sm sm:text-base font-semibold focus:outline-hidden"
          />

          {/* Microphone Voice Button */}
          <button
            type="button"
            onClick={() => setVoiceOpen(true)}
            className="p-2.5 text-[#545860] hover:text-[#215A9E] dark:hover:text-[#7DA1C4] rounded-2xl hover:bg-[#7DA1C4]/15 dark:hover:bg-slate-800 transition-all shrink-0 cursor-pointer"
            title="Voice Search"
          >
            <Mic className="w-5 h-5 text-[#215A9E]" />
          </button>

          {/* Submit Arrow Button */}
          <button
            type="submit"
            disabled={!queryText.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#215A9E] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#063360] shadow-lg shadow-[#215A9E]/30 transition-all shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </form>

      {/* Suggested Prompt Chips */}
      {!compact && (
        <div className="w-full flex flex-wrap items-center justify-start gap-2 mt-1">
          <span className="text-xs font-black text-[#063360] dark:text-slate-200 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#215A9E]" />
            {t('hero.suggestedLabel')}
          </span>
          {suggestedKeys.map((key, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestedClick(key)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7DA1C4]/10 dark:bg-slate-900/90 text-[#063360] dark:text-[#7DA1C4] border border-[#7DA1C4]/30 dark:border-slate-700 hover:border-[#215A9E] hover:bg-[#215A9E] hover:text-white dark:hover:bg-[#215A9E] dark:hover:text-white shadow-2xs transition-all transform hover:-translate-y-0.5 backdrop-blur-md cursor-pointer"
            >
              {t(key)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
