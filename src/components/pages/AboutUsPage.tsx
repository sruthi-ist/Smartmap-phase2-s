import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  Info,
  Map,
  Sparkles,
  ShieldCheck,
  Building2,
  Globe2,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { t, setCurrentView } = useAppState();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-8 bg-spatial-canvas min-h-screen">
      
      {/* WOW Full-Width Hero Branding Banner */}
      <div className="relative overflow-hidden p-6 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl border border-blue-900/60 glow-blue">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-geovision-blue/20 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-geovision-blue to-cyan-400 text-white flex items-center justify-center font-black shadow-xl shadow-blue-500/40 shrink-0">
              <Info className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">{t('about.title')}</h1>
              <p className="text-xs sm:text-sm text-cyan-400 font-black uppercase tracking-widest mt-1">
                Department of Government Enablement — Abu Dhabi Spatial Data Infrastructure
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-4xl font-medium">
            {t('about.body')}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setCurrentView('map')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-geovision-blue hover:bg-blue-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-500/30 transition-all cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Launch Interactive Map Workspace</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-black text-slate-200 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Abu Dhabi Government Spatial Data Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Grid (2x2 on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pillar 1 */}
        <div className="glass-panel p-8 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:border-geovision-blue transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-geovision-blue flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Unified Abu Dhabi Spatial Data Infrastructure
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Consolidating authoritative spatial datasets from healthcare, education, municipality, environmental, and transportation entities into a single high-performance GIS ecosystem.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="glass-panel p-8 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:border-geovision-blue transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Conversational Spatial AI Copilot
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Eliminating technical GIS barriers by allowing citizens, decision makers, and spatial planners to query location intelligence in natural English or Arabic.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="glass-panel p-8 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:border-geovision-blue transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
            <Globe2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Bilingual English & Arabic Intelligence
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Built from the ground up for seamless bilingual operation, offering instant context-switching, RTL layout alignment, and localized GIS dataset matching.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="glass-panel p-8 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:border-geovision-blue transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Government Decision Enablement
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Empowering government leaders with spatial AOI analysis, interactive buffer tools, dynamic heatmaps, and official compliant map export reports.
          </p>
        </div>

      </div>

    </div>
  );
};
