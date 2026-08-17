import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  Language,
  Theme,
  User,
  SmartFilterState,
  AIMessage,
  FavoriteItem,
  BasemapType,
  ActiveTool,
  GeoFeature,
  AOIResult,
  ConversationSession,
  DrawnShape,
} from '../types';
import { TRANSLATIONS } from '../data/translations';
import { GEO_FEATURES } from '../data/mockAbuDhabiData';

export type AppView = 'home' | 'map' | 'categories' | 'about' | 'help' | 'favorites' | 'history' | 'profile';

interface AppStateContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  user: User;
  setUser: (user: User) => void;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  guestPromptOpen: boolean;
  setGuestPromptOpen: (open: boolean) => void;
  feedbackModalOpen: boolean;
  setFeedbackModalOpen: (open: boolean) => void;
  printModalOpen: boolean;
  setPrintModalOpen: (open: boolean) => void;
  filterDrawerOpen: boolean;
  setFilterDrawerOpen: (open: boolean) => void;
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  drawTool: 'point' | 'circle' | 'polygon' | 'rect';
  setDrawTool: (tool: 'point' | 'circle' | 'polygon' | 'rect') => void;
  userDrawnShapes: DrawnShape[];
  setUserDrawnShapes: React.Dispatch<React.SetStateAction<DrawnShape[]>>;
  clearUserDrawnShapes: () => void;
  selectedFeature: GeoFeature | null;
  setSelectedFeature: (feature: GeoFeature | null) => void;
  activeBasemap: BasemapType;
  setActiveBasemap: (bm: BasemapType) => void;
  smartFilters: SmartFilterState;
  setSmartFilters: React.Dispatch<React.SetStateAction<SmartFilterState>>;
  updateSmartFilter: (patch: Partial<SmartFilterState>) => void;
  clearSmartFilters: () => void;
  selectedCategoryIds: string[];
  setSelectedCategoryIds: (ids: string[]) => void;
  toggleCategorySelection: (catId: string) => void;
  selectedSubcategoryIds: string[];
  setSelectedSubcategoryIds: (ids: string[]) => void;
  toggleSubcategorySelection: (subId: string) => void;
  aiMessages: AIMessage[];
  sendAIMessage: (query: string) => void;
  aiProcessing: boolean;
  aiStepState: string;
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'savedAt'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (nameEn: string) => boolean;
  mapCenter: [number, number];
  mapZoom: number;
  setMapCenterAndZoom: (center: [number, number], zoom: number) => void;
  aoiResult: AOIResult | null;
  setAoiResult: (res: AOIResult | null) => void;
  bufferRadiusKm: number;
  setBufferRadiusKm: (radius: number) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  conversationSessions: ConversationSession[];
  currentSessionId: string | null;
  t: (key: string) => string;
  filteredFeatures: GeoFeature[];
}

const DEFAULT_FILTERS: SmartFilterState = {
  categories: [],
  locationName: '',
  distanceKm: null,
  openNowOnly: false,
  minRating: null,
};

