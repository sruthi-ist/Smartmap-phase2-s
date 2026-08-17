import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { History, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { language, user, setCurrentView, sendAIMessage, setGuestPromptOpen, t } = useAppState();

  if (user.isGuest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-950/60 text-geovision-blue mx-auto flex items-center justify-center font-bold shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Keep your GeoVision conversations
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
          Sign in to save your spatial queries, conversation sessions, and continue them later across browser sessions.
        </p>
        <button
          onClick={() => setGuestPromptOpen(true)}
          className="px-6 py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const sessions = [
    {
      id: 'sess-1',
      titleEn: 'Healthcare facilities around Khalifa City',
      titleAr: 'المستشفيات والخدمات الصحية حول مدينة خليفة',
      time: 'Today • 11:42 AM',
      queries: 4,
      queryText: 'Show hospitals within 5 km of Khalifa City',
    },
    {
      id: 'sess-2',
      titleEn: 'Schools and Universities near Yas Island',
      titleAr: 'المدارس والجامعات بالقرب من جزيرة ياس',
      time: 'Today • 09:18 AM',
      queries: 2,
      queryText: 'Find schools within 3 km of Yas Island',
    },
    {
      id: 'sess-3',
      titleEn: 'Public parks and recreation in Al Ain',
      titleAr: 'الحدائق العامة والخدمات في العين',
      time: 'Yesterday • 04:30 PM',
      queries: 3,
      queryText: 'Show public parks in Al Ain',
    },
  ];

  const handleContinueSession = (queryText: string) => {
    sendAIMessage(queryText);
    setCurrentView('map');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 sm:pt-28 pb-16 space-y-6 bg-spatial-canvas min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-black shadow-md shadow-blue-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {t('history.title')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Persistent spatial conversation sessions for {user.name}
            </p>
          </div>
        </div>
      </div>

      {/* Session Cards */}
      <div className="space-y-3">
        {sessions.map((sess) => (
          <div
            key={sess.id}
            className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-4 hover:border-geovision-blue dark:hover:border-geovision-blue transition-all cursor-pointer shadow-sm hover:shadow-md"
            onClick={() => handleContinueSession(sess.queryText)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-geovision-blue flex items-center justify-center font-bold shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {language === 'ar' ? sess.titleAr : sess.titleEn}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {sess.time} • {sess.queries} AI interactions
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleContinueSession(sess.queryText);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-geovision-blue text-white text-xs font-bold hover:bg-blue-600 shadow-md transition-colors shrink-0"
            >
              <span>Continue Session</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
