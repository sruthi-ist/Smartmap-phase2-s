import React, { useState, useRef, useEffect } from 'react';
import type { GeoFeature } from '../../types';
import { useAppState } from '../../context/AppStateContext';
import {
  ChevronDown,
  Check,
  Building,
  MapPin,
  Search,
  Layers,
  ZoomIn,
  Info,
  RotateCcw,
  X,
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
  const { setMapCenterAndZoom, setCurrentView, currentView, showToast } = useAppState();

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

  const allArePublic = features.length > 0 && features.every(f => !isFeaturePrivate(f));
  const allArePrivate = features.length > 0 && features.every(f => isFeaturePrivate(f));

  const [selectedType, setSelectedType] = useState<'all' | 'private' | 'public'>(
    allArePublic ? 'public' : allArePrivate ? 'private' : 'all'
  );
  const [layerMenuOpen, setLayerMenuOpen] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);

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

  const filteredFeatures = features.filter((feat) => {
    // 1. Layer Category Filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(feat.category)) {
      return false;
    }

    // 2. Type Filter (Private vs Public)
    const isPriv = isFeaturePrivate(feat);
    if (selectedType === 'private' && !isPriv) return false;
    if (selectedType === 'public' && isPriv) return false;

    // 3. Keyword Search Filter inside results
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchName = (feat.nameEn || '').toLowerCase().includes(q) || (feat.nameAr || '').includes(q);
      const matchSub = (feat.subcategory || '').toLowerCase().includes(q);
      if (!matchName && !matchSub) return false;
    }

    return true;
  });

  const getLayerButtonLabel = () => {
    if (selectedCategories.length === LAYER_OPTIONS.length) {
      return language === 'ar' ? 'جميع الفئات' : 'All Categories';
    }
    if (selectedCategories.length === 0) return language === 'ar' ? 'لا يوجد' : 'None';
    return `${selectedCategories.length} ${language === 'ar' ? 'محدد' : 'Selected'}`;
  };

  const getTypeButtonLabel = () => {
    if (selectedType === 'all') return language === 'ar' ? 'جميع الأنواع' : 'All Types';
    if (selectedType === 'private') return language === 'ar' ? 'خاص' : 'Private';
    return language === 'ar' ? 'عام' : 'Public';
  };

  const isLayerActive = selectedCategories.length < LAYER_OPTIONS.length;
  const isTypeActive = selectedType !== 'all';
  const hasActiveFilters = isLayerActive || isTypeActive || searchFilter.trim() !== '';
  const displayedFeatures = filteredFeatures.slice(0, visibleCount);
  const isHighVolume = features.length >= 100 || filteredFeatures.length > 20;

  const handleClearFilters = () => {
    setSearchFilter('');
    setSelectedCategories([
      'education',
      'healthcare',
      'transport',
      'environment',
      'tourism',
      'utilities',
      'government',
      'parks',
    ]);
    setSelectedType('all');
    showToast(language === 'ar' ? 'تمت إعادة تعيين الفلاتر' : 'Result filters cleared');
  };

  return (
    <div className="mt-3.5 space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
      
      {/* High-Volume Results Header Banner (> 100 results handling) */}
      {isHighVolume && (
        <div className="p-2.5 rounded-xl bg-blue-50/90 dark:bg-slate-900 border border-blue-200/80 dark:border-slate-700 flex items-center justify-between gap-2 text-[11px] font-extrabold text-geovision-blue dark:text-blue-300">
          <div className="flex items-center gap-1.5 min-w-0">
            <Layers className="w-4 h-4 shrink-0 text-geovision-blue" />
            <span className="truncate">
              {language === 'ar'
                ? `عالية الكثافة: تم العثور على ${features.length} نتيجة مكانية`
                : `High-Density Layer: ${features.length}+ spatial items found`}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-geovision-blue text-white text-[10px] font-black shrink-0 shadow-2xs">
            {language === 'ar' ? `عرض ${displayedFeatures.length}` : `Top ${displayedFeatures.length}`}
          </span>
        </div>
      )}

      {/* Row 1: Search Results Title & Quick Search Input */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
            {language === 'ar' ? 'نتائج البحث' : 'Search Results'} ({filteredFeatures.length})
          </h4>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-slate-800 text-geovision-blue dark:text-blue-300 hover:bg-geovision-blue hover:text-white text-[10px] font-extrabold transition-all cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'ar' ? 'إلغاء الفلاتر' : 'Clear Filters'}</span>
            </button>
          )}
        </div>

        {/* Quick Filter Input Box - ALWAYS AVAILABLE */}
        <div className="relative flex-1 max-w-[170px]">
          <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 rtl:right-2.5 rtl:left-auto" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={language === 'ar' ? 'تصفية النتائج...' : 'Filter results...'}
            className="w-full pl-7 pr-7 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-geovision-blue placeholder:text-slate-400 rtl:pr-7 rtl:pl-7"
          />
          {searchFilter && (
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rtl:right-auto rtl:left-2"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 py-1.5 px-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
        
        {/* 1. CATEGORY FILTER */}
        <div className="relative flex items-center gap-1.5" ref={layerRef}>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="shrink-0">{language === 'ar' ? 'الفئة:' : 'Category:'}</span>
            <button
              type="button"
              onClick={() => {
                setLayerMenuOpen(!layerMenuOpen);
                setTypeMenuOpen(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer shadow-2xs shrink-0 ${
                layerMenuOpen || isLayerActive
                  ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/20'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 hover:border-geovision-blue'
              }`}
            >
              <span>{getLayerButtonLabel()}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${layerMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Layer Menu Dropdown */}
          {layerMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-48 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl z-50 space-y-1 text-left rtl:text-right">
              <div className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                {language === 'ar' ? 'تصفية حسب الفئة' : 'Filter by Category'}
              </div>

              {LAYER_OPTIONS.map((opt) => {
                const isSelected = selectedCategories.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleCategory(opt.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-slate-800 text-geovision-blue dark:text-blue-300 font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{language === 'ar' ? opt.labelAr : opt.labelEn}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-geovision-blue shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. TYPE FILTER */}
        <div className="relative flex items-center gap-1.5" ref={typeRef}>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="shrink-0">{language === 'ar' ? 'النوع:' : 'Type:'}</span>
            <button
              type="button"
              onClick={() => {
                setTypeMenuOpen(!typeMenuOpen);
                setLayerMenuOpen(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer shadow-2xs shrink-0 ${
                typeMenuOpen || isTypeActive
                  ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/20'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 hover:border-geovision-blue'
              }`}
            >
              <span>{getTypeButtonLabel()}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${typeMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Type Menu Dropdown */}
          {typeMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-44 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl z-50 space-y-1">
              <div className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                {language === 'ar' ? 'تصفية النوع' : 'Filter Type'}
              </div>

              {[
                { id: 'all', label: language === 'ar' ? 'جميع الأنواع' : 'All Types' },
                { id: 'private', label: language === 'ar' ? 'خاص' : 'Private' },
                { id: 'public', label: language === 'ar' ? 'عام' : 'Public' },
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
                    className={`w-full text-left rtl:text-right px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

      {/* Feature Cards List with Action Icons (Info & Zoom In) */}
      {filteredFeatures.length === 0 ? (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-center text-xs text-slate-400 font-bold">
          {language === 'ar' ? 'لا توجد نتائج مطابقة للتصفية المختارة.' : 'No spatial matches found for selected category/type filter.'}
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2.5 scrollbar-none">
          {displayedFeatures.map((feat) => {
            const isPriv = isFeaturePrivate(feat);
            return (
              <div
                key={feat.id}
                onClick={() => {
                  setSelectedFeature(feat);
                  setMapCenterAndZoom([feat.lat + 0.0035, feat.lng], 16);
                }}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 hover:border-geovision-blue dark:hover:border-geovision-blue cursor-pointer transition-all flex items-center justify-between gap-3 shadow-2xs hover:shadow-md overflow-hidden group"
              >
                {/* Left side: Icon & Title/Details */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Building Icon */}
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-geovision-blue flex items-center justify-center font-bold shrink-0 group-hover:bg-geovision-blue group-hover:text-white transition-colors">
                    <Building className="w-4.5 h-4.5" />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {language === 'ar' ? feat.nameAr : feat.nameEn}
                      </h5>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ${
                          isPriv
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                        }`}
                      >
                        {isPriv ? 'Private' : 'Public'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold truncate">
                        <MapPin className="w-3 h-3 text-geovision-blue shrink-0" />
                        <span className="truncate">{feat.subcategory} • {feat.distanceKm || 1.5} km</span>
                      </p>
                      {feat.openStatusEn && (
                        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0 truncate max-w-[140px]">
                          • {language === 'ar' ? feat.openStatusAr || feat.openStatusEn : feat.openStatusEn}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Interactive Action Icons (Zoom In & Info) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Zoom In Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMapCenterAndZoom([feat.lat + 0.0035, feat.lng], 16);
                      if (currentView !== 'map') setCurrentView('map');
                      showToast(language === 'ar' ? `التركيز على ${feat.nameAr}` : `Zoomed to ${feat.nameEn}`);
                    }}
                    className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-slate-800 text-geovision-blue dark:text-blue-300 hover:bg-geovision-blue hover:text-white transition-all cursor-pointer shadow-2xs"
                    title={language === 'ar' ? 'تكبير الخريطة على هذا الموقع' : 'Zoom in to location on map'}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>

                  {/* Info Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFeature(feat);
                      setMapCenterAndZoom([feat.lat + 0.0035, feat.lng], 16);
                      if (currentView !== 'map') setCurrentView('map');
                    }}
                    className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-geovision-blue hover:text-white transition-all cursor-pointer shadow-2xs"
                    title={language === 'ar' ? 'عرض التفاصيل الجغرافية' : 'View feature details'}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination & View All Controls for High Volume Results */}
      {filteredFeatures.length > visibleCount && (
        <div className="pt-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + 5)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer text-center shadow-2xs"
          >
            {language === 'ar'
              ? `عرض المزيد (+5 من أصل ${filteredFeatures.length})`
              : `Show Next 5 (of ${filteredFeatures.length})`}
          </button>
          
          <button
            type="button"
            onClick={() => setVisibleCount(filteredFeatures.length)}
            className="py-2 px-3 rounded-xl bg-geovision-blue hover:bg-blue-700 text-white font-black text-xs transition-all cursor-pointer text-center shrink-0 shadow-md shadow-blue-500/25 border border-blue-600"
          >
            {language === 'ar' ? `عرض الكل (${filteredFeatures.length})` : `View All (${filteredFeatures.length})`}
          </button>
        </div>
      )}

      {visibleCount > 5 && visibleCount >= filteredFeatures.length && (
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount(5)}
            className="text-[11px] font-bold text-slate-400 hover:text-geovision-blue transition-colors cursor-pointer"
          >
            {language === 'ar' ? 'طي القائمة (عرض أول 5)' : 'Collapse list (Show top 5)'}
          </button>
        </div>
      )}

    </div>
  );
};