const GUEST_USER: User = {
  id: 'guest-1',
  username: 'guest',
  email: '',
  name: 'Guest User',
  isGuest: true,
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [user, setUser] = useState<User>(GUEST_USER);
  
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [guestPromptOpen, setGuestPromptOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [drawTool, setDrawTool] = useState<'point' | 'circle' | 'polygon' | 'rect'>('point');
  const [userDrawnShapes, setUserDrawnShapes] = useState<DrawnShape[]>([]);

  const clearUserDrawnShapes = () => {
    setUserDrawnShapes([]);
    showToast('All drawn shapes cleared');
  };

  const [selectedFeature, setSelectedFeature] = useState<GeoFeature | null>(null);
  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('streets');
  
  const ALL_DEFAULT_SUBCATEGORY_IDS = [
    'hospitals',
    'clinics',
    'pharmacies',
    'schools',
    'universities',
    'training',
    'bus_stations',
    'taxi_hubs',
    'parking',
    'tamm_centers',
    'municipalities',
    'registries',
    'public_parks',
    'beaches',
    'sports_fields',
    'power_substations',
    'recycling',
  ];

  const [smartFilters, setSmartFilters] = useState<SmartFilterState>(DEFAULT_FILTERS);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(['healthcare']);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<string[]>(ALL_DEFAULT_SUBCATEGORY_IDS);

  const [mapCenter, setMapCenter] = useState<[number, number]>([24.4539, 54.3773]);
  const [mapZoom, setMapZoom] = useState<number>(12);

  const [aoiResult, setAoiResult] = useState<AOIResult | null>(null);
  const [bufferRadiusKm, setBufferRadiusKm] = useState<number>(5);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 'fav-1',
      type: 'location',
      nameEn: 'Khalifa City Sector 1',
      nameAr: 'مدينة خليفة القطاع 1',
      categoryEn: 'District',
      categoryAr: 'حي سكني',
      lat: 24.4217,
      lng: 54.5828,
      savedAt: '2026-08-14',
    },
    {
      id: 'fav-2',
      type: 'dataset',
      nameEn: 'Abu Dhabi Hospitals & Trauma Centers',
      nameAr: 'مستشفيات أبوظبي ومراكز الطوارئ',
      categoryEn: 'Healthcare',
      categoryAr: 'الرعاية الصحية',
      savedAt: '2026-08-13',
    },
  ]);

  const [conversationSessions] = useState<ConversationSession[]>([]);
  const [currentSessionId] = useState<string | null>(null);

  // Initial welcome message from GeoVision AI
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      textEn: 'Hello! I am GeoVision, your AI spatial assistant for Abu Dhabi. Ask me anything about location services, healthcare, schools, or spatial planning.',
      textAr: 'مرحباً بك! أنا مساعد GeoVision الذكي للخرائط في أبوظبي. اسألني عن الخدمات والمستشفيات والمدارس والتحليل المكاني.',
      timestamp: 'Just now',
      recommendationsEn: [
        'Show hospitals within 5 km of Khalifa City',
        'Find schools near Yas Island',
        'Show public parks in Abu Dhabi',
        'Analyze government services near Al Reem',
      ],
      recommendationsAr: [
        'عرض المستشفيات على بعد 5 كم من مدينة خليفة',
        'البحث عن المدارس القريبة من جزيرة ياس',
        'عرض الحدائق العامة في أبوظبي',
        'تحليل الخدمات الحكومية بالقرب من جزيرة الريم',
      ],
      trustLevel: 'authoritative',
    },
  ]);

  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiStepState, setAiStepState] = useState('');

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Translation Helper
  const t = (key: string): string => {
    return TRANSLATIONS[language][key] || key;
  };

  // Dark mode side effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // RTL direction side effect
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }, [language]);

  // Category toggle logic
  const toggleCategorySelection = (catId: string) => {
    // Clear smartFilter categories override so user pill selection immediately applies to the map
    if (smartFilters.categories.length > 0) {
      setSmartFilters(prev => ({ ...prev, categories: [] }));
    }

    let updatedCatIds: string[];
    if (selectedCategoryIds.includes(catId)) {
      updatedCatIds = selectedCategoryIds.filter(id => id !== catId);
    } else {
      updatedCatIds = [...selectedCategoryIds, catId];
    }
    setSelectedCategoryIds(updatedCatIds);

    // Sync subcategories for selected category
    const categorySubIds: Record<string, string[]> = {
      healthcare: ['hospitals', 'clinics', 'pharmacies'],
      education: ['schools', 'universities', 'training'],
      transport: ['bus_stations', 'taxi_hubs', 'parking'],
      government: ['tamm_centers', 'municipalities', 'registries'],
      parks: ['public_parks', 'beaches', 'sports_fields'],
      utilities: ['power_substations', 'recycling'],
    };

    if (updatedCatIds.includes(catId) && categorySubIds[catId]) {
      const mergedSubs = Array.from(new Set([...selectedSubcategoryIds, ...categorySubIds[catId]]));
      setSelectedSubcategoryIds(mergedSubs);
    }
  };

  const toggleSubcategorySelection = (subId: string) => {
    if (selectedSubcategoryIds.includes(subId)) {
      setSelectedSubcategoryIds(selectedSubcategoryIds.filter(id => id !== subId));
    } else {
      setSelectedSubcategoryIds([...selectedSubcategoryIds, subId]);
    }
  };

  const updateSmartFilter = (patch: Partial<SmartFilterState>) => {
    setSmartFilters(prev => ({ ...prev, ...patch }));
    showToast(t('toast.filterApplied'));
  };

  const clearSmartFilters = () => {
    setSmartFilters(DEFAULT_FILTERS);
  };

  const setMapCenterAndZoom = (center: [number, number], zoom: number) => {
    setMapCenter(center);
    setMapZoom(zoom);
  };

  // Favorites Management
  const addFavorite = (item: Omit<FavoriteItem, 'id' | 'savedAt'>) => {
    if (user.isGuest) {
      setGuestPromptOpen(true);
      return;
    }
    const newFav: FavoriteItem = {
      ...item,
      id: `fav-${Date.now()}`,
      savedAt: new Date().toISOString().split('T')[0],
    };
    setFavorites([newFav, ...favorites]);
    showToast(t('toast.favSaved'));
  };

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
    showToast(t('toast.favRemoved'));
  };

  const isFavorite = (nameEn: string) => {
    return favorites.some(f => f.nameEn === nameEn);
  };

  // Filtered Features computation based on category selection, subcategory checklist & smart filters
  const filteredFeatures = GEO_FEATURES.filter(feat => {
    // 1. Category match:
    // If selectedCategoryIds has user choices, use them. Otherwise fallback to smartFilters.categories.
    const activeCats = selectedCategoryIds.length > 0 
      ? selectedCategoryIds 
      : (smartFilters.categories.length > 0 ? smartFilters.categories : []);

    if (activeCats.length > 0 && !activeCats.includes(feat.category)) {
      return false;
    }

    // 2. Subcategory checklist match
    if (feat.subcategory && selectedSubcategoryIds.length > 0 && !selectedSubcategoryIds.includes(feat.subcategory)) {
      return false;
    }

    // 3. Distance filter
    if (smartFilters.distanceKm !== null && feat.distanceKm !== undefined) {
      if (feat.distanceKm > smartFilters.distanceKm) return false;
    }

    // 4. Rating filter
    if (smartFilters.minRating !== null && feat.rating !== undefined) {
      if (feat.rating < smartFilters.minRating) return false;
    }

    return true;
  });

  // Natural Language AI Processing Simulation
  const sendAIMessage = (query: string) => {
    if (!query.trim()) return;

    // Add user message immediately
    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      textEn: query,
      textAr: query,
      timestamp: 'Just now',
    };

    setAiMessages(prev => [...prev, userMsg]);
    setAiProcessing(true);

    // Step 1: NLU parsing
    setAiStepState(t('ai.understanding'));

    setTimeout(() => {
      // Step 2: Spatial query
      setAiStepState(t('ai.querying'));

      setTimeout(() => {
        // Step 3: Layer update & Response generation
        setAiStepState(t('ai.updatingMap'));

        setTimeout(() => {
          setAiProcessing(false);
          setAiStepState('');

          const lower = query.toLowerCase();

          // Intelligent response matching based on query keywords
          let responseEn = '';
          let responseAr = '';
          let matchedFeats = GEO_FEATURES;
          let newCenter: [number, number] = [24.4217, 54.5828]; // Khalifa City default
          let newZoom = 14;
          let appliedFilt: Partial<SmartFilterState> = {};
          let recsEn: string[] = [];
          let recsAr: string[] = [];

          if (lower.includes('hospital') || lower.includes('khalifa') || query.includes('مستشفيات') || query.includes('خليفة')) {
            responseEn = 'I found 5 authoritative healthcare facilities within 5 km of Khalifa City and updated the map workspace accordingly.';
            responseAr = 'عثرت على 5 مستشفيات ومراكز صحية موثوقة ضمن نطاق 5 كم من مدينة خليفة وقمت بتحديث الخريطة.';
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'healthcare');
            newCenter = [24.4217, 54.5828];
            newZoom = 14;
            appliedFilt = {
              categories: ['healthcare'],
              locationName: 'Khalifa City',
              distanceKm: 5,
            };
            recsEn = [
              'Which ones are close to schools?',
              'Show 2 km buffer around SSMC Hospital',
              'Compare healthcare with Yas Island',
              'Print this map view',
            ];
            recsAr = [
              'أيها قريب من المدارس؟',
              'عرض نطاق 2 كم حول مستشفى الشيخ شخبوط',
              'مقارنة الخدمات الصحية مع جزيرة ياس',
              'طباعة عرض الخريطة الحالي',
            ];
            setSelectedCategoryIds(['healthcare']);
            setSmartFilters(prev => ({
              ...prev,
              categories: ['healthcare'],
              locationName: 'Khalifa City',
              distanceKm: 5,
            }));
          } else if (lower.includes('school') || lower.includes('close') || query.includes('مدارس') || query.includes('قريب')) {
            responseEn = 'Context retained: Overlaying educational facilities near the selected healthcare nodes. 3 schools are within 1.5 km of Khalifa City hospitals.';
            responseAr = 'تم الاحتفاظ بالسياق: إظهار المدارس والأكاديميات بالقرب من المستشفيات المحددة. توجد 3 مدارس على بعد 1.5 كم من مستشفيات مدينة خليفة.';
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'healthcare' || f.category === 'education');
            newCenter = [24.4217, 54.5828];
            newZoom = 14;
            appliedFilt = {
              categories: ['healthcare', 'education'],
              locationName: 'Khalifa City',
              distanceKm: 5,
            };
            recsEn = [
              'Save this multi-layer view to Favorites',
              'Analyze area with Sketch AOI',
              'Export PDF Map Report',
            ];
            recsAr = [
              'حفظ عرض الطبقات المزدوج في المفضلة',
              'تحليل المنطقة برسم m',
              'تصدير تقرير الخريطة PDF',
            ];
            setSelectedCategoryIds(['healthcare', 'education']);
          } else if (lower.includes('park') || lower.includes('recreation') || query.includes('حدائق')) {
            responseEn = 'Displayed public parks and green leisure zones across Abu Dhabi including Khalifa Park, Reem Central Park, and Umm Al Emarat Park.';
            responseAr = 'تم عرض الحدائق العامة والمساحات الخضراء في أبوظبي بما في ذلك حديقة الريم سنترال وحديقة أم الإمارات.';
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'parks');
            newCenter = [24.4552, 54.3821];
            newZoom = 13;
            appliedFilt = { categories: ['parks'] };
            recsEn = ['Find nearby bus stations', 'Filter by Open 24 Hours'];
            recsAr = ['البحث عن محطات الحافلات القريبة', 'تصفية حسب مفتوح 24 ساعة'];
            setSelectedCategoryIds(['parks']);
          } else {
            responseEn = `GeoVision interpreted your request for "${query}". Displaying matching Abu Dhabi geospatial data points.`;
            responseAr = `قام GeoVision بتحليل طلبك المكانية المتعلق بـ "${query}". جاري عرض النقاط الجغرافية المطابقة.`;
            matchedFeats = GEO_FEATURES;
            recsEn = ['Filter by Khalifa City', 'Create 5 km Buffer', 'Print Map'];
            recsAr = ['تصفية حسب مدينة خليفة', 'إنشاء نطاق 5 كم', 'طباعة الخريطة'];
          }

          setMapCenter(newCenter);
          setMapZoom(newZoom);
          if (currentView !== 'map') {
            setCurrentView('map');
          }

          const aiRespMsg: AIMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            textEn: responseEn,
            textAr: responseAr,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            recommendationsEn: recsEn,
            recommendationsAr: recsAr,
            datasetChips: appliedFilt.categories || [],
            appliedFilters: appliedFilt,
            matchedFeatures: matchedFeats,
            trustLevel: 'authoritative',
            mapAction: {
              type: 'zoom_and_filter',
              locationName: appliedFilt.locationName,
              center: newCenter,
              zoom: newZoom,
              bufferKm: appliedFilt.distanceKm || undefined,
            },
          };

          setAiMessages(prev => [...prev, aiRespMsg]);
        }, 600);
      }, 500);
    }, 600);
  };

  return (
    <AppStateContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        currentView,
        setCurrentView,
        user,
        setUser,
        loginModalOpen,
        setLoginModalOpen,
        guestPromptOpen,
        setGuestPromptOpen,
        feedbackModalOpen,
        setFeedbackModalOpen,
        printModalOpen,
        setPrintModalOpen,
        filterDrawerOpen,
        setFilterDrawerOpen,
        activeTool,
        setActiveTool,
        drawTool,
        setDrawTool,
        userDrawnShapes,
        setUserDrawnShapes,
        clearUserDrawnShapes,
        selectedFeature,
        setSelectedFeature,
        activeBasemap,
        setActiveBasemap,
        smartFilters,
        setSmartFilters,
        updateSmartFilter,
        clearSmartFilters,
        selectedCategoryIds,
        setSelectedCategoryIds,
        toggleCategorySelection,
        selectedSubcategoryIds,
        setSelectedSubcategoryIds,
        toggleSubcategorySelection,
        aiMessages,
        sendAIMessage,
        aiProcessing,
        aiStepState,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        mapCenter,
        mapZoom,
        setMapCenterAndZoom,
        aoiResult,
        setAoiResult,
        bufferRadiusKm,
        setBufferRadiusKm,
        toastMessage,
        showToast,
        conversationSessions,
        currentSessionId,
        t,
        filteredFeatures,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
