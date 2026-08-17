import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CATEGORIES } from '../../data/mockAbuDhabiData';
import { getCategoryColor } from '../../utils/markerUtils';
import {
  GraduationCap,
  Activity,
  Bus,
  Trees,
  Palmtree,
  Zap,
  Building2,
  X,
  Layers,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  education: GraduationCap,
  healthcare: Activity,
  transport: Bus,
  parks: Trees,
  environment: Trees,
  tourism: Palmtree,
  utilities: Zap,
  government: Building2,
};

const CATEGORY_COLORS: Record<string, string> = {
  education: '#1E3A8A',
  healthcare: '#2563EB',
  transport: '#F59E0B',
  parks: '#10B981',
  environment: '#059669',
  tourism: '#06B6D4',
  utilities: '#6366F1',
  government: '#7C3AED',
};

export const MapLegend: React.FC = () => {
  const { language, setActiveTool } = useAppState();

  return (
    <div className="absolute top-20 right-20 rtl:right-auto rtl:left-20 z-[600] w-64 sm:w-72 glass-level-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/80 dark:border-slate-800 animate-scale-in glow-blue">
      {/* Legend Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
        <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
          <Layers className="w-4 h-4 text-geovision-blue" />
          <span>LEGEND</span>
        </h3>
        <button
          onClick={() => setActiveTool('none')}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close Legend"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Static Legend List (No scrolling, read-only display) */}
      <div className="space-y-2.5">
        {CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.id] || ICON_MAP[cat.icon.toLowerCase()] || Activity;
          const badgeColor = CATEGORY_COLORS[cat.id] || getCategoryColor(cat.id);

          return (
            <div key={cat.id} className="flex items-center gap-3 py-0.5 px-1">
              {/* Circular Icon Badge */}
              <div
                className="w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: badgeColor }}
              >
                <IconComp className="w-4 h-4 text-white stroke-[2.2]" />
              </div>

              {/* Category Label */}
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                {language === 'ar' ? cat.nameAr : cat.nameEn}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


