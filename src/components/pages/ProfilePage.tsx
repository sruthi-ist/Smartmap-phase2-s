import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Globe, Moon, Sun, Star, History, LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { language, setLanguage, theme, setTheme, user, setUser, setCurrentView, favorites } = useAppState();

  const handleLogout = () => {
    setUser({
      id: 'guest-1',
      username: 'guest',
      email: '',
      name: 'Guest User',
      isGuest: true,
    });
    setCurrentView('home');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-24 sm:pt-28 pb-16 space-y-6 bg-spatial-canvas min-h-screen">
      
      {/* Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200/80 dark:border-slate-800/80 shadow-lg glow-blue">
        
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800 text-center sm:text-left rtl:sm:text-right">
          <div className="w-20 h-20 rounded-3xl bg-geovision-blue text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-blue-500/30">
            {user.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start rtl:sm:justify-end gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-geovision-blue dark:bg-blue-950/80 dark:text-blue-300">
                {user.isGuest ? 'Guest User' : 'Registered Citizen'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {user.email || 'guest.session@dge.gov.ae'}
            </p>
          </div>
        </div>

        {/* User Preferences Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            User Preferences & Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Language Preference */}
            <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-geovision-blue" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Preferred Language</p>
                  <p className="text-[11px] text-slate-400 font-semibold">{language === 'en' ? 'English (LTR)' : 'العربية (RTL)'}</p>
                </div>
              </div>

              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-white dark:hover:bg-slate-800"
              >
                Toggle
              </button>
            </div>

            {/* Theme Preference */}
            <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-amber-400" />}
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Appearance Theme</p>
                  <p className="text-[11px] text-slate-400 font-semibold">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</p>
                </div>
              </div>

              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-white dark:hover:bg-slate-800"
              >
                Switch
              </button>
            </div>

          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setCurrentView('favorites')}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200/60"
          >
            <Star className="w-4 h-4 fill-amber-400" />
            My Favorites ({favorites.length})
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-geovision-blue dark:text-blue-300 text-xs font-bold border border-blue-200/60"
          >
            <History className="w-4 h-4 text-geovision-blue" />
            Conversation History
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300 text-xs font-bold border border-red-200/60"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

      </div>

    </div>
  );
};
