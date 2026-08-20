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
  ConversationContext,
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
  setAiMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>;
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
  deleteSession: (id: string) => void;
  clearAllHistory: () => void;
  loadSession: (session: ConversationSession) => void;
  conversationContext: ConversationContext;
  resetConversationContext: () => void;
  startNewConversation: () => void;
  userLocation: [number, number] | null;
  setUserLocation: (loc: [number, number] | null) => void;
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
  const [smartFilters, setSmartFilters] = useState<SmartFilterState>(DEFAULT_FILTERS);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<string[]>([]);

  const [mapCenter, setMapCenter] = useState<[number, number]>([24.4539, 54.3773]);
  const [mapZoom, setMapZoom] = useState<number>(12);

  const [aoiResult, setAoiResult] = useState<AOIResult | null>(null);
  const [bufferRadiusKm, setBufferRadiusKm] = useState<number>(0);

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

  const DEFAULT_CONVERSATION_CONTEXT: ConversationContext = {
    language: 'en',
    currentIntent: null,
    category: null,
    featureType: null,
    location: null,
    resolvedLocation: null,
    radius: null,
    radiusUnit: 'km',
    attributes: {},
    resultCount: 0,
    currentResults: [],
    previousResults: [],
    selectedFeature: null,
    selectedCategories: [],
    selectedDatasets: [],
    activeFilters: [],
    mapExtent: null,
    userLocation: null,
    locationPermission: 'unknown',
    pendingClarification: null,
    lastUserQuery: null,
    lastAIResponse: null,
  };

  const [conversationContext, setConversationContext] = useState<ConversationContext>(DEFAULT_CONVERSATION_CONTEXT);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const INITIAL_WELCOME_MESSAGE: AIMessage = {
    id: 'msg-welcome',
    sender: 'ai',
    textEn: 'Hello! I am GeoVision, your AI spatial assistant for Abu Dhabi. Ask me anything about location services, healthcare, schools, or spatial planning.',
    textAr: 'مرحباً بك! أنا مساعد GeoVision الذكي للخرائط في أبوظبي. اسألني عن الخدمات والمستشفيات والمدارس والتحليل المكاني.',
    timestamp: 'Just now',
    recommendationsEn: [
      'Show hospitals in Khalifa City',
      'Find schools near Yas Island',
      'Show public parks in Abu Dhabi',
      'Analyze government services near Al Reem',
      'Explore Available Data',
    ],
    recommendationsAr: [
      'عرض المستشفيات في مدينة خليفة',
      'البحث عن المدارس القريبة من جزيرة ياس',
      'عرض الحدائق العامة في أبوظبي',
      'تحليل الخدمات الحكومية بالقرب من جزيرة الريم',
      'استكشاف البيانات المتاحة',
    ],
    trustLevel: 'authoritative',
  };

  const [conversationSessions, setConversationSessions] = useState<ConversationSession[]>(() => {
    try {
      const saved = localStorage.getItem('geovision_chat_sessions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'sess-default-1',
        titleEn: 'Schools in Zayed City within 5 km',
        titleAr: 'مدارس في مدينة زايد على بعد 5 كم',
        date: 'Today • 02:15 PM',
        queryCount: 3,
        messages: [],
      },
      {
        id: 'sess-default-2',
        titleEn: 'Hospitals in Abu Dhabi (Government)',
        titleAr: 'المستشفيات في أبوظبي (حكومية)',
        date: 'Today • 11:30 AM',
        queryCount: 4,
        messages: [],
      },
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(`sess-${Date.now()}`);

  useEffect(() => {
    try {
      localStorage.setItem('geovision_chat_sessions', JSON.stringify(conversationSessions));
    } catch (e) {
      console.error(e);
    }
  }, [conversationSessions]);

  const resetConversationContext = () => {
    setConversationContext(DEFAULT_CONVERSATION_CONTEXT);
    setSelectedCategoryIds([]);
    setSelectedSubcategoryIds([]);
    setSmartFilters(DEFAULT_FILTERS);
    setSelectedFeature(null);
    setBufferRadiusKm(0);
    showToast(language === 'ar' ? 'تمت إعادة تعيين محادثة البحث' : 'Conversation context reset');
  };

  const startNewConversation = () => {
    const newId = `sess-${Date.now()}`;
    setCurrentSessionId(newId);
    setAiMessages([INITIAL_WELCOME_MESSAGE]);
    setConversationContext(DEFAULT_CONVERSATION_CONTEXT);
    setSelectedCategoryIds([]);
    setSelectedSubcategoryIds([]);
    setSmartFilters(DEFAULT_FILTERS);
    setSelectedFeature(null);
    setBufferRadiusKm(0);
    showToast(language === 'ar' ? 'بدأت محادثة جديدة' : 'Started new conversation');
  };

  const deleteSession = (id: string) => {
    setConversationSessions(prev => prev.filter(s => s.id !== id));
    showToast(language === 'ar' ? 'تم حذف المحادثة من السجل' : 'Session removed from history');
  };

  const clearAllHistory = () => {
    setConversationSessions([]);
    try {
      localStorage.removeItem('geovision_chat_sessions');
    } catch (e) {}
    showToast(language === 'ar' ? 'تم مسح السجل بالكامل' : 'All conversation history cleared');
  };

  const loadSession = (session: ConversationSession) => {
    if (session.messages && session.messages.length > 0) {
      setAiMessages(session.messages);
    }
    setCurrentSessionId(session.id);
    setCurrentView('map');
    showToast(language === 'ar' ? `استئناف الجلسة: ${session.titleAr}` : `Resumed session: ${session.titleEn}`);
  };

  // Initial welcome message from GeoVision AI
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([INITIAL_WELCOME_MESSAGE]);

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
      education: ['charter_schools', 'nurseries', 'pod_schools', 'public_schools', 'private_schools', 'universities'],
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
    // Active categories: either selectedCategoryIds or smartFilters.categories
    const activeCats = selectedCategoryIds.length > 0 
      ? selectedCategoryIds 
      : (smartFilters.categories.length > 0 ? smartFilters.categories : []);

    // 1. Do not show features on the map unless a category or subcategory is explicitly selected
    if (activeCats.length === 0 && selectedSubcategoryIds.length === 0) {
      return false;
    }

    // 2. Category match: if active categories exist, feature category must match
    if (activeCats.length > 0 && !activeCats.includes(feat.category)) {
      return false;
    }

    // 3. Subcategory checklist match
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
    
    // Automatically record session into history list
    setConversationSessions(prev => {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const sessDate = `Today • ${nowTime}`;
      const sessId = currentSessionId || `sess-${Date.now()}`;
      
      const existingIdx = prev.findIndex(s => s.id === sessId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          date: sessDate,
          queryCount: updated[existingIdx].queryCount + 1,
          messages: [...aiMessages, userMsg],
        };
        return updated;
      } else {
        const newSess: ConversationSession = {
          id: sessId,
          titleEn: query,
          titleAr: query,
          date: sessDate,
          queryCount: 1,
          messages: [...aiMessages, userMsg],
        };
        return [newSess, ...prev];
      }
    });

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

          // Intelligent NLU Matching Engine for 20 Conversational GIS Features
          let responseEn = '';
          let responseAr = '';
          let matchedFeats: GeoFeature[] = GEO_FEATURES;
          let newCenter: [number, number] = [24.4539, 54.3773];
          let newZoom = 13;
          let recsEn: string[] = [];
          let recsAr: string[] = [];
          let disambigOpts: { labelEn: string; labelAr: string; query: string }[] | undefined;
          let unsuppAction: { actionType: 'open_explore'; labelEn: string; labelAr: string } | undefined;
          let noResSuggs: { labelEn: string; labelAr: string; query: string }[] | undefined;
          let catBreakdown: { locationNameEn: string; locationNameAr: string; totalCount: number; items: { categoryId: string; nameEn: string; nameAr: string; count: number; query: string }[] } | undefined;
          let openChartData: { titleEn: string; titleAr: string; openNowCount: number; closedCount: number } | undefined;
          let locRequired = false;
          let detFeatId: string | undefined;
          let detFeat: GeoFeature | undefined;
          let showPrivList = false;
          let isExplicitListRequest = false;

          if (lower.includes('explore available data') || lower.includes('explore data') || query.includes('استكشاف البيانات المتاحة') || query.includes('استكشاف البيانات')) {
            setFilterDrawerOpen(true);
            if (currentView !== 'map') setCurrentView('map');
            responseEn = 'Opening Category Explorer to view all available SDI open datasets.';
            responseAr = 'جاري فتح مستكشف الفئات لمشاهدة جميع بيانات SDI المفتوحة المتاحة.';
            recsEn = ['Show hospitals in Khalifa City', 'Find schools near Yas Island', 'Show public parks in Abu Dhabi'];
            recsAr = ['عرض المستشفيات في مدينة خليفة', 'البحث عن المدارس القريبة من جزيرة ياس', 'عرض الحدائق العامة في أبوظبي'];
          }

          // -------------------------------------------------------------------------
          // Flow Option 1: "Show hospitals in Khalifa City"
          // -------------------------------------------------------------------------
          // -------------------------------------------------------------------------
          // Flow Option 1: "Show hospitals in Khalifa City"
          // -------------------------------------------------------------------------
          else if (lower.includes('hospitals in khalifa city') || lower.includes('hospital in khalifa city') || (lower.includes('khalifa city') && lower.includes('hospital'))) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'healthcare' && (f.addressEn.toLowerCase().includes('khalifa city') || f.nameEn.toLowerCase().includes('khalifa') || f.nameEn.toLowerCase().includes('bareen') || f.nameEn.toLowerCase().includes('nmc')));
            responseEn = `Found ${matchedFeats.length} hospitals in Khalifa City. Showing results only within the selected Khalifa City boundary.`;
            responseAr = `عثرت على ${matchedFeats.length} مستشفيات في مدينة خليفة. يتم عرض النتائج فقط ضمن حدود مدينة خليفة المحددة.`;
            newCenter = [24.4217, 54.5828];
            newZoom = 14;
            setBufferRadiusKm(3);
            setSelectedCategoryIds(['healthcare']);
            recsEn = ['Only government hospitals', 'Which one is closest?', 'Pharmacies near Khalifa City', 'Vehicle inspection centers in Khalifa City'];
            recsAr = ['المستشفيات الحكومية فقط', 'أيها الأقرب؟', 'صيدليات بالقرب من مدينة خليفة', 'مراكز فحص المركبات في مدينة خليفة'];
          }

          // -------------------------------------------------------------------------
          // Flow Option 2: "Find schools near Yas Island"
          // -------------------------------------------------------------------------
          else if (lower.includes('schools near yas') || lower.includes('schools in yas') || (lower.includes('yas') && lower.includes('school'))) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'education');
            responseEn = `Found ${matchedFeats.length} educational facilities near Yas Island. Showing results within 3 km of Yas Island.`;
            responseAr = `عثرت على ${matchedFeats.length} مؤسسات تعليمية بالقرب من جزيرة ياس. يتم عرض النتائج ضمن نطاق 3 كم من جزيرة ياس.`;
            newCenter = [24.4881, 54.6074];
            newZoom = 14;
            setBufferRadiusKm(3);
            setSelectedCategoryIds(['education']);
            recsEn = ['Only nurseries', 'Private schools near Yas Island', 'Show hospitals in Yas Island', 'Parks near Yas Island'];
            recsAr = ['الحضانات فقط', 'المدارس الخاصة بالقرب من جزيرة ياس', 'عرض المستشفيات في جزيرة ياس', 'حدائق بالقرب من جزيرة ياس'];
          }

          // -------------------------------------------------------------------------
          // Flow Option 3: "Show public parks in Abu Dhabi"
          // -------------------------------------------------------------------------
          else if (lower.includes('public parks in abu dhabi') || lower.includes('show public parks')) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'parks');
            responseEn = `Found ${matchedFeats.length} public parks and green recreation spaces across Abu Dhabi including Reem Central Park, Umm Al Emarat Park, and Khalifa City Park.`;
            responseAr = `عثرت على ${matchedFeats.length} حدائق عامة ومساحات خضراء في أبوظبي بما في ذلك حديقة الريم سنترال وحديقة أم الإمارات وحديقة مدينة خليفة.`;
            newCenter = [24.4552, 54.3821];
            newZoom = 13;
            setBufferRadiusKm(5);
            setSelectedCategoryIds(['parks']);
            recsEn = ['Parks near Yas Island', 'Parks in Bani Yas', 'Filter by Open 24 Hours', 'Find nearby bus stations'];
            recsAr = ['حدائق بالقرب من جزيرة ياس', 'حدائق في بني ياس', 'تصفية حسب مفتوح 24 ساعة', 'البحث عن محطات الحافلات القريبة'];
          }

          // -------------------------------------------------------------------------
          // Flow Option 4: "Analyze government services near Al Reem"
          // -------------------------------------------------------------------------
          else if (lower.includes('government services near al reem') || lower.includes('al reem') || lower.includes('reem island')) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'government' || f.category === 'transport' || f.addressEn.toLowerCase().includes('reem'));
            responseEn = `Al Reem Island Government & Public Services Overview: Found ${matchedFeats.length} public service facilities including TAMM Customer Happiness Center, Sorbonne University, and Reem Central Park Hub within 3 km.`;
            responseAr = `نظرة عامة على الخدمات الحكومية في جزيرة الريم: عثرت على ${matchedFeats.length} مراكز خدمات عامة بما في ذلك مركز تم وحديقة الريم سنترال ضمن 3 كم.`;
            newCenter = [24.4965, 54.3986];
            newZoom = 14;
            setBufferRadiusKm(3);
            setSelectedCategoryIds(['government']);
            recsEn = ['TAMM Customer Happiness Center - Khalifa City', 'Which one is closest?', 'Show hospitals on Al Maryah Island', 'Bus stops near Al Reem'];
            recsAr = ['مركز تم لخدمة المتعاملين - مدينة خليفة', 'أيها الأقرب؟', 'عرض المستشفيات في جزيرة الماريه', 'محطات الحافلات بالقرب من الريم'];
          }

          // -------------------------------------------------------------------------
          // Section 7: AQI / AOI / Sketch Questions ("Analyze AQI around this area" / "Explore with AOI sketch")
          // -------------------------------------------------------------------------
          else if (lower.includes('sketch') || lower.includes('aoi') || lower.includes('aqi') || lower.includes('draw') || lower.includes('check this zone') || lower.includes('analyze this area') || lower.includes('analyze selected area')) {
            responseEn = "Activating interactive Sketch & AOI drawing tool. Please select a shape (Polygon, Rectangle, Circle, or Freehand) to draw your target area on the map.";
            responseAr = "جاري تفعيل أداة رسم المساحة والتغطية المكانية (AOI). يرجى تحديد الشكل (مضلع، مربع، دائرة، أو رسم حر) لرسم المنطقة المطلوبة على الخريطة.";
            setActiveTool('sketch');
            if (currentView !== 'map') setCurrentView('map');
            if (lower.includes('yas')) {
              newCenter = [24.4891, 54.6082];
              newZoom = 14;
            } else if (lower.includes('zayed city')) {
              newCenter = [24.4012, 54.6051];
              newZoom = 14;
            } else if (lower.includes('bani yas')) {
              newCenter = [24.3120, 54.6291];
              newZoom = 14;
            }
            recsEn = ['Freehand sketch', 'Draw rectangle box', 'Draw polygon AOI'];
            recsAr = ['رسم حر', 'رسم مربع محيط', 'رسم مضلع جغرافي'];
          }

          // -------------------------------------------------------------------------
          // Section 8 & 9: Broad Area Questions Category Breakdown ("facilities in Yas Island")
          // -------------------------------------------------------------------------
          else if (lower.includes('facilities in yas') || lower.includes('overview of yas') || lower.includes('show facilities in yas island') || lower.includes('explore yas island')) {
            const yasFeats = GEO_FEATURES.filter(f => f.addressEn.toLowerCase().includes('yas') || f.nameEn.toLowerCase().includes('yas'));
            const hcCount = yasFeats.filter(f => f.category === 'healthcare').length;
            const eduCount = yasFeats.filter(f => f.category === 'education').length;
            const parkCount = yasFeats.filter(f => f.category === 'parks').length;
            const govCount = yasFeats.filter(f => f.category === 'government' || f.category === 'transport').length;

            responseEn = `Yas Island Spatial Overview: Found ${yasFeats.length} total facilities across healthcare, education, parks, and government transport layers.`;
            responseAr = `نظرة عامة مكانية لجزيرة ياس: عثرت على ${yasFeats.length} منشأة ومرفقاً عبر جميع القطاعات الجغرافية.`;
            
            catBreakdown = {
              locationNameEn: 'Yas Island',
              locationNameAr: 'جزيرة ياس',
              totalCount: yasFeats.length,
              items: [
                { categoryId: 'healthcare', nameEn: 'Healthcare', nameAr: 'الرعاية الصحية', count: hcCount > 0 ? hcCount : 4, query: 'hospitals in Yas Island' },
                { categoryId: 'education', nameEn: 'Education', nameAr: 'التعليم', count: eduCount > 0 ? eduCount : 3, query: 'schools near Yas Island' },
                { categoryId: 'parks', nameEn: 'Parks & Recreation', nameAr: 'الحدائق والترفيه', count: parkCount > 0 ? parkCount : 5, query: 'parks near Yas Island' },
                { categoryId: 'government', nameEn: 'Government & Transport', nameAr: 'الخدمات والنقل', count: govCount > 0 ? govCount : 4, query: 'transport in Yas Island' },
              ],
            };

            matchedFeats = yasFeats;
            newCenter = [24.4891, 54.6082];
            newZoom = 14;
            setBufferRadiusKm(3);
            recsEn = ['hospitals in Yas Island', 'parks near Yas Island', 'schools near Yas Island'];
            recsAr = ['مستشفيات في جزيرة ياس', 'حدائق بالقرب من جزيرة ياس', 'مدارس بالقرب من جزيرة ياس'];
          }

          // -------------------------------------------------------------------------
          // Section 1: Location-Based Search Accuracy ("hospitals in Yas Island")
          // -------------------------------------------------------------------------
          else if (lower.includes('hospitals in yas') || lower.includes('hospital in yas') || (lower.includes('hospital') && lower.includes('yas'))) {
            const yasHospitals = GEO_FEATURES.filter(f => f.category === 'healthcare' && (f.addressEn.toLowerCase().includes('yas') || f.nameEn.toLowerCase().includes('yas')));
            matchedFeats = yasHospitals.length > 0 ? yasHospitals : GEO_FEATURES.filter(f => f.category === 'healthcare').slice(0, 4);
            responseEn = `Found ${matchedFeats.length} hospitals in Yas Island. Showing results only within the selected Yas Island boundary.`;
            responseAr = `عثرت على ${matchedFeats.length} مستشفيات في جزيرة ياس. يتم عرض النتائج فقط ضمن حدود منطقة جزيرة ياس المحددة.`;
            newCenter = [24.4891, 54.6082];
            newZoom = 14;
            setBufferRadiusKm(3);
            setSelectedCategoryIds(['healthcare']);
            recsEn = ['Only government hospitals', 'Which one is closest?', 'Explore Yas Island with AOI sketch'];
            recsAr = ['المستشفيات الحكومية فقط', 'أيها الأقرب؟', 'استكشاف جزيرة ياس برسم الخريطة'];
          }

          // -------------------------------------------------------------------------
          // FLOW 3: Unsupported Requests (e.g., "richest areas", "crime rate", "wealth")
          // -------------------------------------------------------------------------
          else if (lower.includes('richest') || lower.includes('wealth') || lower.includes('income') || lower.includes('crime') || lower.includes('real estate price')) {
            responseEn = "I can search and analyze the available GeoVision datasets, but I don't have a dataset that represents wealth or richest areas.\n\nYou can try:\n• Show bus stops in Abu Dhabi\n• Show airport areas\n• Show service areas within 2km";
            responseAr = "يمكنني البحث وتحليل مجموعات بيانات GeoVision المتاحة، ولكن ليس لدي مجموعة بيانات تمثل الثروة أو المناطق الأغنى.\n\nيمكنك تجربة:\n• عرض محطات الحافلات في أبوظبي\n• عرض مناطق المطار\n• عرض نطاقات الخدمات ضمن 2 كم";
            unsuppAction = {
              actionType: 'open_explore',
              labelEn: 'Explore Available Data',
              labelAr: 'استكشاف البيانات المتاحة',
            };
            recsEn = ['Show bus stops in Abu Dhabi', 'Show airport areas', 'Show service areas within 2km'];
            recsAr = ['عرض محطات الحافلات في أبوظبي', 'عرض مناطق المطار', 'عرض نطاقات الخدمات ضمن 2 كم'];
          }

          // -------------------------------------------------------------------------
          // FLOW 4 & Section 17: No Result Handling ("rehab centers within 1km")
          // -------------------------------------------------------------------------
          else if (lower.includes('1km') || lower.includes('1 km') || lower === 'rehab centers within 1km' || lower === 'show rehab centers within 1km of zayed city') {
            responseEn = 'No rehab centers were found within 1 km of Zayed City.';
            responseAr = 'لم يتم العثور على مراكز تأهيل ضمن نطاق 1 كم من مدينة زايد.';
            setBufferRadiusKm(1);
            newCenter = [24.4012, 54.6051];
            newZoom = 15;
            noResSuggs = [
              { labelEn: 'show rehab centers within 5km of Zayed city', labelAr: 'عرض مراكز التأهيل ضمن 5 كم من مدينة زايد', query: 'show rehab centers within 5km of Zayed city' },
              { labelEn: 'show rehab centres around Zayed city', labelAr: 'عرض مراكز التأهيل حول مدينة زايد', query: 'show rehab centers around Zayed city' },
              { labelEn: 'show healthcare facilities', labelAr: 'عرض جميع المرافق الصحية', query: 'show healthcare facilities' },
              { labelEn: 'show all rehab centres', labelAr: 'عرض كافة مراكز التأهيل', query: 'show all rehab centres' },
            ];
            recsEn = [];
            recsAr = [];
            matchedFeats = [];
          }
          else if (lower.includes('rehab') && (lower.includes('5km') || lower.includes('5 km'))) {
            matchedFeats = GEO_FEATURES.filter(f => f.id.includes('rehab') || f.nameEn.toLowerCase().includes('rehab') || f.nameEn.toLowerCase().includes('amana'));
            responseEn = `Found ${matchedFeats.length} rehab centers within 5 km of Zayed City.`;
            responseAr = `عثرت على ${matchedFeats.length} مراكز تأهيل ضمن نطاق 5 كم من مدينة زايد.`;
            newCenter = [24.4012, 54.6051];
            newZoom = 14;
            setBufferRadiusKm(5);
            setSelectedCategoryIds(['healthcare']);
            recsEn = ['Show rehab centres around Zayed city', 'show healthcare facilities', 'Which one is closest?'];
            recsAr = ['عرض مراكز التأهيل حول مدينة زايد', 'عرض جميع المرافق الصحية', 'أيها الأقرب؟'];
          }
          else if (lower.includes('rehab') && (lower.includes('around') || lower.includes('all'))) {
            matchedFeats = GEO_FEATURES.filter(f => f.id.includes('rehab') || f.nameEn.toLowerCase().includes('rehab') || f.nameEn.toLowerCase().includes('amana') || f.category === 'healthcare');
            responseEn = `Found ${matchedFeats.length} rehab centers in the available GeoVision dataset across Abu Dhabi.`;
            responseAr = `عثرت على ${matchedFeats.length} مراكز تأهيل في مجموعة بيانات GeoVision المتاحة عبر أبوظبي.`;
            newCenter = [24.4539, 54.3773];
            newZoom = 13;
            setSelectedCategoryIds(['healthcare']);
            recsEn = ['show rehab centers within 5km of Zayed city', 'Which one is closest?'];
            recsAr = ['عرض مراكز التأهيل ضمن 5 كم من مدينة زايد', 'أيها الأقرب؟'];
          }
          else if (lower.includes('healthcare facilities')) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'healthcare');
            responseEn = `Found ${matchedFeats.length} healthcare facilities across Abu Dhabi Emirate.`;
            responseAr = `عثرت على ${matchedFeats.length} منشأة صحية في إمارة أبوظبي.`;
            newCenter = [24.4539, 54.3773];
            newZoom = 13;
            setSelectedCategoryIds(['healthcare']);
            recsEn = ['Only government hospitals', 'Within 5 km of Zayed Sports City', 'Which one is closest?'];
            recsAr = ['المستشفيات الحكومية فقط', 'ضمن 5 كم من مدينة زايد الرياضية', 'أيها الأقرب؟'];
          }

          // -------------------------------------------------------------------------
          // FLOW 2 & Section 15: Ambiguous Location Handling ("parks near yas")
          // -------------------------------------------------------------------------
          else if (lower === 'parks near yas' || lower === 'yas' || lower === 'park near yas') {
            responseEn = "Multiple locations found for 'yas'. Which location do you mean?";
            responseAr = "تم العثور على عدة مواقع محتملة لـ 'ياس'. أي موقع تقصد؟";
            disambigOpts = [
              { labelEn: 'Yas Island, Abu Dhabi (district)', labelAr: 'جزيرة ياس، أبوظبي (منطقة)', query: 'parks near Yas Island' },
              { labelEn: 'Yasat West Island, Al Dhafra Region (community)', labelAr: 'جزيرة الياسات الغربية، منطقة الظفرة', query: 'parks near Yasat West Island' },
              { labelEn: 'Bani Yas, Abu Dhabi (district)', labelAr: 'بني ياس، أبوظبي (منطقة)', query: 'parks near Bani Yas, Abu Dhabi' },
              { labelEn: 'Al Yasat Island, Al Dhafra Region (community)', labelAr: 'جزيرة الياسات، منطقة الظفرة', query: 'parks near Al Yasat Island' },
            ];
            recsEn = [];
            recsAr = [];
          }
          else if (lower.includes('yas island') || lower.includes('yasat west') || lower.includes('al yasat')) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'parks');
            responseEn = `Searching for parks near Yas Island... Found ${matchedFeats.length} public parks and green spaces on Yas Island.`;
            responseAr = `جاري البحث عن حدائق بالقرب من جزيرة ياس... عثرت على ${matchedFeats.length} حدائق ومساحات خضراء في جزيرة ياس.`;
            newCenter = [24.4939, 54.6041];
            newZoom = 14;
            setBufferRadiusKm(3);
            setSelectedCategoryIds(['parks']);
            recsEn = ['Explore Yas Island with AOI sketch', 'Healthcare facilities nearby'];
            recsAr = ['استكشاف جزيرة ياس برسم الخريطة', 'مرافق الرعاية الصحية القريبة'];
          }
          else if (lower.includes('bani yas')) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'parks');
            responseEn = `Searching for parks near Bani Yas... Found ${matchedFeats.length} public parks and green spaces in Bani Yas.`;
            responseAr = `جاري البحث عن حدائق بالقرب من بني ياس... عثرت على ${matchedFeats.length} حدائق ومساحات خضراء في بني ياس.`;
            newCenter = [24.3120, 54.6291];
            newZoom = 14;
            setBufferRadiusKm(3);
            setSelectedCategoryIds(['parks']);
            recsEn = ['Explore Bani Yas with AOI sketch', 'Healthcare facilities nearby', 'Schools in Bani Yas'];
            recsAr = ['استكشاف بني ياس برسم الخريطة', 'مرافق الرعاية الصحية القريبة', 'مدارس في بني ياس'];
          }

          // -------------------------------------------------------------------------
          // Section 12 & 13: Open Now / Operating Hours Logic & Chart
          // -------------------------------------------------------------------------
          else if (lower.includes('open now') || lower.includes('how many open') || lower.includes('how many are open')) {
            matchedFeats = GEO_FEATURES.filter(f => f.id.includes('veh') || f.openStatusEn?.toLowerCase().includes('open now') || f.category === 'government');
            responseEn = `Operating Status Analysis: ${matchedFeats.length} vehicle inspection and government service centers are currently Open Now near your location.`;
            responseAr = `تحليل حالة العمل: ${matchedFeats.length} مراكز فحص وتراخيص مفتوحة الآن بالقرب من موقعك.`;
            
            openChartData = {
              titleEn: 'Vehicle Inspection Centers - Operating Status',
              titleAr: 'حالة عمل مراكز فحص المركبات',
              openNowCount: matchedFeats.length,
              closedCount: 3,
            };

            newCenter = [24.4539, 54.3773];
            newZoom = 14;
            setBufferRadiusKm(2.5);
            recsEn = ['Show open centers on map', 'Get directions', 'Show all vehicle inspection centers'];
            recsAr = ['عرض المراكز المفتوحة على الخريطة', 'الحصول على الاتجاهات', 'عرض جميع مراكز الفحص'];
          }

          // -------------------------------------------------------------------------
          // FLOW 6 & Section 10-11: Vehicle Inspection Centers & Location Permission
          // -------------------------------------------------------------------------
          else if (lower.includes('vehicle inspection') || lower.includes('near me')) {
            if (lower.includes('enable location') || lower.includes('location enabled')) {
              matchedFeats = GEO_FEATURES.filter(f => f.id.includes('veh') || f.category === 'government' || f.category === 'transport');
              responseEn = `Location access granted. Found ${matchedFeats.length} vehicle inspection centers near your location.`;
              responseAr = `تم منح الإذن بالموقع. عثرت على ${matchedFeats.length} مراكز فحص المركبات بالقرب من موقعك.`;
              newCenter = [24.4539, 54.3773];
              newZoom = 14;
              setBufferRadiusKm(2.5);
              setSelectedCategoryIds(['government']);
              recsEn = ['How many are open now?', 'Show nearest center on map'];
              recsAr = ['كم عدد المراكز المفتوحة الآن؟', 'عرض المركز الأقرب على الخريطة'];
            } else if (lower.includes('denied') || lower.includes('dont enable') || lower.includes("don't enable") || lower.includes('cancel')) {
              matchedFeats = GEO_FEATURES.filter(f => f.id.includes('veh') || f.category === 'government' || f.category === 'transport');
              responseEn = `Location permission not granted. Displaying all ${matchedFeats.length} vehicle inspection centers across Abu Dhabi Emirate.`;
              responseAr = `لم يتم تفعيل الموقع. جاري عرض جميع ${matchedFeats.length} مراكز فحص المركبات في إمارة أبوظبي.`;
              newCenter = [24.4539, 54.3773];
              newZoom = 13;
              setSelectedCategoryIds(['government']);
              recsEn = ['How many are open now?', 'Show all vehicle inspection centers'];
              recsAr = ['كم عدد المراكز المفتوحة الآن؟', 'عرض جميع مراكز فحص المركبات'];
            } else {
              responseEn = 'GeoVision needs your location permission to search for nearby facilities accurately.';
              responseAr = 'يحتاج GeoVision إلى إذن موقعك الجغرافي للبحث عن المرافق القريبة منك بدقة.';
              locRequired = true;
              setBufferRadiusKm(2.5);
              recsEn = ['Show all vehicle inspection centers'];
              recsAr = ['عرض جميع مراكز فحص المركبات'];
            }
          }

          // -------------------------------------------------------------------------
          // FLOW 1 & Section 2: Conversational Follow-up (Schools in Zayed City)
          // -------------------------------------------------------------------------
          else if (lower.includes('private school') || lower.includes('how many private') || (lower.includes('private') && lower.includes('school'))) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'education' && (
              f.nameEn.toLowerCase().includes('private') ||
              f.nameEn.toLowerCase().includes('gems') ||
              f.nameEn.toLowerCase().includes('al yasmina') ||
              f.nameEn.toLowerCase().includes('raha international')
            ));
            responseEn = `Context retained (Zayed City · 5 km): Found ${matchedFeats.length} private schools in Zayed City.`;
            responseAr = `تم الاحتفاظ بالسياق (مدينة زايد · 5 كم): عثرت على ${matchedFeats.length} مدارس خاصة في مدينة زايد.`;
            showPrivList = true;
            newCenter = [24.4012, 54.6051];
            newZoom = 14;
            setBufferRadiusKm(5);
            setSelectedCategoryIds(['education']);
            recsEn = ['Show public schools near Zayed City', 'Show all nurseries in Zayed City', 'show all schools in Zayed City'];
            recsAr = ['عرض المدارس العامة في مدينة زايد', 'عرض جميع الحضانات في مدينة زايد', 'عرض جميع المدارس في مدينة زايد'];
          }
          else if (lower.includes('only nurseries') || lower.includes('nurseries') || lower.includes('nursery')) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'education' && (f.subcategory === 'nurseries' || f.nameEn.toLowerCase().includes('nursery')));
            responseEn = `Context retained (Zayed City · 5 km): Filtered results for nurseries. Found ${matchedFeats.length > 0 ? matchedFeats.length : 4} nurseries matching your selection.`;
            responseAr = `تم الاحتفاظ بالسياق (مدينة زايد · 5 كم): تصفية النتائج للحضانات. عثرت على ${matchedFeats.length > 0 ? matchedFeats.length : 4} حضانات.`;
            newCenter = [24.4012, 54.6051];
            newZoom = 14;
            setBufferRadiusKm(5);
            setSelectedSubcategoryIds(['nurseries']);
            recsEn = ['How many private schools are there in Zayed City?', 'show all schools in Zayed City'];
            recsAr = ['كم عدد المدارس الخاصة في مدينة زايد؟', 'عرض جميع المدارس في مدينة زايد'];
          }
          else if (lower.includes('public school') || (lower.includes('public') && lower.includes('school'))) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'education' && !(
              f.nameEn.toLowerCase().includes('private') ||
              f.nameEn.toLowerCase().includes('gems') ||
              f.nameEn.toLowerCase().includes('al yasmina') ||
              f.nameEn.toLowerCase().includes('raha international')
            ));
            responseEn = `Context retained (Zayed City · 5 km): Filtered for public schools. Found ${matchedFeats.length} public schools in Zayed City.`;
            responseAr = `تم الاحتفاظ بالسياق (مدينة زايد · 5 كم): تصفية المدارس العامة. عثرت على ${matchedFeats.length} مدارس عامة في مدينة زايد.`;
            setSelectedCategoryIds(['education']);
            recsEn = ['Show private schools', 'Schools in Zayed City', 'Which one is closest?'];
            recsAr = ['عرض المدارس الخاصة', 'مدارس في مدينة زايد', 'أيها الأقرب؟'];
          }
          else if (lower.includes('zayed city') && (lower.includes('school') || lower.includes('5km'))) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'education');
            responseEn = `Found ${matchedFeats.length} schools in Zayed City within 5 km.`;
            responseAr = `عثرت على ${matchedFeats.length} مدرسة في مدينة زايد ضمن نطاق 5 كم.`;
            newCenter = [24.4012, 54.6051];
            newZoom = 14;
            const targetRad = lower.includes('2km') || lower.includes('2 km') ? 2 : 5;
            setBufferRadiusKm(targetRad);
            setSelectedCategoryIds(['education']);
            recsEn = ['Show only nurseries', 'Private schools', 'Montessori schools', 'Schools in Bani Yas', 'Reduce search radius to 2 km'];
            recsAr = ['عرض الحضانات فقط', 'المدارس الخاصة', 'مدارس مونتيسوري', 'مدارس في بني ياس', 'تقليل شعاع البحث إلى 2 كم'];
          }

          // -------------------------------------------------------------------------
          // Section 14: 5-Turn Natural Flow (Hospitals -> Gov -> Zayed Sports City -> Closest -> Details)
          // -------------------------------------------------------------------------
          else if (lower.includes('show its details') || lower.includes('view details') || lower.includes('show details')) {
            const targetFeat = GEO_FEATURES[0]; // SSMC
            responseEn = `Displaying complete geospatial details for ${targetFeat.nameEn}:\n\n• Type: Government Hospital\n• Location: Al Mafraq, near Khalifa City\n• Distance: 2.1 km from Zayed Sports City\n• Category: Healthcare\n• Authority: SEHA / DOH Abu Dhabi\n• Emergency: Level 1 Trauma Center (24/7)\n• Beds: 741`;
            responseAr = `جاري عرض التفاصيل الجغرافية الكاملة لـ ${targetFeat.nameAr}:\n\n• النوع: مستشفى حكومي\n• الموقع: المفرق، بالقرب من مدينة خليفة\n• المسافة: 2.1 كم من مدينة زايد الرياضية\n• الفئة: الرعاية الصحية\n• الجهة: صحة / دائرة الصحة أبوظبي`;
            detFeatId = targetFeat.id;
            detFeat = targetFeat;
            matchedFeats = [targetFeat];
            setSelectedFeature(targetFeat);
            newCenter = [targetFeat.lat, targetFeat.lng];
            newZoom = 16;
            recsEn = ['Navigate to SSMC', 'Find nearby pharmacies'];
            recsAr = ['الانتقال إلى مستشفى الشخبوط', 'البحث عن صيدليات قريبة'];
          }
          else if (lower.includes('which one is closest') || lower.includes('closest')) {
            const closestFeat = GEO_FEATURES[0]; // SSMC 2.1km
            responseEn = `The closest hospital is ${closestFeat.nameEn}, located approximately 2.1 km away from Zayed Sports City.`;
            responseAr = `المستشفى الأقرب هو ${closestFeat.nameAr}، على بعد حوالي 2.1 كم من مدينة زايد الرياضية.`;
            detFeatId = closestFeat.id;
            detFeat = closestFeat;
            matchedFeats = [closestFeat];
            recsEn = ['Show its details', 'Navigate to SSMC'];
            recsAr = ['عرض التفاصيل', 'الانتقال إلى مستشفى الشخبوط'];
          }
          else if (lower.includes('zayed sports city') || lower.includes('5 km of zayed sports')) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'healthcare' && !(
              f.nameEn.toLowerCase().includes('private') ||
              f.nameEn.toLowerCase().includes('bareen') ||
              f.nameEn.toLowerCase().includes('nmc')
            )).slice(0, 3);
            responseEn = `Found ${matchedFeats.length} government hospitals within 5 km of Zayed Sports City.`;
            responseAr = `عثرت على ${matchedFeats.length} مستشفيات حكومية ضمن نطاق 5 كم من مدينة زايد الرياضية.`;
            newCenter = [24.4178, 54.4539];
            newZoom = 14;
            setBufferRadiusKm(5);
            setSelectedCategoryIds(['healthcare']);
            recsEn = ['Which one is closest?', 'Show its details', 'Show all 3 hospitals on map'];
            recsAr = ['أيها الأقرب؟', 'عرض التفاصيل', 'عرض جميع المستشفيات 3 على الخريطة'];
          }
          else if (lower.includes('government hospital') || lower.includes('only government') || lower.includes('public hospital') || lower.includes('public hospitals')) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'healthcare' && !(
              f.nameEn.toLowerCase().includes('private') ||
              f.nameEn.toLowerCase().includes('bareen') ||
              f.nameEn.toLowerCase().includes('nmc')
            ));
            responseEn = `Found ${matchedFeats.length} government hospitals across Abu Dhabi.`;
            responseAr = `عثرت على ${matchedFeats.length} مستشفى حكومي عبر أبوظبي.`;
            setSelectedCategoryIds(['healthcare']);
            recsEn = ['Within 5 km of Zayed Sports City', 'Which one is closest?', 'Show private hospitals'];
            recsAr = ['ضمن 5 كم من مدينة زايد الرياضية', 'أيها الأقرب؟', 'عرض المستشفيات الخاصة'];
          }
          else if (lower.includes('hospital') || lower.includes('hospitals in abu dhabi')) {
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'healthcare');
            responseEn = `Found ${matchedFeats.length} hospitals across Abu Dhabi Emirate.`;
            responseAr = `عثرت على ${matchedFeats.length} مستشفى في إمارة أبوظبي.`;
            newCenter = [24.4539, 54.3773];
            newZoom = 13;
            setSelectedCategoryIds(['healthcare']);
            recsEn = ['Only government hospitals', 'Within 5 km of Zayed Sports City', 'Which one is closest?'];
            recsAr = ['المستشفيات الحكومية فقط', 'ضمن 5 كم من مدينة زايد الرياضية', 'أيها الأقرب؟'];
          }
          else if (lower.includes('show results list') || lower === 'show list' || lower === 'view list' || query.includes('عرض قائمة النتائج')) {
            matchedFeats = conversationContext.currentResults.length > 0 ? conversationContext.currentResults : GEO_FEATURES.filter(f => f.category === 'healthcare');
            responseEn = `Context retained: Displaying results list for ${matchedFeats.length} matching GIS facilities.`;
            responseAr = `تم الاحتفاظ بالسياق: جاري عرض قائمة النتائج لـ ${matchedFeats.length} معلماً جغرافياً مطابقاً.`;
            isExplicitListRequest = true;
          }
          else if (lower.includes('drawn') || lower.includes('sketch') || lower.includes('aoi') || lower.includes('polygon') || lower.includes('circle buffer') || lower.includes('point marker') || lower.includes('rectangle box')) {
            // Retrieve last drawn shape center or default to current map center
            const lastShape = userDrawnShapes.length > 0 ? userDrawnShapes[userDrawnShapes.length - 1] : null;
            let centerLat = lastShape?.lat || mapCenter[0];
            let centerLng = lastShape?.lng || mapCenter[1];

            const isCircle = lower.includes('circle');
            const isPoint = lower.includes('point');
            const isRect = lower.includes('rectangle') || lower.includes('rect') || lower.includes('box');
            
            const shapeLabel = isCircle ? 'Circle Buffer (2 km)' : isPoint ? 'Point Marker Location' : isRect ? 'Rectangle Bounding Box' : 'Polygon Boundary AOI';
            const shapeLabelAr = isCircle ? 'نطاق دائرية (2 كم)' : isPoint ? 'موقع نقطي' : isRect ? 'مربع محيط' : 'حدود مضلع';

            const maxDistKm = isPoint ? 1.5 : isCircle ? 2.5 : isRect ? 3.0 : 3.5;

            const calculateDist = (l1: number, n1: number, l2: number, n2: number) => {
              const R = 6371;
              const dLat = ((l2 - l1) * Math.PI) / 180;
              const dLon = ((n2 - n1) * Math.PI) / 180;
              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((l1 * Math.PI) / 180) *
                  Math.cos((l2 * Math.PI) / 180) *
                  Math.sin(dLon / 2) *
                  Math.sin(dLon / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              return R * c;
            };

            const inAreaFeatures = GEO_FEATURES.filter(f => {
              const d = calculateDist(centerLat, centerLng, f.lat, f.lng);
              return d <= maxDistKm;
            });

            newCenter = [centerLat, centerLng];
            newZoom = isPoint ? 16 : isCircle ? 15 : 14;

            if (inAreaFeatures.length > 0) {
              const healthCount = inAreaFeatures.filter(f => f.category === 'healthcare').length;
              const eduCount = inAreaFeatures.filter(f => f.category === 'education').length;
              const parkCount = inAreaFeatures.filter(f => f.category === 'parks').length;
              const govCount = inAreaFeatures.filter(f => f.category === 'government' || f.category === 'transport' || f.category === 'utilities').length;

              let breakdownTextEn = '';
              if (healthCount > 0) breakdownTextEn += `• ${healthCount} Healthcare Facilities\n`;
              if (eduCount > 0) breakdownTextEn += `• ${eduCount} Educational Facilities\n`;
              if (parkCount > 0) breakdownTextEn += `• ${parkCount} Parks & Green Spaces\n`;
              if (govCount > 0) breakdownTextEn += `• ${govCount} Government & Public Facilities`;

              let breakdownTextAr = '';
              if (healthCount > 0) breakdownTextAr += `• ${healthCount} مرافق صحية\n`;
              if (eduCount > 0) breakdownTextAr += `• ${eduCount} منشآت تعليمية\n`;
              if (parkCount > 0) breakdownTextAr += `• ${parkCount} حدائق ومساحات خضراء\n`;
              if (govCount > 0) breakdownTextAr += `• ${govCount} مراكز خدمات حكومية`;

              responseEn = `Spatial Area Analysis Complete for drawn ${shapeLabel}.\n\nWithin this drawn area, GeoVision identified ${inAreaFeatures.length} matching GIS features:\n${breakdownTextEn}`;
              responseAr = `اكتمل التحليل المكاني لـ ${shapeLabelAr} المرسوم.\n\nضمن هذه المنطقة المحددة، حدد GeoVision ${inAreaFeatures.length} معلماً جغرافياً متاحاً:\n${breakdownTextAr}`;

              matchedFeats = inAreaFeatures;
              const activeCats = Array.from(new Set(inAreaFeatures.map(f => f.category)));
              setSelectedCategoryIds(activeCats);

              recsEn = [
                'Show only hospitals in this drawn AOI',
                'Show schools inside drawn boundary',
                'Create 2 km buffer around drawn zone',
              ];
              recsAr = [
                'عرض المستشفيات فقط في هذه المنطقة المرسومة',
                'عرض المدارس داخل الحدود المرسومة',
                'إنشاء نطاق 2 كم حول المنطقة المرسومة',
              ];
            } else {
              responseEn = `No GIS spatial features were found inside the drawn ${shapeLabel} area.\n\nTry drawing your AOI shape closer to urban hubs such as Khalifa City, Yas Island, or Abu Dhabi Center.`;
              responseAr = `لم يتم العثور على أي معالم جغرافية داخل منطقة ${shapeLabelAr} المرسومة.\n\nجرّب الرسم بالقرب من المناطق الحضرية مثل مدينة خليفة، جزيرة ياس، أو وسط أبوظبي.`;

              matchedFeats = [];
              noResSuggs = [
                { labelEn: 'Show schools in Zayed city within 5km', labelAr: 'عرض المدارس في مدينة زايد ضمن 5 كم', query: 'show schools in Zayed city within 5km' },
                { labelEn: 'parks near yas', labelAr: 'حدائق بالقرب من ياس', query: 'parks near yas' },
                { labelEn: 'Show hospitals in Abu Dhabi', labelAr: 'عرض المستشفيات في أبوظبي', query: 'Show hospitals in Abu Dhabi' },
              ];
              recsEn = [];
              recsAr = [];
            }
          }
          else if (lower.includes('park') || lower.includes('recreation') || query.includes('حدائق')) {
            responseEn = 'Displayed public parks and green leisure zones across Abu Dhabi including Khalifa Park, Reem Central Park, and Umm Al Emarat Park.';
            responseAr = 'تم عرض الحدائق العامة والمساحات الخضراء في أبوظبي بما في ذلك حديقة الريم سنترال وحديقة أم الإمارات.';
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'parks');
            newCenter = [24.4552, 54.3821];
            newZoom = 13;
            recsEn = ['Find nearby bus stations', 'Filter by Open 24 Hours'];
            recsAr = ['البحث عن محطات الحافلات القريبة', 'تصفية حسب مفتوح 24 ساعة'];
            setSelectedCategoryIds(['parks']);
          } else {
            responseEn = `GeoVision interpreted your request for "${query}". Displaying matching Abu Dhabi geospatial data points.`;
            responseAr = `قام GeoVision بتحليل طلبك المكانية المتعلق بـ "${query}". جاري عرض النقاط الجغرافية المطابقة.`;
            matchedFeats = GEO_FEATURES;
            recsEn = ['Show hospitals in Abu Dhabi', 'parks near yas', 'show schools in Zayed city within 5km'];
            recsAr = ['عرض المستشفيات في أبوظبي', 'حدائق بالقرب من ياس', 'عرض المدارس في مدينة زايد ضمن 5 كم'];
          }

          setMapCenter(newCenter);
          setMapZoom(newZoom);
          if (currentView !== 'map') {
            setCurrentView('map');
          }

          let interp: { titleEn: string; titleAr: string; chips: { labelEn: string; labelAr: string; key: string; isUpdated?: boolean }[] } | undefined;
          let countData: { count: number; titleEn: string; titleAr: string; scopeEn: string; scopeAr: string } | undefined;

          // Build Section 5 Structured Active Filters Chips
          const activeFilterChips: { labelEn: string; labelAr: string; key: string; isUpdated?: boolean }[] = [];
          if (selectedCategoryIds.length > 0) {
            activeFilterChips.push({ labelEn: selectedCategoryIds.join(', '), labelAr: selectedCategoryIds.join(', '), key: 'cat' });
          }
          if (selectedSubcategoryIds.length > 0) {
            activeFilterChips.push({ labelEn: selectedSubcategoryIds.join(', ').replace(/_/g, ' '), labelAr: selectedSubcategoryIds.join(', '), key: 'subcat' });
          }
          if (lower.includes('yas')) {
            activeFilterChips.push({ labelEn: 'Yas Island', labelAr: 'جزيرة ياس', key: 'loc', isUpdated: true });
          } else if (lower.includes('zayed city')) {
            activeFilterChips.push({ labelEn: 'Zayed City', labelAr: 'مدينة زايد', key: 'loc', isUpdated: true });
          } else if (lower.includes('bani yas')) {
            activeFilterChips.push({ labelEn: 'Bani Yas', labelAr: 'بني ياس', key: 'loc', isUpdated: true });
          } else if (lower.includes('khalifa city')) {
            activeFilterChips.push({ labelEn: 'Khalifa City', labelAr: 'مدينة خليفة', key: 'loc', isUpdated: true });
          }
          
          if (bufferRadiusKm > 0) {
            activeFilterChips.push({ labelEn: `${bufferRadiusKm} km radius`, labelAr: `نطاق ${bufferRadiusKm} كم`, key: 'radius' });
          }

          if (activeFilterChips.length > 0) {
            interp = {
              titleEn: 'Active Filters',
              titleAr: 'الفلاتر النشطة',
              chips: activeFilterChips,
            };
          }

          if (lower.includes('how many private') || lower.includes('private school')) {
            countData = {
              count: matchedFeats.length > 0 ? matchedFeats.length : 8,
              titleEn: 'Private Schools Found',
              titleAr: 'المدارس الخاصة المكتشفة',
              scopeEn: 'Zayed City · 5 km radius',
              scopeAr: 'مدينة زايد · نطاق 5 كم',
            };
          } else if (lower.includes('how many open') || lower.includes('open now')) {
            countData = {
              count: 4,
              titleEn: 'Open Vehicle Inspection Centers',
              titleAr: 'مراكز فحص المركبات المفتوحة',
              scopeEn: 'Current location radius',
              scopeAr: 'نطاق الموقع الحالي',
            };
          }

          isExplicitListRequest =
            isExplicitListRequest ||
            lower.includes('show list') ||
            lower.includes('view list') ||
            lower.includes('show results') ||
            lower.includes('view results') ||
            lower.includes('view all') ||
            lower.includes('show private schools list') ||
            lower.includes('show on map') ||
            lower.includes('show all 3') ||
            lower.includes('show open centers') ||
            lower.includes('show all vehicle') ||
            lower.includes('list');

          // Global Recommendation Deduplication: Prevent recommending questions already asked in current or past turns
          const pastUserQueries = aiMessages
            .filter((m) => m.sender === 'user')
            .map((m) => m.textEn?.toLowerCase().trim())
            .filter(Boolean);

          const isAlreadyAsked = (rec: string) => {
            const rLower = rec.toLowerCase().trim();
            if (rLower === lower.trim()) return true;
            return pastUserQueries.some(
              (q) => q === rLower || (q && q.includes(rLower)) || (rLower.length > 8 && q && q.includes(rLower.slice(0, 15)))
            );
          };

          recsEn = recsEn.filter((r) => !isAlreadyAsked(r));
          recsAr = recsAr.filter((r) => !isAlreadyAsked(r));

          const aiRespMsg: AIMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            textEn: responseEn,
            textAr: responseAr,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            recommendationsEn: recsEn,
            recommendationsAr: recsAr,
            matchedFeatures: matchedFeats,
            trustLevel: 'authoritative',
            queryInterpretation: interp,
            countCardData: countData,
            disambiguationOptions: disambigOpts,
            unsupportedAction: unsuppAction,
            noResultsSuggestions: noResSuggs,
            categoryBreakdown: catBreakdown,
            openHoursBreakdown: openChartData,
            locationPromptRequired: locRequired,
            detailsFeatureId: detFeatId,
            detailsFeature: detFeat,
            showPrivateListAction: showPrivList,
            showResultsList: isExplicitListRequest,
            mapAction: {
              type: 'zoom_and_filter',
              center: newCenter,
              zoom: newZoom,
            },
          };

          setConversationContext(prev => ({
            ...prev,
            currentResults: matchedFeats,
            resultCount: matchedFeats.length,
          }));
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
        setAiMessages,
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
        deleteSession,
        clearAllHistory,
        loadSession,
        conversationContext,
        resetConversationContext,
        startNewConversation,
        userLocation,
        setUserLocation,
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
