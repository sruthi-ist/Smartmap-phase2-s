import React, { useState, useRef, useEffect } from 'react';
import type { GeoFeature } from '../../types';
import {
  ChevronDown,
  Check,
  Building,
  MapPin,
  Star,
} from 'lucide-react';

interface AIMessageSearchResultsProps {
  features: GeoFeature[];
  setSelectedFeature: (feat: GeoFeature) => void;
  language: 'en' | 'ar';
}

const LAYER_OPTIONS = [
  { id: 'education', labelEn: 'Education', labelAr: 'التعليم' },
  { id: 'healthcare', labelEn: 'Healthcare', labelAr: 'الرعاية الصحية' },
  { id: 'transport', labelEn: 'Transport', labelAr: 'النقل والمواصلات' },
  { id: 'environment', labelEn: 'Environment', labelAr: 'البيئة' },
  { id: 'tourism', labelEn: 'Tourism', labelAr: 'السياحة' },
  { id: 'utilities', labelEn: 'Utilities', labelAr: 'الخدمات العامة' },
  { id: 'government', labelEn: 'Government', labelAr: 'الخدمات الحكومية' },
  { id: 'parks', labelEn: 'Parks', labelAr: 'الحدائق العامة' },
];

export const AIMessageSearchResults: React.FC<AIMessageSearchResultsProps> = ({
  features,
  setSelectedFeature,
  language,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'education',
    'healthcare',
    'transport',
    'environment',
    'tourism',
    'utilities',
    'government',
    'parks',
  ]);

  const [selectedType, setSelectedType] = useState<'all' | 'private' | 'public'>('all');
  const [layerMenuOpen, setLayerMenuOpen] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);

  const layerRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking anywhere outside of their respective containers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (layerRef.current && !layerRef.current.contains(e.target as Node)) {
        setLayerMenuOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const isFeaturePrivate = (feat: GeoFeature): boolean => {
    const nameLower = feat.nameEn.toLowerCase();
    return (
      nameLower.includes('private') ||
      nameLower.includes('gems') ||
      nameLower.includes('al yasmina') ||
      nameLower.includes('raha international') ||
      nameLower.includes('bareen') ||
      nameLower.includes('nmc')
    );
  };

  const filteredFeatures = features.filter((feat) => {
    // 1. Layer Category Filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(feat.category)) {
      return false;
    }

    // 2. Type Filter (Private vs Public/Government)
    const isPriv = isFeaturePrivate(feat);
    if (selectedType === 'private' && !isPriv) return false;
    if (selectedType === 'public' && isPriv) return false;

    return true;
  });

  const getLayerButtonLabel = () => {
    if (selectedCategories.length === LAYER_OPTIONS.length) return 'All Layers';
    if (selectedCategories.length === 0) return 'None';
    return `${selectedCategories.length} Selected`;
  };

  const getTypeButtonLabel = () => {
    if (selectedType === 'all') return 'All Types';
    if (selectedType === 'private') return 'Private';
    return 'Public / Government';
  };

  const isLayerActive = selectedCategories.length < LAYER_OPTIONS.length;
  const isTypeActive = selectedType !== 'all';

  return (
    <div className="mt-3.5 space-y-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80">
      
      {/* Header with Search Results Count & Filter Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
          Search Results ({filteredFeatures.length})
        </h4>

        {/* Filter Dropdown Controls */}
        <div className="flex items-center gap-2">
          
          {/* 1. LAYER FILTER DROPDOWN CONTAINER */}
          <div className="relative" ref={layerRef}>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span>Layer:</span>
              <button
                type="button"
                onClick={() => {
                  setLayerMenuOpen(!layerMenuOpen);
                  setTypeMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs ${
                  layerMenuOpen || isLayerActive
                    ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/20'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 hover:border-geovision-blue'
                }`}
              >
                <span>{getLayerButtonLabel()}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${layerMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Layer Checkbox Popup Menu */}
            {layerMenuOpen && (
              <div className="absolute right-0 top-full mt-2 z-[9999] w-60 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                    FILTER BY LAYER
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCategories(
                        selectedCategories.length === LAYER_OPTIONS.length
                          ? []
                          : LAYER_OPTIONS.map(l => l.id)
                      )
                    }
                    className="text-[11px] font-extrabold text-geovision-blue hover:underline cursor-pointer lowercase"
                  >
                    {selectedCategories.length === LAYER_OPTIONS.length ? 'clear' : 'select all'}
                  </button>
                </div>

                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {LAYER_OPTIONS.map((layer) => {
                    const isChecked = selectedCategories.includes(layer.id);
                    return (
                      <div
                        key={layer.id}
                        onClick={() => toggleCategory(layer.id)}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-blue-50/90 dark:bg-slate-800/90 text-slate-900 dark:text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-geovision-blue border-geovision-blue text-white shadow-xs'
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{language === 'ar' ? layer.labelAr : layer.labelEn}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. TYPE FILTER DROPDOWN CONTAINER */}
          <div className="relative" ref={typeRef}>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span>Type:</span>
              <button
                type="button"
                onClick={() => {
                  setTypeMenuOpen(!typeMenuOpen);
                  setLayerMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs ${
                  typeMenuOpen || isTypeActive
                    ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/20'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 hover:border-geovision-blue'
                }`}
              >
                <span>{getTypeButtonLabel()}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${typeMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Type Options Popup Menu */}
            {typeMenuOpen && (
              <div className="absolute right-0 top-full mt-2 z-[9999] w-48 p-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                {[
                  { id: 'all', label: 'All Types' },
                  { id: 'private', label: 'Private' },
                  { id: 'public', label: 'Public / Government' },
                ].map((opt) => {
                  const isSel = selectedType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedType(opt.id as any);
                        setTypeMenuOpen(false);
                      }}
                      className={`w-full text-left rtl:text-right px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSel
                          ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25 font-black'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-bold'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Feature Cards List */}
      {filteredFeatures.length === 0 ? (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-center text-xs text-slate-400 font-bold">
          No spatial matches found for selected layer/type filter.
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {filteredFeatures.map((feat) => {
            const isPriv = isFeaturePrivate(feat);
            return (
              <div
                key={feat.id}
                onClick={() => setSelectedFeature(feat)}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 hover:border-geovision-blue dark:hover:border-geovision-blue cursor-pointer transition-all flex items-center justify-between shadow-2xs hover:shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-geovision-blue flex items-center justify-center font-bold shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[160px]">
                        {language === 'ar' ? feat.nameAr : feat.nameEn}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          isPriv
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                        }`}
                      >
                        {isPriv ? 'Private' : 'Public'}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-geovision-blue" />
                      {feat.subcategory} • {feat.distanceKm || 1.5} km radius
                    </p>
                  </div>
                </div>

                {feat.rating && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{feat.rating}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
