import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  Pencil,
  Layers,
  List,
  Plus,
  Minus,
  Home,
  Crosshair,
  Compass,
  MousePointer2,
} from 'lucide-react';

export const MapToolbar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    mapCenter,
    mapZoom,
    setMapCenterAndZoom,
    showToast,
  } = useAppState();

  const handleDrawToggle = () => {
    setActiveTool(activeTool === 'sketch' ? 'none' : 'sketch');
  };

  const handleBasemapToggle = () => {
    setActiveTool(activeTool === 'basemap' ? 'none' : 'basemap');
  };

  const handleLegendToggle = () => {
    setActiveTool(activeTool === 'legend' ? 'none' : 'legend');
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(mapZoom + 1, 19);
    setMapCenterAndZoom(mapCenter, newZoom);
    showToast(`Zoom level: ${newZoom}`);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(mapZoom - 1, 3);
    setMapCenterAndZoom(mapCenter, newZoom);
    showToast(`Zoom level: ${newZoom}`);
  };

  const handleHomeClick = () => {
    setMapCenterAndZoom([24.4539, 54.3773], 12);
    showToast('Map reset to Abu Dhabi default extent');
  };

  const handleLocateClick = () => {
    showToast('Locating current device position...');
    setTimeout(() => {
      setMapCenterAndZoom([24.4539, 54.3773], 15);
      showToast('Position acquired: Zoomed to current location');
    }, 800);
  };

  const handleCompassClick = () => {
    showToast('Map orientation set to North (0°)');
  };

  const handleSelectToggle = () => {
    setActiveTool(activeTool === 'identify' ? 'none' : 'identify');
  };

  // High-Contrast Vivid Solid Blue Active Highlight
  const getToolBtnStyle = (isActive: boolean) => {
    return isActive
      ? 'bg-geovision-blue text-white shadow-xl shadow-blue-500/40 scale-105 font-black border border-geovision-blue'
      : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-geovision-blue border border-transparent';
  };

  return (
    <div className="absolute top-16 sm:top-20 right-4 rtl:right-auto rtl:left-4 z-[600] flex flex-col gap-2 items-center">
      
      {/* Top Capsule: Draw, Basemap, Legend */}
      <div className="glass-level-3 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl p-1 rounded-2xl shadow-xl border border-white/80 dark:border-slate-700/80 flex flex-col items-center gap-1 w-12 sm:w-13">
        
        {/* Draw */}
        <button
          onClick={handleDrawToggle}
          className={`w-full py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${getToolBtnStyle(
            activeTool === 'sketch'
          )}`}
          title="Draw AOI Polygon"
        >
          <Pencil className="w-4 h-4 stroke-[2]" />
          <span className="text-[8px] font-extrabold tracking-tight leading-none">Draw</span>
        </button>

        {/* Basemap */}
        <button
          onClick={handleBasemapToggle}
          className={`w-full py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${getToolBtnStyle(
            activeTool === 'basemap'
          )}`}
          title="Change Basemap Tiles"
        >
          <Layers className="w-4 h-4 stroke-[2]" />
          <span className="text-[8px] font-extrabold tracking-tight leading-none">Basemap</span>
        </button>

        {/* Legend */}
        <button
          onClick={handleLegendToggle}
          className={`w-full py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${getToolBtnStyle(
            activeTool === 'legend'
          )}`}
          title="View Map Legend"
        >
          <List className="w-4 h-4 stroke-[2]" />
          <span className="text-[8px] font-extrabold tracking-tight leading-none">Legend</span>
        </button>

      </div>

      {/* Bottom Capsule: +, -, Home, Locate, Compass, Divider, Select */}
      <div className="glass-level-3 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl p-1 rounded-2xl shadow-xl border border-white/80 dark:border-slate-700/80 flex flex-col items-center gap-1 w-12 sm:w-13">
        
        {/* Zoom In (+ icon only) */}
        <button
          onClick={handleZoomIn}
          className="w-full py-1 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-geovision-blue transition-all cursor-pointer"
          title="Zoom In (+)"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Zoom Out (- icon only) */}
        <button
          onClick={handleZoomOut}
          className="w-full py-1 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-geovision-blue transition-all cursor-pointer"
          title="Zoom Out (-)"
        >
          <Minus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Home */}
        <button
          onClick={handleHomeClick}
          className="w-full py-1 px-0.5 rounded-xl flex flex-col items-center gap-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-geovision-blue transition-all cursor-pointer"
          title="Return to Home Extent"
        >
          <Home className="w-3.5 h-3.5 stroke-[2]" />
          <span className="text-[8px] font-bold tracking-tight leading-none">Home</span>
        </button>

        {/* Locate */}
        <button
          onClick={handleLocateClick}
          className="w-full py-1 px-0.5 rounded-xl flex flex-col items-center gap-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-geovision-blue transition-all cursor-pointer"
          title="Locate Current Position"
        >
          <Crosshair className="w-3.5 h-3.5 stroke-[2]" />
          <span className="text-[8px] font-bold tracking-tight leading-none">Locate</span>
        </button>

        {/* Compass */}
        <button
          onClick={handleCompassClick}
          className="w-full py-1 px-0.5 rounded-xl flex flex-col items-center gap-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-geovision-blue transition-all cursor-pointer"
          title="Map Orientation (North)"
        >
          <Compass className="w-3.5 h-3.5 stroke-[2]" />
          <span className="text-[8px] font-bold tracking-tight leading-none">Compass</span>
        </button>

        {/* Divider */}
        <div className="w-5 h-px bg-slate-200 dark:bg-slate-700 my-0.5" />

        {/* Select */}
        <button
          onClick={handleSelectToggle}
          className={`w-full py-1 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${getToolBtnStyle(
            activeTool === 'identify'
          )}`}
          title="Select / Inspect Feature"
        >
          <MousePointer2 className="w-3.5 h-3.5 stroke-[2]" />
          <span className="text-[8px] font-bold tracking-tight leading-none">Select</span>
        </button>

      </div>

    </div>
  );
};
