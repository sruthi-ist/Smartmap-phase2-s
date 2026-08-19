import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  Star,
  MapPin,
  Layers,
  Search,
  Trash2,
  Map,
  ShieldAlert,
  Building,
} from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const {
    language,
    favorites,
    removeFavorite,
    user,
    setCurrentView,
    setMapCenterAndZoom,
    setGuestPromptOpen,
    t,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'location' | 'dataset' | 'search'>('location');

  if (user.isGuest) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6 bg-spatial-canvas min-h-screen flex flex-col justify-center">
        <div className="w-22 h-22 rounded-3xl bg-[#7DA1C4]/15 text-[#215A9E] mx-auto flex items-center justify-center font-bold shadow-2xl shadow-[#215A9E]/20 border border-[#7DA1C4]/30">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#063360] dark:text-white">
          Sign In to View My Favorites
        </h2>
        <p className="text-xs sm:text-sm text-[#545860] dark:text-slate-400 max-w-md mx-auto font-semibold leading-relaxed">
          Guest users can explore maps and datasets. Sign in or create an account to save your favorite locations, datasets, and AI queries across sessions.
        </p>
        <div>
          <button
            onClick={() => setGuestPromptOpen(true)}
            className="px-8 py-3.5 rounded-2xl bg-[#215A9E] text-white text-xs font-black hover:bg-[#063360] shadow-xl shadow-[#215A9E]/30 transition-all cursor-pointer"
          >
            Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  const filteredFavs = favorites.filter((f) => f.type === activeTab);

  const handleOpenOnMap = (fav: any) => {
    if (fav.lat && fav.lng) {
      setMapCenterAndZoom([fav.lat, fav.lng], 15);
    }
    setCurrentView('map');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-16 space-y-8 bg-spatial-canvas min-h-screen">
      
      {/* Full-Width WOW Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#041F3B] text-white shadow-2xl border border-[#7DA1C4]/30 glow-blue">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left rtl:md:text-right">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-black shadow-xl shrink-0">
              <Star className="w-8 h-8 fill-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{t('fav.title')}</h1>
              <p className="text-xs sm:text-sm font-bold text-amber-100 mt-1">
                Saved spatial locations, GIS layers, and search bookmarks for {user.name}
              </p>
            </div>
          </div>

          <div className="px-5 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-xs font-black shrink-0">
            {favorites.length} Saved Bookmarks
          </div>
        </div>
      </div>

      {/* Tabs Switcher Strip */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        {[
          { id: 'location', labelKey: 'fav.tabLocations', icon: MapPin },
          { id: 'dataset', labelKey: 'fav.tabDatasets', icon: Layers },
          { id: 'search', labelKey: 'fav.tabSearches', icon: Search },
        ].map((tab) => {
          const IconC = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isSel
                  ? 'bg-white dark:bg-slate-800 text-geovision-blue dark:text-blue-300 shadow-md scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <IconC className="w-4 h-4" />
              <span>{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* 3-Column Full Width Favorites Grid */}
      {filteredFavs.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-14 h-14 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 mx-auto flex items-center justify-center font-bold shadow-md">
            <Star className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-black text-slate-800 dark:text-slate-200">{t('fav.empty')}</h3>
          <p className="text-xs text-slate-400 font-semibold max-w-md mx-auto leading-relaxed">
            Click the star icon on any result card, map pin, or dataset layer to bookmark it here for instant access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFavs.map((fav) => (
            <div
              key={fav.id}
              className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between gap-5 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-100 to-amber-50 dark:from-amber-950/80 dark:to-slate-900 text-amber-600 flex items-center justify-center font-bold shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                  <Building className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                      {fav.categoryEn}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white truncate mt-1">
                    {language === 'ar' ? fav.nameAr : fav.nameEn}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-geovision-blue shrink-0" />
                    <span>Saved {fav.savedAt}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => removeFavorite(fav.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleOpenOnMap(fav)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Map className="w-4 h-4" />
                  <span>Open on Map</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
