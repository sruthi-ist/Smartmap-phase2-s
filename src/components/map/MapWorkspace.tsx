import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useAppState } from '../../context/AppStateContext';
import type { DrawnShape } from '../../types';
import { MapToolbar } from './MapToolbar';
import { IdentifyPanel } from './IdentifyPanel';
import { BasemapGallery } from './BasemapGallery';
import { MapLegend } from './MapLegend';
import { BufferTool } from './BufferTool';
import { PrintMapModal } from './PrintMapModal';
import { SketchAOITool } from './SketchAOITool';
import { GeoVisionPanel } from '../ai/GeoVisionPanel';
import { SmartFilterPanel } from '../filters/SmartFilterPanel';
import { createGeoVisionMarkerIcon, getCategoryColor } from '../../utils/markerUtils';
import { Sparkles, X, Layers, ChevronUp } from 'lucide-react';

export const MapWorkspace: React.FC = () => {
  const {
    language,
    activeBasemap,
    activeTool,
    setSelectedFeature,
    mapCenter,
    mapZoom,
    filteredFeatures,
    bufferRadiusKm,
    aoiResult,
    showToast,
    filterDrawerOpen,
    setFilterDrawerOpen,
    drawTool,
    userDrawnShapes,
    setUserDrawnShapes,
    sendAIMessage,
  } = useAppState();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const drawnLayersGroupRef = useRef<L.LayerGroup | null>(null);
  const bufferCircleRef = useRef<L.Circle | null>(null);
  const aoiPolygonRef = useRef<L.Polygon | null>(null);

  const [aiPanelOpen, setAiPanelOpen] = useState(true);

  // Coordinate Format Dropdown State & Ref
  const [coordFormat, setCoordFormat] = useState<'DD' | 'DDM' | 'DMS' | 'UTM'>('DD');
  const [coordMenuOpen, setCoordMenuOpen] = useState(false);
  const coordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (coordRef.current && !coordRef.current.contains(e.target as Node)) {
        setCoordMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCoordinates = (lat: number, lng: number, fmt: 'DD' | 'DDM' | 'DMS' | 'UTM'): string => {
    const absLat = Math.abs(lat);
    const absLng = Math.abs(lng);
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';

    if (fmt === 'DDM') {
      const latDeg = Math.floor(absLat);
      const latMin = ((absLat - latDeg) * 60).toFixed(3);
      const lngDeg = Math.floor(absLng);
      const lngMin = ((absLng - lngDeg) * 60).toFixed(3);
      return `${latDeg}° ${latMin}' ${latDir}, ${lngDeg}° ${lngMin}' ${lngDir}`;
    }

    if (fmt === 'DMS') {
      const latDeg = Math.floor(absLat);
      const latMinTotal = (absLat - latDeg) * 60;
      const latMin = Math.floor(latMinTotal);
      const latSec = ((latMinTotal - latMin) * 60).toFixed(1);

      const lngDeg = Math.floor(absLng);
      const lngMinTotal = (absLng - lngDeg) * 60;
      const lngMin = Math.floor(lngMinTotal);
      const lngSec = ((lngMinTotal - lngMin) * 60).toFixed(1);

      return `${latDeg}° ${latMin}' ${latSec}" ${latDir}, ${lngDeg}° ${lngMin}' ${lngSec}" ${lngDir}`;
    }

    if (fmt === 'UTM') {
      const easting = Math.round(233750 + (lng - 54.3773) * 92000);
      const northing = Math.round(2706300 + (lat - 24.4539) * 110500);
      return `39R ${easting}mE ${northing}mN`;
    }

    return `${lat.toFixed(4)}° ${latDir}, ${lng.toFixed(4)}° ${lngDir}`;
  };

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

  // Render Selected Focused Area Ring geometry for AI & Map Interactions
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (bufferCircleRef.current) {
      bufferCircleRef.current.remove();
      bufferCircleRef.current = null;
    }

    if (bufferRadiusKm && bufferRadiusKm > 0) {
      const circle = L.circle(mapCenter, {
        radius: bufferRadiusKm * 1000,
        color: '#215A9E',
        fillColor: '#215A9E',
        fillOpacity: 0.14,
        weight: 2.5,
        dashArray: '6, 6',
      }).addTo(mapInstanceRef.current);

      circle.bindTooltip(
        `<div style="font-family:sans-serif;font-weight:900;font-size:11px;color:#063360;padding:2px 6px;">
          📍 Selected Focused Area (${bufferRadiusKm} km)
        </div>`,
        { permanent: false, direction: 'top', className: 'glass-tooltip' }
      );

      bufferCircleRef.current = circle;
    }
  }, [bufferRadiusKm, mapCenter]);

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

  const tempShapeRef = useRef<L.Layer | null>(null);
  const tempPointsRef = useRef<L.LatLng[]>([]);
  const isDrawingRef = useRef<boolean>(false);
  const startLatLngRef = useRef<L.LatLng | null>(null);

  // Handle Freehand Interactive Map Drawing for All Tools (Circle, Rect, Polygon, Point)
  useEffect(() => {
    if (!mapInstanceRef.current || activeTool !== 'sketch') {
      if (tempShapeRef.current) {
        tempShapeRef.current.remove();
        tempShapeRef.current = null;
      }
      isDrawingRef.current = false;
      startLatLngRef.current = null;
      tempPointsRef.current = [];
      return;
    }

    const map = mapInstanceRef.current;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;

      // 1. POINT TOOL
      if (drawTool === 'point') {
        const shapeId = `shape-${Date.now()}`;
        const newShape: DrawnShape = {
          id: shapeId,
          type: 'point',
          lat: latlng.lat,
          lng: latlng.lng,
          radius: 1000,
        };
        setUserDrawnShapes((prev) => [...prev, newShape]);
        showToast(`Point dropped at ${latlng.lat.toFixed(3)}°N, ${latlng.lng.toFixed(3)}°E`);
        setAiPanelOpen(true);
        sendAIMessage(`Analyze drawn Point Marker at ${latlng.lat.toFixed(3)}°N, ${latlng.lng.toFixed(3)}°E`);
        return;
      }

      // 2. CIRCLE TOOL (Click 1 sets center, MouseMove expands radius, Click 2 fixes size)
      if (drawTool === 'circle') {
        if (!isDrawingRef.current || !startLatLngRef.current) {
          isDrawingRef.current = true;
          startLatLngRef.current = latlng;
          const tempCircle = L.circle(latlng, {
            radius: 200,
            color: '#176BFF',
            fillColor: '#176BFF',
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '6, 6',
          }).addTo(map);
          tempShapeRef.current = tempCircle;
          showToast('Move cursor to adjust circle radius size, then click to complete');
        } else {
          const center = startLatLngRef.current;
          const radiusMeters = center.distanceTo(latlng);
          const radiusKm = Math.max(0.5, radiusMeters / 1000);

          if (tempShapeRef.current) {
            tempShapeRef.current.remove();
            tempShapeRef.current = null;
          }
          isDrawingRef.current = false;
          startLatLngRef.current = null;

          const shapeId = `shape-${Date.now()}`;
          const newShape: DrawnShape = {
            id: shapeId,
            type: 'circle',
            lat: center.lat,
            lng: center.lng,
            radius: radiusMeters,
          };
          setUserDrawnShapes((prev) => [...prev, newShape]);
          showToast(`Created Circle Buffer: ${radiusKm.toFixed(1)} km radius`);
          setAiPanelOpen(true);
          sendAIMessage(`Analyze drawn Circle Buffer (${radiusKm.toFixed(1)} km radius)`);
        }
        return;
      }

      // 3. RECTANGLE TOOL (Click 1 sets corner 1, MouseMove expands box, Click 2 fixes box)
      if (drawTool === 'rect') {
        if (!isDrawingRef.current || !startLatLngRef.current) {
          isDrawingRef.current = true;
          startLatLngRef.current = latlng;
          const bounds = L.latLngBounds(latlng, latlng);
          const tempRect = L.rectangle(bounds, {
            color: '#10B981',
            fillColor: '#10B981',
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '6, 6',
          }).addTo(map);
          tempShapeRef.current = tempRect;
          showToast('Move cursor to adjust rectangle size, then click to complete');
        } else {
          const p1 = startLatLngRef.current;
          const p2 = latlng;
          const bounds = L.latLngBounds(p1, p2);
          const center = bounds.getCenter();

          if (tempShapeRef.current) {
            tempShapeRef.current.remove();
            tempShapeRef.current = null;
          }
          isDrawingRef.current = false;
          startLatLngRef.current = null;

          const shapeId = `shape-${Date.now()}`;
          const newShape: DrawnShape = {
            id: shapeId,
            type: 'rect',
            lat: center.lat,
            lng: center.lng,
            radius: p1.distanceTo(p2) / 2,
            bounds: [
              [bounds.getSouth(), bounds.getWest()],
              [bounds.getNorth(), bounds.getEast()],
            ],
          };
          setUserDrawnShapes((prev) => [...prev, newShape]);
          showToast('Created Rectangle Bounding Box');
          setAiPanelOpen(true);
          sendAIMessage(`Analyze drawn Rectangle Bounding Box`);
        }
        return;
      }

      // 4. POLYGON TOOL (Click points to add vertices, double click to finish)
      if (drawTool === 'polygon') {
        tempPointsRef.current.push(latlng);
        showToast(`Added vertex ${tempPointsRef.current.length}. Double-click when finished!`);

        if (tempPointsRef.current.length >= 2) {
          if (tempShapeRef.current) {
            tempShapeRef.current.remove();
          }
          const tempPoly = L.polygon(tempPointsRef.current, {
            color: '#8B5CF6',
            fillColor: '#8B5CF6',
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '6, 6',
          }).addTo(map);
          tempShapeRef.current = tempPoly;
        }
      }
    };

    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      if (!isDrawingRef.current || !startLatLngRef.current) return;
      const latlng = e.latlng;

      if (drawTool === 'circle' && tempShapeRef.current && tempShapeRef.current instanceof L.Circle) {
        const radiusMeters = Math.max(100, startLatLngRef.current.distanceTo(latlng));
        tempShapeRef.current.setRadius(radiusMeters);
      } else if (drawTool === 'rect' && tempShapeRef.current && tempShapeRef.current instanceof L.Rectangle) {
        const bounds = L.latLngBounds(startLatLngRef.current, latlng);
        tempShapeRef.current.setBounds(bounds);
      }
    };

    const handleDblClick = () => {
      if (drawTool === 'polygon' && tempPointsRef.current.length >= 3) {
        const points = [...tempPointsRef.current];
        const latSum = points.reduce((sum, p) => sum + p.lat, 0);
        const lngSum = points.reduce((sum, p) => sum + p.lng, 0);
        const centerLat = latSum / points.length;
        const centerLng = lngSum / points.length;

        if (tempShapeRef.current) {
          tempShapeRef.current.remove();
          tempShapeRef.current = null;
        }
        tempPointsRef.current = [];

        const shapeId = `shape-${Date.now()}`;
        const newShape: DrawnShape = {
          id: shapeId,
          type: 'polygon',
          lat: centerLat,
          lng: centerLng,
          radius: 2000,
          points: points.map((p) => [p.lat, p.lng] as [number, number]),
        };
        setUserDrawnShapes((prev) => [...prev, newShape]);
        showToast('Created Polygon Boundary AOI');
        setAiPanelOpen(true);
        sendAIMessage(`Analyze drawn Polygon Boundary AOI`);
      }
    };

    map.on('click', handleMapClick);
    map.on('mousemove', handleMouseMove);
    map.on('dblclick', handleDblClick);

    return () => {
      map.off('click', handleMapClick);
      map.off('mousemove', handleMouseMove);
      map.off('dblclick', handleDblClick);
    };
  }, [activeTool, drawTool, setUserDrawnShapes, sendAIMessage, showToast]);



  // Invalidate Leaflet Map Size on AI Panel toggle and window resize
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      const timer1 = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
      const timer2 = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 350);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [aiPanelOpen]);

  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-screen pt-[84px] sm:pt-[88px] overflow-hidden flex flex-col md:flex-row bg-spatial-canvas">
      
      {/* Main 90% Visual Canvas Map */}
      <div className="relative flex-1 h-full w-full overflow-hidden">
        
        {/* Leaflet Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Tool Dock */}
        <MapToolbar />

        {/* Floating Data & Filter Drawer */}
        {filterDrawerOpen && (
          <div className="absolute top-4 sm:top-6 left-[72px] sm:left-[80px] z-[600] w-64 sm:w-72 h-[408px] max-h-[calc(100vh-160px)] glass-level-3 rounded-3xl p-3 sm:p-3.5 shadow-2xl border border-white/80 dark:border-slate-800 animate-slide-in flex flex-col overflow-hidden pointer-events-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 shrink-0">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-geovision-blue" />
                GIS Categories
              </h3>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <SmartFilterPanel />
          </div>
        )}

        {/* Active Floating Tool Panels */}
        {activeTool === 'basemap' && <BasemapGallery />}
        {activeTool === 'legend' && <MapLegend />}
        {activeTool === 'buffer' && <BufferTool />}
        {activeTool === 'sketch' && <SketchAOITool />}

        {/* Feature Inspector */}
        <IdentifyPanel />

        {/* Print Modal */}
        <PrintMapModal />

        {/* Bottom Coordinates & Scale Capsule Status Bar with Format Radio Selector */}
        <div className="hidden sm:block absolute bottom-3 left-16 sm:left-20 rtl:left-auto rtl:right-16 sm:rtl:right-20 z-[600]" ref={coordRef}>
          
          {/* Radio Button Popover Dropdown (Matches Reference Image) */}
          {coordMenuOpen && (
            <div className="absolute bottom-full left-0 mb-2.5 z-[9999] w-44 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/90 shadow-2xl shadow-slate-950/20 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1 pb-1 border-b border-slate-100 dark:border-slate-800">
                Coordinate Format
              </div>
              {[
                { id: 'DD', label: 'DD (Decimal Deg)' },
                { id: 'DDM', label: 'DDM (Deg Dec Min)' },
                { id: 'DMS', label: 'DMS (Deg Min Sec)' },
                { id: 'UTM', label: 'UTM (Grid Proj)' },
              ].map((opt) => {
                const isSelected = coordFormat === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setCoordFormat(opt.id as any);
                      setCoordMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        isSelected
                          ? 'border-2 border-geovision-blue'
                          : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-geovision-blue" />}
                    </div>
                    <span className={`text-xs ${isSelected ? 'font-black text-geovision-blue dark:text-blue-300' : 'font-extrabold text-slate-700 dark:text-slate-300'}`}>
                      {opt.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Status Bar Capsule */}
          <div className="flex items-center gap-3 glass-level-1 px-4 py-2 rounded-2xl border border-white/70 dark:border-slate-800 text-[11px] font-black text-slate-800 dark:text-slate-200 shadow-lg">
            
            {/* Format Dropdown Button */}
            <button
              type="button"
              onClick={() => setCoordMenuOpen(!coordMenuOpen)}
              className="flex items-center gap-1 font-black text-slate-900 dark:text-white hover:text-geovision-blue dark:hover:text-geovision-blue cursor-pointer"
            >
              <span>{coordFormat}</span>
              <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-200 ${coordMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Coordinates Display Value */}
            <span className="font-extrabold">{formatCoordinates(mapCenter[0], mapCenter[1], coordFormat)}</span>

            <span className="h-3 w-px bg-slate-300 dark:bg-slate-700" />

            {/* Scale */}
            <span>Scale: 1:{Math.round(250000 / mapZoom)}</span>

          </div>

        </div>

      </div>

      {/* Original Right Side Docked GeoVision AI Panel */}
      <div
        className={`transition-all duration-300 ${
          aiPanelOpen
            ? 'fixed md:relative inset-x-0 bottom-0 top-auto z-[700] md:z-20 h-[65vh] max-h-[500px] md:max-h-none md:h-full w-full md:w-[430px] lg:w-[470px] rounded-t-3xl md:rounded-none shadow-2xl border-t md:border-t-0 border-slate-200 dark:border-slate-800'
            : 'w-0 h-0 overflow-hidden hidden'
        } shrink-0`}
      >
        <GeoVisionPanel onClose={() => setAiPanelOpen(false)} />
      </div>

      {/* AI Panel Toggle Button - Floating Pill at Bottom Right */}
      {!aiPanelOpen && (
        <button
          onClick={() => setAiPanelOpen(true)}
          className="absolute bottom-3 sm:bottom-4 right-4 rtl:right-auto rtl:left-4 z-[600] flex items-center gap-2 px-4 py-2.5 rounded-full bg-geovision-blue text-white shadow-xl shadow-blue-500/35 hover:bg-blue-600 active:scale-95 transition-all cursor-pointer border border-white/30 text-xs font-black tracking-tight"
          title="Open GeoVision AI Assistant"
        >
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span>{language === 'ar' ? 'مساعد GeoVision AI' : 'GeoVision AI'}</span>
        </button>
      )}

    </div>
  );
};
