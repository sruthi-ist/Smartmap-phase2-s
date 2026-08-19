import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Sparkles,
  Layers,
  Edit3,
  Star,
  MessageSquare,
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { t, setCurrentView } = useAppState();
  const [searchHelp, setSearchHelp] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: t('help.faq1Q'),
      a: t('help.faq1A'),
      icon: Sparkles,
      tag: 'GeoVision AI',
    },
    {
      q: t('help.faq2Q'),
      a: t('help.faq2A'),
      icon: Edit3,
      tag: 'Spatial AOI Tools',
    },
    {
      q: 'How do I save locations and datasets to My Favorites?',
      a: 'Click the star icon on any location card, map feature inspector, or dataset item. Your saved items will be synced to your registered user profile.',
      icon: Star,
      tag: 'Bookmarks',
    },
    {
      q: 'How do I export and print a government-compliant map report?',
      a: 'Open the Map Workspace, click the Print Map icon in the floating tool dock, select your preferred format (PDF, PNG, JPEG), and click "Generate Printable Map".',
      icon: Layers,
      tag: 'Printing',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchHelp.toLowerCase()) ||
      f.a.toLowerCase().includes(searchHelp.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-8 bg-spatial-canvas min-h-screen">
      
      {/* WOW Full-Width Hero Search Banner */}
      <div className="relative overflow-hidden p-6 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white text-center space-y-6 shadow-2xl border border-blue-900/60 glow-blue">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-geovision-blue/20 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-geovision-blue to-cyan-400 text-white mx-auto flex items-center justify-center font-black shadow-xl shadow-blue-500/40">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">{t('help.title')}</h1>
          <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-semibold max-w-xl mx-auto">
            Find answers, guides, and step-by-step tutorials for navigating GeoVision AI spatial copilot.
          </p>

          <div className="relative max-w-xl mx-auto pt-3">
            <Search className="absolute left-4.5 top-6.5 w-5 h-5 text-slate-400 rtl:right-4.5 rtl:left-auto" />
            <input
              type="text"
              value={searchHelp}
              onChange={(e) => setSearchHelp(e.target.value)}
              placeholder={t('help.searchPlaceholder')}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-geovision-blue shadow-xl rtl:pr-12 rtl:pl-4 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Guide Quick Cards (4-Column Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: 'Getting Started', icon: BookOpen, action: () => setCurrentView('map') },
          { title: 'GeoVision AI', icon: Sparkles, action: () => setCurrentView('map') },
          { title: 'Map Tools', icon: Layers, action: () => setCurrentView('map') },
          { title: 'Favorites & Account', icon: Star, action: () => setCurrentView('profile') },
        ].map((cat, idx) => {
          const IconC = cat.icon;
          return (
            <button
              key={idx}
              onClick={cat.action}
              className="glass-panel p-6 rounded-3xl text-center space-y-3 border border-slate-200/80 dark:border-slate-800/80 hover:border-geovision-blue transition-all cursor-pointer group shadow-xs hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 text-geovision-blue dark:text-blue-400 mx-auto flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs">
                <IconC className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white block truncate">
                {cat.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-geovision-blue" />
            <span>Frequently Asked Questions</span>
          </h2>
          <span className="text-xs text-slate-400 font-bold">{filteredFaqs.length} FAQs</span>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            const IconC = faq.icon;

            return (
              <div
                key={idx}
                className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left rtl:text-right font-black text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer gap-4"
                >
                  <span className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-800 text-geovision-blue flex items-center justify-center font-bold shrink-0">
                      <IconC className="w-4 h-4" />
                    </div>
                    <span className="truncate">{faq.q}</span>
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 hidden sm:inline">
                      {faq.tag}
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-5 h-5 text-geovision-blue" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400 rtl:rotate-180" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-5 sm:p-6 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
