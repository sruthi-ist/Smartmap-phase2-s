import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CATEGORIES } from '../../data/mockAbuDhabiData';
import { Activity, GraduationCap, Bus, Building2, Trees, Zap, Plus, Check, Compass } from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Activity,
  GraduationCap,
  Bus,
  Building2,
  Trees,
  Zap,
};

export const HomeCategoryDock: React.FC = () => {
  const { language, selectedCategoryIds, selectedSubcategoryIds, toggleCategorySelection, setCurrentView } = useAppState();

  const handleCategoryClick = (catId: string) => {
    toggleCategorySelection(catId);
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
        <span>Explore by Category</span>
      </div>

      {/* Horizontal Glass Category Dock */}
      <div className="w-full max-w-4xl px-2">
        <div className="glass-level-2 p-1.5 px-3 rounded-full border border-white/60 dark:border-slate-800 flex items-center gap-2 max-w-full">
          
          {/* Explore Trigger Button (Fixed First on Left) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setCurrentView('categories')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-geovision-blue text-white shadow-md shadow-blue-500/25 hover:bg-blue-600 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>
                {language === 'ar'
                  ? `استكشاف (${selectedSubcategoryIds.length})`
                  : `Explore (${selectedSubcategoryIds.length})`}
              </span>
            </button>

            <button
              onClick={() => setCurrentView('categories')}
              className="p-1 rounded-full text-slate-600 dark:text-slate-200 hover:text-geovision-blue hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              title="Explore All Categories"
            >
              <Plus className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 shrink-0 mx-0.5" />
          </div>

          {/* Scrollable Categories List */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 min-w-0">
            {CATEGORIES.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Activity;
              const isSelected = selectedCategoryIds.includes(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25 scale-105'
                      : 'glass-level-1 text-slate-700 dark:text-slate-200 hover:border-geovision-blue hover:text-geovision-blue'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
