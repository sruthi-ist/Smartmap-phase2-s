import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Printer, X, Download, FileText, Image as ImageIcon, ShieldCheck, Compass, CheckCircle } from 'lucide-react';

export const PrintMapModal: React.FC = () => {
  const { printModalOpen, setPrintModalOpen, showToast, t } = useAppState();
  const [format, setFormat] = useState<'pdf' | 'png' | 'jpeg'>('pdf');
  const [printState, setPrintState] = useState<'idle' | 'generating' | 'ready'>('idle');

  if (!printModalOpen) return null;

  const handleGenerate = () => {
    setPrintState('generating');
    setTimeout(() => {
      setPrintState('ready');
    }, 2000);
  };

  const handleDownload = () => {
    showToast(`DGE GeoVision Map Report exported as ${format.toUpperCase()}`);
    setPrintModalOpen(false);
    setPrintState('idle');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-level-3 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/10 space-y-6 glow-blue-lg">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {t('print.title')}
              </h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('print.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setPrintModalOpen(false);
              setPrintState('idle');
            }}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Printable Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Controls Form */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pdf', label: 'PDF', icon: FileText },
                  { id: 'png', label: 'PNG', icon: ImageIcon },
                  { id: 'jpeg', label: 'JPEG', icon: ImageIcon },
                ].map((f) => {
                  const IconC = f.icon;
                  const isSel = format === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id as any)}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                        isSel
                          ? 'border-2 border-geovision-blue bg-blue-50/60 text-geovision-blue dark:bg-blue-950/60'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <IconC className="w-4 h-4 mb-1" />
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-semibold">
              <span className="font-black text-slate-900 dark:text-white block">Included Map Elements:</span>
              <div className="space-y-1.5 pl-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>DGE Government Official Header & Seal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Interactive Map View & Dynamic Legend</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>North Arrow & Dynamic Scale Bar (1:25,000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Authoritative GIS Metadata & Timestamp</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            {printState === 'idle' && (
              <button
                onClick={handleGenerate}
                className="w-full py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all"
              >
                {t('print.btnGenerate')}
              </button>
            )}

            {printState === 'generating' && (
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-geovision-blue dark:text-blue-300 text-xs font-black flex items-center justify-center gap-2 animate-pulse glow-blue">
                <Printer className="w-4 h-4 animate-spin" />
                {t('print.generating')}
              </div>
            )}

            {printState === 'ready' && (
              <button
                onClick={handleDownload}
                className="w-full py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t('print.download')} ({format.toUpperCase()})
              </button>
            )}
          </div>

          {/* Printable Report Layout Preview */}
          <div className="border border-slate-300 dark:border-slate-700 rounded-3xl p-4 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-inner relative overflow-hidden">
            {/* Header branding on preview */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-geovision-blue text-white flex items-center justify-center text-[8px] font-black">
                  DGE
                </div>
                <span className="text-[11px] font-black text-slate-900 dark:text-white">
                  GeoVision Spatial Report
                </span>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>

            {/* Simulated Map Extent Canvas */}
            <div className="my-3 h-36 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative flex items-center justify-center">
              <span className="text-[11px] font-bold text-slate-400">
                [ Abu Dhabi Extent Report Preview ]
              </span>
              <Compass className="absolute top-2 right-2 w-5 h-5 text-geovision-blue" />
            </div>

            {/* Footer with Scale & Metadata */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-between text-[9px] font-bold text-slate-400">
              <span>Scale: 1:25,000</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
