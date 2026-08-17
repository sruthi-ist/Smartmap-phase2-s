import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Info, Map, Sparkles } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { t } = useAppState();

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 sm:pt-28 pb-16 space-y-12 bg-spatial-canvas min-h-screen">
      {/* Banner */}
      <div className="glass-panel p-8 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('about.title')}
            </h1>
            <p className="text-xs text-geovision-blue font-bold uppercase tracking-wider">
              Department of Government Enablement — Abu Dhabi
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
          {t('about.body')}
        </p>
      </div>

      {/* Core Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Map className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Unified Abu Dhabi Spatial Data Infrastructure (SDI)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Consolidating authoritative spatial datasets from health, education, municipal, and transportation authorities into one accessible platform.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Conversational Natural Language Interface
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Eliminating technical GIS complexity by allowing public users and specialists to query locations and layers using standard English or Arabic.
          </p>
        </div>

      </div>
    </div>
  );
};
