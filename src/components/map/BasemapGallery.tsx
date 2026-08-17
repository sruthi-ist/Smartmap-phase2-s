import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import type { BasemapType } from '../../types';
import { Map, Layers, Sun, Globe, X } from 'lucide-react';

export const BasemapGallery: React.FC = () => {
  const { activeBasemap, setActiveBasemap, setActiveTool, t } = useAppState();

  const basemaps: { id: BasemapType; labelKey: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
    { id: 'light', labelKey: 'basemap.light', icon: Sun, desc: 'Clean high contrast' },
    { id: 'streets', labelKey: 'basemap.streets', icon: Map, desc: 'Standard vector map' },
    { id: 'satellite', labelKey: 'basemap.satellite', icon: Globe, desc: 'High resolution imagery' },
  ];

  return (
    <div className="absolute top-20 right-22 rtl:right-auto rtl:left-22 z-[600] w-80 glass-level-3 rounded-3xl p-5 shadow-2xl border border-white/80 dark:border-slate-800 animate-fade-in glow-blue">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-geovision-blue text-white flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {t('tool.basemap')}
          </h3>
        </div>
        <button
          onClick={() => setActiveTool('none')}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {basemaps.map((bm) => {
          const IconComp = bm.icon;
          const isActive = activeBasemap === bm.id;

          return (
            <button
              key={bm.id}
              onClick={() => setActiveBasemap(bm.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                isActive
                  ? 'border-2 border-geovision-blue bg-blue-50/60 dark:bg-blue-950/60 text-geovision-blue font-bold shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-slate-900/50'
              }`}
            >
              <IconComp className="w-6 h-6 mb-1.5" />
              <span className="text-xs font-extrabold">{t(bm.labelKey)}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-300 font-semibold">{bm.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
