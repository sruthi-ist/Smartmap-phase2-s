import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Star, MapPin, Layers, Search, Trash2, Map, ShieldAlert } from 'lucide-react';

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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-950/60 text-geovision-blue mx-auto flex items-center justify-center font-bold shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Sign In to View My Favorites
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
          Guest users can explore maps and datasets. Sign in or create an account to save your favorite locations, datasets, and AI queries across sessions.
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

  const filteredFavs = favorites.filter(f => f.type === activeTab);

  const handleOpenOnMap = (fav: any) => {
    if (fav.lat && fav.lng) {
      setMapCenterAndZoom([fav.lat, fav.lng], 15);
    }
    setCurrentView('map');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 sm:pt-28 pb-16 space-y-6 bg-spatial-canvas min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-md">
            <Star className="w-5 h-5 fill-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {t('fav.title')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Saved locations, datasets, and spatial searches for {user.name}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                isSel
                  ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <IconC className="w-4 h-4" />
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Favorites List */}
      {filteredFavs.length === 0 ? (
        <div className="glass-panel p-8 rounded-3xl text-center space-y-2">
          <p className="text-xs text-slate-400 font-bold">{t('fav.empty')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFavs.map((fav) => (
            <div
              key={fav.id}
              className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {language === 'ar' ? fav.nameAr : fav.nameEn}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    {fav.categoryEn} • Saved: {fav.savedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenOnMap(fav)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-geovision-blue text-white text-xs font-bold hover:bg-blue-600 shadow-md transition-colors"
                >
                  <Map className="w-3.5 h-3.5" />
                  Open on Map
                </button>
                <button
                  onClick={() => removeFavorite(fav.id)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
