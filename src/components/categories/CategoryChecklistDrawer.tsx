import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CATEGORIES } from '../../data/mockAbuDhabiData';
import {
  Activity,
  GraduationCap,
  Bus,
  Building2,
  Trees,
  Zap,
  Check,
  X,
  Search,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Activity,
  GraduationCap,
  Bus,
  Building2,
  Trees,
  Zap,
};

interface CategoryChecklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryChecklistDrawer: React.FC<CategoryChecklistDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    language,
    selectedCategoryIds,
    setSelectedCategoryIds,
    selectedSubcategoryIds,
    toggleSubcategorySelection,
    setSelectedSubcategoryIds,
    showToast,
  } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCatIds, setExpandedCatIds] = useState<string[]>([
    'healthcare',
    'education',
    'transport',
    'government',
    'parks',
    'utilities',
  ]);

  if (!isOpen) return null;

  const toggleExpand = (catId: string) => {
    if (expandedCatIds.includes(catId)) {
      setExpandedCatIds(expandedCatIds.filter((id) => id !== catId));
    } else {
      setExpandedCatIds([...expandedCatIds, catId]);
    }
  };

  // Check if all subcategories of a parent category are checked
  const isCategoryFullyChecked = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) return false;
    return cat.subcategories.every((s) => selectedSubcategoryIds.includes(s.id));
  };

  // Toggle all subcategories under a parent category
  const toggleSelectAllSubcategories = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;

    const allSubIds = cat.subcategories.map((s) => s.id);
    const fullyChecked = isCategoryFullyChecked(catId);

    if (fullyChecked) {
      // Uncheck all subcategories of this category
      setSelectedSubcategoryIds(
        selectedSubcategoryIds.filter((id) => !allSubIds.includes(id))
      );
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
    } else {
      // Check all subcategories of this category
      const merged = Array.from(new Set([...selectedSubcategoryIds, ...allSubIds]));
      setSelectedSubcategoryIds(merged);
      if (!selectedCategoryIds.includes(catId)) {
        setSelectedCategoryIds([...selectedCategoryIds, catId]);
      }
    }
  };

  const handleSelectAllGlobally = () => {
    const allCatIds = CATEGORIES.map((c) => c.id);
    const allSubIds = CATEGORIES.flatMap((c) => c.subcategories.map((s) => s.id));
    setSelectedCategoryIds(allCatIds);
    setSelectedSubcategoryIds(allSubIds);
    showToast('All spatial categories and datasets selected');
  };

  const handleClearAllGlobally = () => {
    setSelectedCategoryIds([]);
    setSelectedSubcategoryIds([]);
    showToast('Category checklist cleared');
  };

  const filteredCategories = CATEGORIES.filter((cat) => {
    const name = (language === 'ar' ? cat.nameAr : cat.nameEn).toLowerCase();
    const matchCat = name.includes(searchTerm.toLowerCase());
    const matchSub = cat.subcategories.some((sub) =>
      (language === 'ar' ? sub.nameAr : sub.nameEn).toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchCat || matchSub;
  });

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[85vh] glass-level-3 rounded-3xl p-6 shadow-2xl border border-white/80 dark:border-slate-700/80 flex flex-col space-y-4 glow-blue">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/80 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-black shadow-md shadow-blue-500/30">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Geospatial Datasets Checklist
              </h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                Check multiple categories and sub-datasets to render live on the map.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search + Global Select/Clear */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search datasets..."
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl glass-level-1 border border-white/70 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue placeholder-slate-400 dark:placeholder-slate-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleSelectAllGlobally}
              className="px-3.5 py-2 rounded-xl text-xs font-black glass-level-1 text-geovision-blue hover:bg-geovision-blue hover:text-white border border-white/70 dark:border-slate-700 transition-all shadow-2xs cursor-pointer"
            >
              Select All
            </button>
            <button
              onClick={handleClearAllGlobally}
              className="px-3.5 py-2 rounded-xl text-xs font-black glass-level-1 text-slate-600 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 border border-white/70 dark:border-slate-700 transition-all cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Scrollable Category Checklist Items */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 scrollbar-none">
          {filteredCategories.map((cat) => {
            const IconComp = ICON_MAP[cat.icon] || Activity;
            const isFullyChecked = isCategoryFullyChecked(cat.id);
            const isExpanded = expandedCatIds.includes(cat.id);
            const activeSubCount = cat.subcategories.filter((s) =>
              selectedSubcategoryIds.includes(s.id)
            ).length;

            return (
              <div
                key={cat.id}
                className="glass-level-2 rounded-2xl p-4 border border-white/80 dark:border-slate-700/80 space-y-3 shadow-xs"
              >
                {/* Parent Category Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleExpand(cat.id)}>
                    <div className="w-8 h-8 rounded-xl bg-geovision-blue/15 text-geovision-blue dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {language === 'ar' ? cat.nameAr : cat.nameEn}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100/80 text-geovision-blue dark:bg-blue-950/90 dark:text-blue-300">
                          {activeSubCount} / {cat.subcategories.length} selected
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSelectAllSubcategories(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isFullyChecked
                          ? 'bg-geovision-blue text-white shadow-md'
                          : 'glass-level-1 text-slate-700 dark:text-slate-200 border border-white/60 dark:border-slate-700 hover:border-geovision-blue'
                      }`}
                    >
                      {isFullyChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{isFullyChecked ? 'Selected All' : 'Select All'}</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rtl:rotate-180" />}
                    </button>
                  </div>
                </div>

                {/* Subcategories Checklist Checkbox Cards */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {cat.subcategories.map((sub) => {
                      const isSubChecked = selectedSubcategoryIds.includes(sub.id);

                      return (
                        <div
                          key={sub.id}
                          onClick={() => toggleSubcategorySelection(sub.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSubChecked
                              ? 'bg-blue-50/90 dark:bg-blue-950/80 border-geovision-blue text-geovision-blue dark:text-blue-300 font-extrabold shadow-2xs'
                              : 'glass-level-1 border-white/70 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-geovision-blue'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                isSubChecked
                                  ? 'bg-geovision-blue border-geovision-blue text-white'
                                  : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900'
                              }`}
                            >
                              {isSubChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-semibold">
                              {language === 'ar' ? sub.nameAr : sub.nameEn}
                            </span>
                          </div>

                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/90 text-slate-600 dark:text-slate-200">
                            {sub.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-300">
            {selectedSubcategoryIds.length} datasets ready for spatial analysis
          </span>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all cursor-pointer"
          >
            Apply & Close Checklist
          </button>
        </div>

      </div>
    </div>
  );
};

