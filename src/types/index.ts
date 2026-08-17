export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  icon: string;
  descriptionEn: string;
  descriptionAr: string;
  count: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  nameEn: string;
  nameAr: string;
  count: number;
  parentId: string;
}

export interface GeoFeature {
  id: string;
  nameEn: string;
  nameAr: string;
  category: string; // e.g. 'healthcare', 'education', etc.
  subcategory: string; // e.g. 'hospitals', 'clinics', 'schools'
  lat: number;
  lng: number;
  addressEn: string;
  addressAr: string;
  rating?: number;
  openStatusEn?: string;
  openStatusAr?: string;
  phone?: string;
  website?: string;
  distanceKm?: number;
  metadata?: Record<string, string | number>;
  isAuthoritative?: boolean;
}

export interface SmartFilterState {
  categories: string[];
  locationName: string;
  distanceKm: number | null;
  openNowOnly: boolean;
  minRating: number | null;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  textEn: string;
  textAr: string;
  timestamp: string;
  recommendationsEn?: string[];
  recommendationsAr?: string[];
  datasetChips?: string[];
  appliedFilters?: Partial<SmartFilterState>;
  matchedFeatures?: GeoFeature[];
  trustLevel?: 'authoritative' | 'external';
  mapAction?: {
    type: 'zoom_and_filter' | 'highlight' | 'buffer' | 'aoi_summary';
    locationName?: string;
    center?: [number, number];
    zoom?: number;
    bufferKm?: number;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  isGuest: boolean;
}

export interface FavoriteItem {
  id: string;
  type: 'location' | 'dataset' | 'search';
  nameEn: string;
  nameAr: string;
  categoryEn?: string;
  categoryAr?: string;
  lat?: number;
  lng?: number;
  savedAt: string;
}

export interface ConversationSession {
  id: string;
  titleEn: string;
  titleAr: string;
  date: string;
  queryCount: number;
  messages: AIMessage[];
}

export type BasemapType = 'streets' | 'light' | 'satellite';

export type ActiveTool = 'none' | 'identify' | 'basemap' | 'legend' | 'buffer' | 'print' | 'sketch' | 'coordinates';

export interface LocationSearchResult {
  id: string;
  nameEn: string;
  nameAr: string;
  typeEn: string;
  typeAr: string;
  lat: number;
  lng: number;
  zoom: number;
}

export interface AOIResult {
  bounds: [number, number][];
  totalAreaKm2: number;
  breakdown: {
    category: string;
    count: number;
    nameEn: string;
    nameAr: string;
  }[];
  insightEn: string;
  insightAr: string;
  recommendationsEn: string[];
  recommendationsAr: string[];
}

export interface DrawnShape {
  id: string;
  type: 'point' | 'circle' | 'polygon' | 'rect';
  lat: number;
  lng: number;
  radius?: number;
  bounds?: [[number, number], [number, number]];
  points?: [number, number][];
  label?: string;
}
