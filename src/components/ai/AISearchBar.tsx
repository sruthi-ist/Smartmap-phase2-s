import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  Sparkles,
  Mic,
  ArrowRight,
  Compass,
  Layers,
  MapPin,
  Flame,
  Activity,
  X,
} from 'lucide-react';
import { VoiceSearchOverlay } from './VoiceSearchOverlay';

interface AISearchBarProps {
  compact?: boolean;
}

export const AISearchBar: React.FC<AISearchBarProps> = ({ compact = false }) => {
  const { sendAIMessage, language, t } = useAppState();
  const [queryText, setQueryText] = useState('');
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'natural' | 'compare' | 'risk' | 'buffer'>('natural');
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Rotating placeholder prompts
  const placeholders = [
    t('prompt.highRiskManufacturing'),
    t('prompt.compareEmissions'),
    t('prompt.whyHighRisk'),
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

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      sendAIMessage(queryText);
      setQueryText('');
      setAutocompleteOpen(false);
    }
  };

  const handleSuggestedClick = (promptKey: string) => {
    const text = t(promptKey);
    sendAIMessage(text);
    setAutocompleteOpen(false);
  };

  const autocompleteSuggestions = [
    {
      titleEn: 'Show high-risk manufacturing facilities in Abu Dhabi',
      titleAr: 'عرض المنشآت الصناعية عالية الخطورة في أبوظبي',
      type: 'Industrial Risk',
      icon: Flame,
      color: 'text-rose-500 bg-rose-500/10',
    },
    {
      titleEn: 'Compare emissions between Mussafah and KIZAD',
      titleAr: 'مقارنة الانبعاثات بين مصفح وكيزاد',
      type: 'Comparison Matrix',
      icon: Layers,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      titleEn: 'Why is this facility high risk?',
      titleAr: 'لماذا هذه المنشأة عالية الخطورة؟',
      type: 'Risk Evaluation',
      icon: Activity,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      titleEn: 'Show hospitals within 5 km of Khalifa City',
      titleAr: 'عرض المستشفيات على بعد 5 كم من مدينة خليفة',
      type: 'Healthcare Grid',
      icon: MapPin,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      titleEn: 'Find schools within 3 km of Yas Island',
      titleAr: 'البحث عن المدارس ضمن 3 كم من جزيرة ياس',
      type: 'Education Grid',
      icon: Compass,
      color: 'text-purple-500 bg-purple-500/10',
    },
  ].filter(item => {
    if (!queryText.trim()) return true;
    const q = queryText.toLowerCase();
    return (
      item.titleEn.toLowerCase().includes(q) ||
      item.titleAr.includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  });

  const queryModes = [
    { id: 'natural', labelEn: '✨ Natural AI', labelAr: '✨ الذكاء المكاني', desc: 'Ask naturally' },
    { id: 'compare', labelEn: '⚖️ Compare Zones', labelAr: '⚖️ مقارنة المناطق', desc: 'Mussafah vs KIZAD' },
    { id: 'risk', labelEn: '⚠️ Risk & Emissions', labelAr: '⚠️ تقييم المخاطر', desc: 'Industrial EAD' },
    { id: 'buffer', labelEn: '📐 Buffer & AOI', labelAr: '📐 النطاق الجغرافي', desc: 'Distance matrix' },
  ];

  return (
    <div ref={searchContainerRef} className="w-full flex flex-col items-center gap-3 relative">
      {/* Voice Search Overlay Modal */}
      <VoiceSearchOverlay isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />

      {/* Query Mode Badges (Interactive Intent Switcher) */}
      {!compact && (
        <div className="w-full flex items-center justify-start gap-2 px-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            {queryModes.map(mode => (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setSelectedMode(mode.id as any);
                  if (mode.id === 'compare') {
                    setQueryText('Compare emissions between Mussafah and KIZAD');
                  } else if (mode.id === 'risk') {
                    setQueryText('Show high-risk manufacturing facilities in Abu Dhabi');
                  } else if (mode.id === 'buffer') {
                    setQueryText('Why is this facility high risk?');
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  selectedMode === mode.id
                    ? 'bg-[#215A9E] text-white shadow-md shadow-[#215A9E]/30 scale-102'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-[#215A9E]'
                }`}
              >
                <span>{language === 'ar' ? mode.labelAr : mode.labelEn}</span>
              </button>
            ))}
          </div>
        </div>
      )}

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

          {/* Text Input with live focus */}
          <input
            type="text"
            value={queryText}
            onChange={(e) => {
              setQueryText(e.target.value);
              setAutocompleteOpen(true);
            }}
            onFocus={() => setAutocompleteOpen(true)}
            placeholder={placeholders[placeholderIndex]}
            className="w-full bg-transparent text-[#063360] dark:text-white placeholder-[#545860] dark:placeholder-slate-400 text-sm sm:text-base font-semibold focus:outline-hidden"
          />

          {/* Clear text button if present */}
          {queryText && (
            <button
              type="button"
              onClick={() => setQueryText('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

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

      {/* Smart Live Autocomplete Suggestions Dropdown */}
      {autocompleteOpen && autocompleteSuggestions.length > 0 && (
        <div className="absolute top-[100%] left-0 right-0 mt-2 z-50 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-wider">
            <span>{language === 'ar' ? 'اقتراحات الاستعلام الذكي' : 'Spatial Intelligence Queries'}</span>
            <span className="text-[#215A9E] font-bold">{autocompleteSuggestions.length} available</span>
          </div>

          <div className="p-1.5 space-y-1 max-h-72 overflow-y-auto">
            {autocompleteSuggestions.map((sugg, idx) => {
              const IconComp = sugg.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const text = language === 'ar' ? sugg.titleAr : sugg.titleEn;
                    sendAIMessage(text);
                    setAutocompleteOpen(false);
                    setQueryText('');
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 text-left rtl:text-right transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${sugg.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover:text-[#215A9E] dark:group-hover:text-blue-400">
                        {language === 'ar' ? sugg.titleAr : sugg.titleEn}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {sugg.type}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#215A9E] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-all shrink-0 ml-2" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggested Prompt Chips */}
      {!compact && (
        <div className="w-full flex flex-wrap items-center justify-start gap-2 mt-1">
          <span className="text-xs font-black text-[#063360] dark:text-slate-200 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#215A9E]" />
            {t('hero.suggestedLabel')}
          </span>
          {[
            'prompt.highRiskManufacturing',
            'prompt.compareEmissions',
            'prompt.whyHighRisk',
            'prompt.hospitalsKhalifa',
            'prompt.schoolsYas',
            'prompt.parksAbuDhabi',
            'prompt.govReem',
          ].map((key, idx) => (
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

export default AISearchBar;
