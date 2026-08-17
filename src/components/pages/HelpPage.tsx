import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { HelpCircle, Search, ChevronDown, ChevronRight, BookOpen, Sparkles, Layers, Edit3, Star } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { t } = useAppState();
  const [searchHelp, setSearchHelp] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: t('help.faq1Q'),
      a: t('help.faq1A'),
      icon: Sparkles,
    },
    {
      q: t('help.faq2Q'),
      a: t('help.faq2A'),
      icon: Edit3,
    },
    {
      q: 'How do I save locations and datasets to My Favorites?',
      a: 'Click the star icon on any location card, map feature inspector, or dataset item. Your saved items will be synced to your registered user profile.',
      icon: Star,
    },
    {
      q: 'How do I export and print a government-compliant map report?',
      a: 'Open the Map Workspace, click the Print Map icon in the floating tool dock, select your preferred format (PDF, PNG, JPEG), and click "Generate Printable Map".',
      icon: Layers,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 sm:pt-28 pb-16 space-y-8 bg-spatial-canvas min-h-screen">
      
      {/* Banner */}
      <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border border-slate-200/80 dark:border-slate-800/80">
        <div className="w-12 h-12 rounded-2xl bg-geovision-blue text-white mx-auto flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">
          <HelpCircle className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('help.title')}
        </h1>

        <div className="relative max-w-lg mx-auto pt-2">
          <Search className="absolute left-3.5 top-5 w-4 h-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
          <input
            type="text"
            value={searchHelp}
            onChange={(e) => setSearchHelp(e.target.value)}
            placeholder={t('help.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-geovision-blue"
          />
        </div>
      </div>

      {/* Guide Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { title: 'Getting Started', icon: BookOpen },
          { title: 'GeoVision AI', icon: Sparkles },
          { title: 'Map Tools', icon: Layers },
          { title: 'Favorites & Account', icon: Star },
        ].map((cat, idx) => {
          const IconC = cat.icon;
          return (
            <div key={idx} className="glass-panel p-4 rounded-2xl text-center space-y-2 border border-slate-200/60 dark:border-slate-800/60">
              <IconC className="w-6 h-6 text-geovision-blue dark:text-blue-400 mx-auto" />
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {cat.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            const IconC = faq.icon;

            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left rtl:text-right font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <IconC className="w-4 h-4 text-geovision-blue dark:text-blue-400 shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rtl:rotate-180" />}
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
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
