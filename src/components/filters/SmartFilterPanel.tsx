import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CATEGORIES, ABU_DHABI_LOCATIONS } from '../../data/mockAbuDhabiData';
import { Filter, X, RotateCcw, Sparkles } from 'lucide-react';

export const SmartFilterPanel: React.FC = () => {
  const {
    language,
    smartFilters,
    updateSmartFilter,
    clearSmartFilters,
    setMapCenterAndZoom,
    t,
  } = useAppState();

  const handleLocationSelect = (locName: string) => {
    const found = ABU_DHABI_LOCATIONS.find(
      l => l.nameEn.toLowerCase() === locName.toLowerCase() || l.nameAr === locName
    );
    if (found) {
      setMapCenterAndZoom([found.lat, found.lng], found.zoom);
      updateSmartFilter({ locationName: found.nameEn });
    }
  };

  const removeCategoryChip = (catId: string) => {
    const updated = smartFilters.categories.filter(c => c !== catId);
    updateSmartFilter({ categories: updated });
  };

  const removeLocationChip = () => {
    updateSmartFilter({ locationName: '' });
  };

  const removeDistanceChip = () => {
    updateSmartFilter({ distanceKm: null });
  };

  const activeCount =
    smartFilters.categories.length +
    (smartFilters.locationName ? 1 : 0) +
    (smartFilters.distanceKm ? 1 : 0);

  return (
    <div className="w-full glass-panel p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-lg bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-geovision-blue text-white flex items-center justify-center font-bold">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {t('filters.title')}
            </h3>
            <span className="text-[10px] font-bold text-geovision-blue flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Suggested by GeoVision AI
            </span>
          </div>
        </div>

        <button
          onClick={clearSmartFilters}
          className="text-xs font-bold text-geovision-blue hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          {t('filters.clearAll')}
        </button>
      </div>

      {/* Active Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-300 mr-1">
          {activeCount} {t('filters.activeFilters')}
        </span>

        {smartFilters.categories.map((catId) => {
          const catObj = CATEGORIES.find(c => c.id === catId);
          return (
            <span
              key={catId}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-geovision-blue dark:bg-blue-950/80 dark:text-blue-300 shadow-2xs"
            >
              {catObj ? (language === 'ar' ? catObj.nameAr : catObj.nameEn) : catId}
              <X
                className="w-3.5 h-3.5 cursor-pointer hover:opacity-75"
                onClick={() => removeCategoryChip(catId)}
              />
            </span>
          );
        })}

        {smartFilters.locationName && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 shadow-2xs">
            📍 {smartFilters.locationName}
            <X className="w-3.5 h-3.5 cursor-pointer hover:opacity-75" onClick={removeLocationChip} />
          </span>
        )}

        {smartFilters.distanceKm && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 shadow-2xs">
            📏 Within {smartFilters.distanceKm} km
            <X className="w-3.5 h-3.5 cursor-pointer hover:opacity-75" onClick={removeDistanceChip} />
          </span>
        )}
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        
        {/* Location Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
            {t('filters.locationLabel')}
          </label>
          <select
            value={smartFilters.locationName}
            onChange={(e) => handleLocationSelect(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue"
          >
            <option value="">All Abu Dhabi Areas</option>
            {ABU_DHABI_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.nameEn}>
                {language === 'ar' ? loc.nameAr : loc.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Distance Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <span>{t('filters.distanceLabel')}</span>
            <span className="text-geovision-blue font-black">
              {smartFilters.distanceKm ? `${smartFilters.distanceKm} km` : 'Any'}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={smartFilters.distanceKm || 20}
            onChange={(e) => updateSmartFilter({ distanceKm: Number(e.target.value) })}
            className="w-full accent-geovision-blue cursor-pointer"
          />
        </div>

        {/* Min Rating */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
            {t('filters.ratingLabel')}
          </label>
          <select
            value={smartFilters.minRating || ''}
            onChange={(e) =>
              updateSmartFilter({ minRating: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue"
          >
            <option value="">All Ratings</option>
            <option value="4.5">4.5+ Stars ★★★★★</option>
            <option value="4.0">4.0+ Stars ★★★★☆</option>
          </select>
        </div>

      </div>

    </div>
  );
};
