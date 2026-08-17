import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useAppState } from '../../context/AppStateContext';
import { ABU_DHABI_LOCATIONS, GEO_FEATURES } from '../../data/mockAbuDhabiData';
import type { LocationSearchResult, DrawnShape } from '../../types';
import { MapToolbar } from './MapToolbar';
import { IdentifyPanel } from './IdentifyPanel';
import { BasemapGallery } from './BasemapGallery';
import { MapLegend } from './MapLegend';
import { BufferTool } from './BufferTool';
import { PrintMapModal } from './PrintMapModal';
import { SketchAOITool } from './SketchAOITool';
import { GeoVisionPanel } from '../ai/GeoVisionPanel';
import { SmartFilterPanel } from '../filters/SmartFilterPanel';
import { MapCategoryDock } from '../categories/MapCategoryDock';
import { createGeoVisionMarkerIcon, getCategoryColor } from '../../utils/markerUtils';
import { Search, Sparkles, MapPin, X, Layers } from 'lucide-react';

export const MapWorkspace: React.FC = () => {
  const {
    language,
    activeBasemap,
    activeTool,
    setSelectedFeature,
    mapCenter,
    mapZoom,
    setMapCenterAndZoom,
    filteredFeatures,
    bufferRadiusKm,
    aoiResult,
    sendAIMessage,
    showToast,
    filterDrawerOpen,
    setFilterDrawerOpen,
    drawTool,
    userDrawnShapes,
    setUserDrawnShapes,
    t,
  } = useAppState();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const drawnLayersGroupRef = useRef<L.LayerGroup | null>(null);
  const bufferCircleRef = useRef<L.Circle | null>(null);
  const aoiPolygonRef = useRef<L.Polygon | null>(null);

  const [searchMode, setSearchMode] = useState<'ai' | 'loc'>('loc');
  const [aiInputText, setAiInputText] = useState('');
  const [locSearchInput, setLocSearchInput] = useState('');
  const [locSuggestions, setLocSuggestions] = useState<LocationSearchResult[]>([]);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);

  // 100% English Basemap Tile URLs
  const basemapUrls: Record<string, string> = {
    light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    streets: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: mapCenter,
        zoom: mapZoom,
        zoomControl: false,
      });

      const tileUrl = basemapUrls[activeBasemap] || basemapUrls['streets'];
      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; DGE Abu Dhabi Spatial Infrastructure',
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      markersGroupRef.current = L.layerGroup().addTo(map);
      drawnLayersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 300);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap Tiles
  useEffect(() => {
    if (mapInstanceRef.current && tileLayerRef.current) {
      const tileUrl = basemapUrls[activeBasemap] || basemapUrls['streets'];
      tileLayerRef.current.setUrl(tileUrl);
    }
  }, [activeBasemap]);

  // Update Map Center and Zoom
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(mapCenter, mapZoom, { duration: 1.2 });
    }
  }, [mapCenter, mapZoom]);

  // Update Feature Markers & Layer Clusters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    filteredFeatures.forEach((feat) => {
      const color = getCategoryColor(feat.category);
      const customIcon = createGeoVisionMarkerIcon(feat.category, feat.subcategory);

      const title = language === 'ar' ? feat.nameAr : feat.nameEn;
      const address = language === 'ar' ? feat.addressAr : feat.addressEn;
      const categoryLabel = feat.category.toUpperCase();

      const popupHtml = `
        <div style="font-family: var(--font-en); padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 800; background-color: ${color}20; color: ${color}; padding: 3px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px;">
              ${categoryLabel}
            </span>
            ${feat.isAuthoritative ? `<span style="font-size: 10px; font-weight: 800; color: #10B981;">✓ Verified</span>` : ''}
          </div>
          <h4 style="font-size: 13px; font-weight: 900; margin: 0 0 4px 0; color: inherit; line-height: 1.3;">
            ${title}
          </h4>
          <p style="font-size: 11px; font-weight: 500; opacity: 0.8; margin: 0 0 10px 0;">
            📍 ${address}
          </p>
          <div style="border-top: 1px solid rgba(0,0,0,0.08); padding-top: 8px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 10px; font-weight: 700; opacity: 0.6;">
              ${feat.lat.toFixed(3)}°N, ${feat.lng.toFixed(3)}°E
            </span>
            <button
              id="pop-btn-${feat.id}"
              style="background: #176BFF; color: white; border: none; padding: 5px 12px; border-radius: 12px; font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s;"
            >
              Inspect →
            </button>
          </div>
        </div>
      `;

      const marker = L.marker([feat.lat, feat.lng], { icon: customIcon });
      marker.bindPopup(popupHtml, { maxWidth: 260 });

      marker.on('click', () => {
        setSelectedFeature(feat);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([feat.lat, feat.lng], 15);
        }
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`pop-btn-${feat.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedFeature(feat);
          };
        }
      });

      markersGroupRef.current?.addLayer(marker);
    });
  }, [filteredFeatures, language, setSelectedFeature]);

  // Render Buffer Circle geometry
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (bufferCircleRef.current) {
      bufferCircleRef.current.remove();
      bufferCircleRef.current = null;
    }

    if (activeTool === 'buffer') {
      const circle = L.circle(mapCenter, {
        radius: bufferRadiusKm * 1000,
        color: '#176BFF',
        fillColor: '#176BFF',
        fillOpacity: 0.15,
        weight: 2.5,
        dashArray: '6, 6',
      }).addTo(mapInstanceRef.current);

      bufferCircleRef.current = circle;
    }
  }, [activeTool, bufferRadiusKm, mapCenter]);

  // Render AOI Polygon geometry
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (aoiPolygonRef.current) {
      aoiPolygonRef.current.remove();
      aoiPolygonRef.current = null;
    }

    if (activeTool === 'sketch' && aoiResult) {
      const polygon = L.polygon(aoiResult.bounds, {
        color: '#176BFF',
        fillColor: '#176BFF',
        fillOpacity: 0.22,
        weight: 3,
      }).addTo(mapInstanceRef.current);

      aoiPolygonRef.current = polygon;
    }
  }, [activeTool, aoiResult]);

  // Render User Drawn Shapes (Point, Circle, Polygon, Rectangle)
  useEffect(() => {
    if (!mapInstanceRef.current || !drawnLayersGroupRef.current) return;

    drawnLayersGroupRef.current.clearLayers();

    userDrawnShapes.forEach((shape) => {
      if (shape.type === 'point') {
        const customPin = L.divIcon({
          className: 'custom-leaflet-marker-pin',
          html: `<div style="width:28px;height:28px;background:#176BFF;border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(23,107,255,0.5);color:white;font-size:13px;font-weight:900;">📍</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([shape.lat, shape.lng], { icon: customPin });
        marker.bindPopup(`
          <div style="padding:4px;font-family:sans-serif;">
            <strong style="color:#176BFF;font-size:12px;">📍 User Point Marker</strong><br/>
            <span style="font-size:11px;">${shape.lat.toFixed(4)}°N, ${shape.lng.toFixed(4)}°E</span>
          </div>
        `);
        drawnLayersGroupRef.current?.addLayer(marker);
      } else if (shape.type === 'circle') {
        const circle = L.circle([shape.lat, shape.lng], {
          radius: shape.radius || 2000,
          color: '#176BFF',
          fillColor: '#176BFF',
          fillOpacity: 0.2,
          weight: 2.5,
        });
        circle.bindPopup(`
          <div style="padding:4px;font-family:sans-serif;">
            <strong style="color:#176BFF;font-size:12px;">⭕ User Circle Buffer (2 km)</strong>
          </div>
        `);
        drawnLayersGroupRef.current?.addLayer(circle);
      } else if (shape.type === 'polygon') {
        const polyPoints = shape.points || [
          [shape.lat + 0.015, shape.lng],
          [shape.lat, shape.lng + 0.018],
          [shape.lat - 0.015, shape.lng],
          [shape.lat, shape.lng - 0.018],
        ];
        const polygon = L.polygon(polyPoints, {
          color: '#4F46E5',
          fillColor: '#4F46E5',
          fillOpacity: 0.25,
          weight: 2.5,
        });
        polygon.bindPopup(`
          <div style="padding:4px;font-family:sans-serif;">
            <strong style="color:#4F46E5;font-size:12px;">⬡ User Polygon Area</strong>
          </div>
        `);
        drawnLayersGroupRef.current?.addLayer(polygon);
      } else if (shape.type === 'rect') {
        const bounds: [[number, number], [number, number]] = shape.bounds || [
          [shape.lat - 0.012, shape.lng - 0.018],
          [shape.lat + 0.012, shape.lng + 0.018],
        ];
        const rect = L.rectangle(bounds, {
          color: '#059669',
          fillColor: '#059669',
          fillOpacity: 0.22,
          weight: 2.5,
        });
        rect.bindPopup(`
          <div style="padding:4px;font-family:sans-serif;">
            <strong style="color:#059669;font-size:12px;">█ User Bounding Box</strong>
          </div>
        `);
        drawnLayersGroupRef.current?.addLayer(rect);
      }
    });
  }, [userDrawnShapes]);

  // Handle Interactive Map Click Drawing
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (activeTool !== 'sketch') return;

      const { lat, lng } = e.latlng;
      const shapeId = `shape-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

      const newShape: DrawnShape = {
        id: shapeId,
        type: drawTool,
        lat,
        lng,
        radius: 2000,
        bounds: [
          [lat - 0.012, lng - 0.018],
          [lat + 0.012, lng + 0.018],
        ],
        points: [
          [lat + 0.015, lng],
          [lat, lng + 0.018],
          [lat - 0.015, lng],
          [lat, lng - 0.018],
        ],
      };

      setUserDrawnShapes((prev) => [...prev, newShape]);

      const labelName =
        drawTool === 'point'
          ? 'Point Marker'
          : drawTool === 'circle'
          ? 'Circle Buffer'
          : drawTool === 'polygon'
          ? 'Polygon Boundary'
          : 'Rectangle Box';

      showToast(`Drawn ${labelName} at ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
    };

    mapInstanceRef.current.on('click', handleMapClick);

    return () => {
      mapInstanceRef.current?.off('click', handleMapClick);
    };
  }, [activeTool, drawTool, setUserDrawnShapes, showToast]);

  // Location search autocomplete
  const handleLocationInputChange = (val: string) => {
    setLocSearchInput(val);
    if (!val.trim()) {
      setLocSuggestions([]);
      return;
    }
    const matches = ABU_DHABI_LOCATIONS.filter(
      loc =>
        loc.nameEn.toLowerCase().includes(val.toLowerCase()) ||
        loc.nameAr.includes(val) ||
        loc.typeEn.toLowerCase().includes(val.toLowerCase())
    );
    setLocSuggestions(matches);
  };

  const handleSelectLocation = (loc: LocationSearchResult) => {
    setMapCenterAndZoom([loc.lat, loc.lng], loc.zoom);
    setLocSearchInput(language === 'ar' ? loc.nameAr : loc.nameEn);
    setLocSuggestions([]);
    showToast(`Centered map on ${language === 'ar' ? loc.nameAr : loc.nameEn}`);
  };

  // Submit Handler for Search Bar
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (searchMode === 'ai') {
      const query = aiInputText.trim();
      if (!query) return;
      sendAIMessage(query);
      setAiInputText('');
      setAiPanelOpen(true);
      return;
    }

    // Location search submit logic
    const val = locSearchInput.trim();
    if (!val) return;
    setLocSuggestions([]);

    // 1. Direct match in ABU_DHABI_LOCATIONS
    const locMatch = ABU_DHABI_LOCATIONS.find(
      l =>
        l.nameEn.toLowerCase().includes(val.toLowerCase()) ||
        l.nameAr.includes(val) ||
        val.toLowerCase().includes(l.nameEn.toLowerCase())
    );

    if (locMatch) {
      setMapCenterAndZoom([locMatch.lat, locMatch.lng], locMatch.zoom);
      showToast(`Navigated map to ${language === 'ar' ? locMatch.nameAr : locMatch.nameEn}`);
      sendAIMessage(`Show spatial datasets around ${locMatch.nameEn}`);
      return;
    }

    // 2. Feature match in GEO_FEATURES
    const featMatch = GEO_FEATURES.find(
      f =>
        f.nameEn.toLowerCase().includes(val.toLowerCase()) ||
        f.nameAr.includes(val) ||
        f.category.toLowerCase().includes(val.toLowerCase())
    );

    if (featMatch) {
      setMapCenterAndZoom([featMatch.lat, featMatch.lng], 15);
      setSelectedFeature(featMatch);
      showToast(`Located feature: ${language === 'ar' ? featMatch.nameAr : featMatch.nameEn}`);
      sendAIMessage(`Show details for ${featMatch.nameEn}`);
      return;
    }

    // 3. Smart Fallback Location Match (e.g. Dubai, Corniche, Abu Dhabi)
    if (val.toLowerCase().includes('dubai') || val.includes('دبي')) {
      setMapCenterAndZoom([25.2048, 55.2708], 12);
      showToast('Navigated map to Dubai, UAE');
      sendAIMessage('Overview of Dubai location extent');
      return;
    }

    // 4. Default AI query fallback
    showToast(`Searching spatial index for "${val}"`);
    sendAIMessage(val);
    setAiPanelOpen(true);
  };

  return (
    <div className="relative w-full h-screen pt-[84px] sm:pt-[88px] overflow-hidden flex flex-col md:flex-row bg-spatial-canvas">
      
      {/* Floating Data & Filter Drawer */}
      {filterDrawerOpen && (
        <div className="absolute top-20 left-4 z-[600] w-80 sm:w-96 glass-level-3 rounded-3xl p-4 shadow-2xl border border-white/80 dark:border-slate-800 animate-slide-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-geovision-blue" />
              GIS Discovery & Smart Filters
            </h3>
            <button
              onClick={() => setFilterDrawerOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <SmartFilterPanel />
        </div>
      )}

      {/* Main 90% Visual Canvas Map */}
      <div className="relative flex-1 h-full w-full overflow-hidden">
        
        {/* Leaflet Map Canvas (rendered first so overlays sit on top) */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Top-Center Floating Glass AI Search Overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] w-[92%] max-w-xl">
          <form
            onSubmit={handleSearchSubmit}
            className="glass-level-2 p-1.5 rounded-3xl shadow-2xl border border-white/80 dark:border-white/10 flex items-center gap-2 glow-blue"
          >
            
            {/* Search Mode Segmented Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 text-[11px] font-bold shrink-0">
              <button
                type="button"
                onClick={() => setSearchMode('ai')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  searchMode === 'ai'
                    ? 'bg-geovision-blue text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t('map.searchModeAI')}
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('loc')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  searchMode === 'loc'
                    ? 'bg-geovision-blue text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                {t('map.searchModeLoc')}
              </button>
            </div>

            {/* Input Form */}
            {searchMode === 'ai' ? (
              <input
                type="text"
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full bg-transparent px-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden placeholder-slate-400"
              />
            ) : (
              <div className="relative w-full">
                <input
                  type="text"
                  value={locSearchInput}
                  onChange={(e) => handleLocationInputChange(e.target.value)}
                  placeholder={t('map.locPlaceholder')}
                  className="w-full bg-transparent px-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden placeholder-slate-400"
                />

                {/* Autocomplete Dropdown */}
                {locSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 glass-level-3 rounded-2xl shadow-2xl border border-white/70 dark:border-slate-800 py-1.5 z-[500]">
                    {locSuggestions.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => handleSelectLocation(loc)}
                        className="px-3.5 py-2 text-xs font-bold hover:bg-geovision-blue hover:text-white cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <span>{language === 'ar' ? loc.nameAr : loc.nameEn}</span>
                        <span className="text-[10px] opacity-75">{language === 'ar' ? loc.typeAr : loc.typeEn}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="p-2.5 rounded-2xl bg-geovision-blue text-white hover:bg-blue-600 shadow-md shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

          </form>
        </div>

        {/* Floating Tool Dock */}
        <MapToolbar />

        {/* MANDATORY: Floating Category Dock on Map Workspace */}
        <MapCategoryDock />

        {/* Active Floating Tool Panels */}
        {activeTool === 'basemap' && <BasemapGallery />}
        {activeTool === 'legend' && <MapLegend />}
        {activeTool === 'buffer' && <BufferTool />}
        {activeTool === 'sketch' && <SketchAOITool />}

        {/* Feature Inspector */}
        <IdentifyPanel />

        {/* Print Modal */}
        <PrintMapModal />

        {/* Bottom Coordinates & Scale Capsule Status Bar */}
        <div className="absolute bottom-3 left-4 rtl:left-auto rtl:right-4 z-[500] glass-level-1 px-4 py-2 rounded-2xl border border-white/70 dark:border-slate-800 text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-3 shadow-lg">
          <span>{mapCenter[0].toFixed(4)}° N, {mapCenter[1].toFixed(4)}° E</span>
          <span className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
          <span>Scale: 1:{Math.round(250000 / mapZoom)}</span>
          <span className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
          <span className="text-geovision-blue">{filteredFeatures.length} Active Layer Features</span>
        </div>

      </div>

      {/* Right Floating GeoVision AI Panel */}
      <div
        className={`relative z-20 transition-all duration-300 ${
          aiPanelOpen ? 'w-full md:w-96 lg:w-[400px] h-80 md:h-full' : 'w-0 h-0 overflow-hidden'
        } shrink-0`}
      >
        <GeoVisionPanel />
      </div>

      {/* AI Panel Toggle Button */}
      {!aiPanelOpen && (
        <button
          onClick={() => setAiPanelOpen(true)}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-[400] p-3 rounded-2xl glass-level-2 text-geovision-blue border border-white/80 dark:border-slate-800 shadow-xl hover:bg-white"
          title="Open GeoVision AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-geovision-blue" />
        </button>
      )}

    </div>
  );
};
