import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  Globe,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  Star,
  History,
  MessageSquare,
  HelpCircle,
  Info,
  Map,
  Home,
  ChevronDown,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    currentView,
    setCurrentView,
    user,
    setUser,
    setLoginModalOpen,
    setFeedbackModalOpen,
    setGuestPromptOpen,
    t,
  } = useAppState();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    setUser({
      id: 'guest-1',
      username: 'guest',
      email: '',
      name: 'Guest User',
      isGuest: true,
    });
    setUserDropdownOpen(false);
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[500] w-[calc(100%-2rem)] max-w-7xl">
      <header className="w-full h-[60px] sm:h-[62px] glass-level-2 rounded-2xl px-3.5 sm:px-5 flex items-center justify-between shadow-xl border border-white/80 dark:border-white/10">
        
        {/* Left: Product Logo & Branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-geovision-blue text-white font-black shadow-md shadow-blue-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                GeoVision
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/80 text-geovision-blue dark:bg-blue-950/80 dark:text-blue-300">
                <ShieldCheck className="w-3 h-3" /> DGE Abu Dhabi
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">
              Spatial Intelligence
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 glass-level-1 p-1 rounded-xl">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentView === 'home'
                ? 'bg-geovision-blue/10 text-geovision-blue font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            {t('nav.home')}
          </button>

          <button
            onClick={() => setCurrentView('map')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentView === 'map'
                ? 'bg-geovision-blue/10 text-geovision-blue font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            {t('nav.exploreMap')}
          </button>

          <button
            onClick={() => setCurrentView('about')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentView === 'about'
                ? 'bg-geovision-blue/10 text-geovision-blue font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            {t('nav.about')}
          </button>

          <button
            onClick={() => setCurrentView('help')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentView === 'help'
                ? 'bg-geovision-blue/10 text-geovision-blue font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {t('nav.help')}
          </button>
        </nav>

        {/* Right: Controls & Profile */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-white/60 dark:border-slate-700 hover:border-geovision-blue hover:text-geovision-blue transition-all glass-level-1"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-geovision-blue" />
            {t('nav.language')}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors glass-level-1"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Feedback Button */}
          <button
            onClick={() => setFeedbackModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors glass-level-1"
          >
            <MessageSquare className="w-3.5 h-3.5 text-geovision-blue" />
            {t('nav.feedback')}
          </button>

          {/* User Account / Guest Controls */}
          {user.isGuest ? (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-geovision-blue text-white hover:bg-blue-600 shadow-md shadow-blue-500/25 transition-all"
            >
              <UserIcon className="w-3.5 h-3.5" />
              {t('nav.signIn')}
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/60 dark:border-slate-700 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors glass-level-1"
              >
                <div className="w-7 h-7 rounded-full bg-geovision-blue text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 glass-level-3 rounded-2xl shadow-2xl border border-white/70 dark:border-slate-800 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email || 'user@dge.gov.ae'}</p>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    {t('nav.profile')}
                  </button>

                  <button
                    onClick={() => {
                      if (user.isGuest) {
                        setGuestPromptOpen(true);
                      } else {
                        setCurrentView('favorites');
                      }
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Star className="w-4 h-4 text-amber-500" />
                    {t('nav.favorites')}
                  </button>

                  <button
                    onClick={() => {
                      if (user.isGuest) {
                        setGuestPromptOpen(true);
                      } else {
                        setCurrentView('history');
                      }
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <History className="w-4 h-4 text-geovision-blue" />
                    {t('nav.history')}
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </header>
    </div>
  );
};
