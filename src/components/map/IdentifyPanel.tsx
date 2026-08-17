import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Building, MapPin, Phone, Globe, Star, ShieldCheck, Sparkles, X } from 'lucide-react';

export const IdentifyPanel: React.FC = () => {
  const {
    language,
    selectedFeature,
    setSelectedFeature,
    sendAIMessage,
    addFavorite,
    isFavorite,
    t,
  } = useAppState();

  if (!selectedFeature) return null;

  const isFav = isFavorite(selectedFeature.nameEn);

  const handleAskAI = () => {
    const featName = language === 'ar' ? selectedFeature.nameAr : selectedFeature.nameEn;
    sendAIMessage(`Tell me more about ${featName} and its surrounding spatial services.`);
  };

  const handleSaveFav = () => {
    addFavorite({
      type: 'location',
      nameEn: selectedFeature.nameEn,
      nameAr: selectedFeature.nameAr,
      categoryEn: selectedFeature.category,
      categoryAr: selectedFeature.category,
      lat: selectedFeature.lat,
      lng: selectedFeature.lng,
    });
  };

  return (
    <div className="absolute top-20 left-4 rtl:left-auto rtl:right-4 z-[600] w-80 sm:w-96 glass-panel rounded-3xl p-5 shadow-2xl border border-white/80 dark:border-slate-800 animate-slide-in glow-blue">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/30 shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
              {language === 'ar' ? selectedFeature.nameAr : selectedFeature.nameEn}
            </h3>
            <span className="text-[11px] font-bold text-geovision-blue uppercase tracking-wider">
              {selectedFeature.category} • {selectedFeature.subcategory}
            </span>
          </div>
        </div>

        <button
          onClick={() => setSelectedFeature(null)}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Details List */}
      <div className="py-3 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
        
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-geovision-blue shrink-0 mt-0.5" />
          <span className="font-semibold">{language === 'ar' ? selectedFeature.addressAr : selectedFeature.addressEn}</span>
        </div>

        {selectedFeature.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <a href={`tel:${selectedFeature.phone}`} className="text-geovision-blue font-bold hover:underline">
              {selectedFeature.phone}
            </a>
          </div>
        )}

        {selectedFeature.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <a
              href={selectedFeature.website}
              target="_blank"
              rel="noreferrer"
              className="text-geovision-blue font-bold hover:underline truncate"
            >
              {selectedFeature.website}
            </a>
          </div>
        )}

        {/* Dynamic Metadata Attributes */}
        {selectedFeature.metadata && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5 bg-blue-50/50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 p-3 rounded-2xl">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Authoritative GIS Attributes:
            </span>
            {Object.entries(selectedFeature.metadata).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-500 dark:text-slate-300">{key}:</span>
                <span className="font-black text-slate-900 dark:text-white">{String(val)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Authoritative Badge */}
        {selectedFeature.isAuthoritative && (
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 pt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('map.authoritativeBadge')}</span>
          </div>
        )}
      </div>

      {/* Action CTAs */}
      <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleAskAI}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {t('identify.askAI')}
        </button>

        <button
          onClick={handleSaveFav}
          className={`p-2.5 rounded-2xl border transition-colors ${
            isFav
              ? 'border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300'
              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={t('identify.saveFav')}
        >
          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
        </button>
      </div>

    </div>
  );
};
