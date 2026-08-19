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
    ],
    recommendationsAr: [
      'عرض المستشفيات في مدينة خليفة',
      'البحث عن المدارس القريبة من جزيرة ياس',
      'عرض الحدائق العامة في أبوظبي',
      'تحليل الخدمات الحكومية بالقرب من جزيرة الريم',
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

          // Intelligent NLU Matching Engine for 7 Conversational Flows
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
          let locRequired = false;
          let detFeatId: string | undefined;
          let detFeat: GeoFeature | undefined;
          let showPrivList = false;

          // -------------------------------------------------------------------------
          // FLOW 3: Unsupported Requests (e.g., "richest areas", "crime rate", "wealth")
          // -------------------------------------------------------------------------
          if (lower.includes('richest') || lower.includes('wealth') || lower.includes('income') || lower.includes('crime') || lower.includes('real estate price')) {
            responseEn = "I can search and analyze the available GeoVision datasets, but I don't have a dataset that represents the requested information.\n\nYou can try:\n• Show bus stops in Abu Dhabi\n• Show airport areas\n• Show service areas within 2km";
            responseAr = "يمكنني البحث وتحليل مجموعات بيانات GeoVision المتاحة، ولكن ليس لدي مجموعة بيانات تمثل المعلومات المطلوبة.\n\nيمكنك تجربة:\n• عرض محطات الحافلات في أبوظبي\n• عرض مناطق المطار\n• عرض نطاقات الخدمات ضمن 2 كم";
            unsuppAction = {
              actionType: 'open_explore',
              labelEn: 'Explore available data',
              labelAr: 'استكشاف البيانات المتاحة',
            };
            recsEn = ['Show bus stops in Abu Dhabi', 'Show airport areas', 'Show service areas within 2km'];
            recsAr = ['عرض محطات الحافلات في أبوظبي', 'عرض مناطق المطار', 'عرض نطاقات الخدمات ضمن 2 كم'];
          }

          // -------------------------------------------------------------------------
          // FLOW 4: No Result Experience (e.g., "rehab centers within 1km")
          // -------------------------------------------------------------------------
          else if (lower.includes('rehab') || (lower.includes('1km') && lower.includes('zayed city'))) {
            responseEn = 'No results were found for your request.';
            responseAr = 'لم يتم العثور على نتائج لطلبك.';
            noResSuggs = [
              { labelEn: 'show rehab centers within 5km of Zayed city', labelAr: 'عرض مراكز التأهيل ضمن 5 كم من مدينة زايد', query: 'show rehab centers within 5km of Zayed city' },
              { labelEn: 'show rehab centres around Zayed city', labelAr: 'عرض مراكز التأهيل حول مدينة زايد', query: 'show rehab centers around Zayed city' },
              { labelEn: 'show healthcare facilities', labelAr: 'عرض جميع المرافق الصحية', query: 'Show hospitals in Khalifa City' },
              { labelEn: 'show all rehab centres', labelAr: 'عرض كافة مراكز التأهيل', query: 'Show hospitals in Abu Dhabi' },
            ];
            recsEn = ['show rehab centers within 5km of Zayed city', 'show rehab centres around Zayed city', 'show healthcare facilities', 'show all rehab centres'];
            recsAr = ['عرض مراكز التأهيل ضمن 5 كم من مدينة زايد', 'عرض مراكز التأهيل حول مدينة زايد', 'عرض جميع المرافق الصحية', 'عرض كافة مراكز التأهيل'];
            matchedFeats = [];
          }

          // -------------------------------------------------------------------------
          // FLOW 2: Ambiguous Requests Handling ("parks near yas" / "yas")
          // -------------------------------------------------------------------------
          else if (lower === 'parks near yas' || lower === 'yas' || lower === 'park near yas') {
            responseEn = "Multiple possible locations found for 'yas'. Which location do you mean?";
            responseAr = "تم العثور على عدة مواقع محتملة لـ 'ياس'. أي موقع تقصد؟";
            disambigOpts = [
              { labelEn: 'Yas Island, Abu Dhabi (district)', labelAr: 'جزيرة ياس، أبوظبي (منطقة)', query: 'parks near Yas Island' },
              { labelEn: 'Yasat West Island, Al Dhafra Region (community)', labelAr: 'جزيرة الياسات الغربية، منطقة الظفرة', query: 'parks near Yasat West Island' },
              { labelEn: 'Bani Yas, Abu Dhabi (district)', labelAr: 'بني ياس، أبوظبي (منطقة)', query: 'parks near Bani Yas, Abu Dhabi' },
              { labelEn: 'Al Yasat Island, Al Dhafra Region (community)', labelAr: 'جزيرة الياسات، منطقة الظفرة', query: 'parks near Al Yasat Island' },
            ];
            recsEn = ['Yas Island, Abu Dhabi (district)', 'Bani Yas, Abu Dhabi (district)'];
            recsAr = ['جزيرة ياس، أبوظبي (منطقة)', 'بني ياس، أبوظبي (منطقة)'];
          }
          else if (lower.includes('bani yas')) {
            responseEn = 'Searching for parks near Bani Yas... Found 4 public parks and green spaces in Bani Yas.';
            responseAr = 'جاري البحث عن حدائق بالقرب من بني ياس... عثرت على 4 حدائق ومساحات خضراء في بني ياس.';
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'parks');
            newCenter = [24.3120, 54.6291];
            newZoom = 14;
            setSelectedCategoryIds(['parks']);
            recsEn = ['Explore Bani Yas with AOI sketch', 'Healthcare facilities nearby', 'Schools in Bani Yas'];
            recsAr = ['استكشاف بني ياس برسم الخريطة', 'مرافق الرعاية الصحية القريبة', 'مدارس في بني ياس'];
          }

          // -------------------------------------------------------------------------
          // FLOW 6: Prompts Requiring Location ("vehicle inspection centers near me")
          // -------------------------------------------------------------------------
          else if (lower.includes('vehicle inspection') || lower.includes('near me')) {
            if (lower.includes('open now') || lower.includes('how many open')) {
              responseEn = '2 vehicle inspection centers are currently open now near your location.';
              responseAr = 'يوجد مركزان لفحص المركبات مفتوحان الآن بالقرب من موقعك.';
              matchedFeats = GEO_FEATURES.filter(f => f.category === 'government' || f.category === 'transport');
              newCenter = [24.4539, 54.3773];
              newZoom = 14;
              recsEn = ['Show open centers on map', 'Get directions'];
              recsAr = ['عرض المراكز المفتوحة على الخريطة', 'الحصول على الاتجاهات'];
            } else if (lower.includes('enable location') || lower.includes('location enabled')) {
              responseEn = 'Location access granted. Found 3 vehicle inspection centers near your location.';
              responseAr = 'تم منح الإذن بالموقع. عثرت على 3 مراكز فحص المركبات بالقرب من موقعك.';
              matchedFeats = GEO_FEATURES.filter(f => f.category === 'government' || f.category === 'transport');
              newCenter = [24.4539, 54.3773];
              newZoom = 14;
              setSelectedCategoryIds(['government']);
              recsEn = ['how many open now', 'Show nearest center on map'];
              recsAr = ['كم عدد المراكز المفتوحة الآن؟', 'عرض المركز الأقرب على الخريطة'];
            } else {
              responseEn = 'Please enable location access to continue searching near your current location.';
              responseAr = 'يرجى تفعيل خدمة الموقع لمتابعة البحث بالقرب من موقعك الحالي.';
              locRequired = true;
              recsEn = ['Enable Location to Continue', 'Show all vehicle inspection centers'];
              recsAr = ['تفعيل خدمة الموقع للمتابعة', 'عرض جميع مراكز فحص المركبات'];
            }
          }

          // -------------------------------------------------------------------------
          // FLOW 1: Conversational Follow-up (Schools & Nurseries in Zayed City)
          // -------------------------------------------------------------------------
          else if (lower.includes('zayed city') && (lower.includes('school') || lower.includes('5km'))) {
            responseEn = 'Found 6 educational facilities in Zayed City within 5 km.';
            responseAr = 'عثرت على 6 مؤسسات تعليمية في مدينة زايد ضمن نطاق 5 كم.';
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'education');
            newCenter = [24.4012, 54.6051];
            newZoom = 14;
            setSelectedCategoryIds(['education']);
            recsEn = ['schools in bani yas', 'schools in Zayed city within 2km', 'schools near me', 'schools with Montessori curriculum'];
            recsAr = ['مدارس في بني ياس', 'مدارس في مدينة زايد على بعد 2 كم', 'مدارس قريبة مني', 'مدارس بخطة مونتيسوري'];
          }
          else if (lower.includes('only nurseries') || lower.includes('nurseries')) {
            responseEn = 'Context retained: Filtered results for nurseries in Zayed City. Found 2 nurseries matching your selection.';
            responseAr = 'تم الاحتفاظ بالسياق: تصفية النتائج للحضانات في مدينة زايد. عثرت على 2 من الحضانات.';
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'education' && (f.subcategory === 'nurseries' || f.nameEn.toLowerCase().includes('nursery')));
            newCenter = [24.4012, 54.6051];
            newZoom = 14;
            setSelectedSubcategoryIds(['nurseries']);
            recsEn = ['how many private schools are there near these nurseries', 'show all schools in Zayed City', 'Find healthcare near these nurseries'];
            recsAr = ['كم عدد المدارس الخاصة بالقرب من هذه الحضانات؟', 'عرض جميع المدارس في مدينة زايد', 'البحث عن خدمات صحية قريبة'];
          }
          else if (lower.includes('private school') || lower.includes('how many private')) {
            responseEn = 'There are 4 private schools located in the area around these nurseries. Would you like to see the details or list of private schools?';
            responseAr = 'توجد 4 مدارس خاصة في المنطقة القريبة من هذه الحضانات. هل ترغب في عرض التفاصيل أو قائمة المدارس الخاصة؟';
            showPrivList = true;
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'education');
            recsEn = ['Show private schools list', 'View private schools on map'];
            recsAr = ['عرض قائمة المدارس الخاصة', 'عرض المدارس الخاصة على الخريطة'];
          }

          // -------------------------------------------------------------------------
          // FLOW 7: Natural Multi-Turn Flow (Hospitals -> Gov -> Zayed Sports City -> Closest -> Details)
          // -------------------------------------------------------------------------
          else if (lower.includes('show its details') || lower.includes('view details') || lower.includes('show details')) {
            const targetFeat = GEO_FEATURES[0]; // SSMC
            responseEn = `Displaying complete geospatial details for ${targetFeat.nameEn}.`;
            responseAr = `جاري عرض التفاصيل الجغرافية الكاملة لـ ${targetFeat.nameAr}.`;
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
            responseEn = 'Found 3 government hospitals within 5 km of Zayed Sports City.';
            responseAr = 'عثرت على 3 مستشفيات حكومية ضمن نطاق 5 كم من مدينة زايد الرياضية.';
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'healthcare').slice(0, 3);
            newCenter = [24.4178, 54.4539];
            newZoom = 14;
            setBufferRadiusKm(5);
            setSelectedCategoryIds(['healthcare']);
            recsEn = ['Which one is closest?', 'Show its details', 'Show all 3 hospitals on map'];
            recsAr = ['أيها الأقرب؟', 'عرض التفاصيل', 'عرض جميع المستشفيات 3 على الخريطة'];
          }
          else if (lower.includes('government hospital') || lower.includes('only government')) {
            responseEn = 'Filtered: Found 11 government hospitals in Abu Dhabi.';
            responseAr = 'تم التصفية: عثرت على 11 مستشفى حكومي في أبوظبي.';
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'healthcare');
            setSelectedCategoryIds(['healthcare']);
            recsEn = ['Within 5 km of Zayed Sports City', 'Which one is closest?', 'Show private hospitals'];
            recsAr = ['ضمن 5 كم من مدينة زايد الرياضية', 'أيها الأقرب؟', 'عرض المستشفيات الخاصة'];
          }
          else if (lower.includes('hospital') || lower.includes('hospitals in abu dhabi')) {
            responseEn = 'Found 28 hospitals across Abu Dhabi Emirate.';
            responseAr = 'عثرت على 28 مستشفى في إمارة أبوظبي.';
            matchedFeats = GEO_FEATURES.filter(f => f.category === 'healthcare');
            newCenter = [24.4539, 54.3773];
            newZoom = 13;
            setSelectedCategoryIds(['healthcare']);
            recsEn = ['Only government hospitals', 'Within 5 km of Zayed Sports City', 'Which one is closest?'];
            recsAr = ['المستشفيات الحكومية فقط', 'ضمن 5 كم من مدينة زايد الرياضية', 'أيها الأقرب؟'];
          }
          else if (lower.includes('drawn') || lower.includes('sketch') || lower.includes('aoi') || lower.includes('polygon') || lower.includes('circle buffer') || lower.includes('point marker') || lower.includes('rectangle box')) {
            // Retrieve last drawn shape center or default to current map center
            const lastShape = userDrawnShapes.length > 0 ? userDrawnShapes[userDrawnShapes.length - 1] : null;
            let centerLat = lastShape?.lat || mapCenter[0];
            let centerLng = lastShape?.lng || mapCenter[1];

            // Parse coordinates directly from query if present (e.g. "at 24.453°N, 54.377°E")
            const coordMatch = query.match(/(\d+\.\d+)°N,\s*(\d+\.\d+)°E/);
            if (coordMatch) {
              centerLat = parseFloat(coordMatch[1]);
              centerLng = parseFloat(coordMatch[2]);
            }

            const isCircle = lower.includes('circle');
            const isPoint = lower.includes('point');
            const isRect = lower.includes('rectangle') || lower.includes('rect') || lower.includes('box');
            
            const shapeLabel = isCircle ? 'Circle Buffer (2 km)' : isPoint ? 'Point Marker Location' : isRect ? 'Rectangle Bounding Box' : 'Polygon Boundary AOI';
            const shapeLabelAr = isCircle ? 'نطاق دائرية (2 كم)' : isPoint ? 'موقع نقطي' : isRect ? 'مربع محيط' : 'حدود مضلع';

            const maxDistKm = isPoint ? 1.5 : isCircle ? 2.5 : isRect ? 3.0 : 3.5;

            // Perform dynamic spatial distance join against GEO_FEATURES
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
              // 0-Results experience when drawn shape has no features
              responseEn = `No GIS spatial features were found inside the drawn ${shapeLabel} area.\n\nTry drawing your AOI shape closer to urban hubs such as Khalifa City, Yas Island, or Abu Dhabi Center.`;
              responseAr = `لم يتم العثور على أي معالم جغرافية داخل منطقة ${shapeLabelAr} المرسومة.\n\nجرّب الرسم بالقرب من المناطق الحضرية مثل مدينة خليفة، جزيرة ياس، أو وسط أبوظبي.`;

              matchedFeats = [];
              noResSuggs = [
                { labelEn: 'Show schools in Zayed city within 5km', labelAr: 'عرض المدارس في مدينة زايد ضمن 5 كم', query: 'show schools in Zayed city within 5km' },
                { labelEn: 'parks near yas', labelAr: 'حدائق بالقرب من ياس', query: 'parks near yas' },
                { labelEn: 'Show hospitals in Abu Dhabi', labelAr: 'عرض المستشفيات في أبوظبي', query: 'Show hospitals in Abu Dhabi' },
              ];
              recsEn = ['Show schools in Zayed city within 5km', 'parks near yas', 'Show hospitals in Abu Dhabi'];
              recsAr = ['عرض المدارس في مدينة زايد ضمن 5 كم', 'حدائق بالقرب من ياس', 'عرض المستشفيات في أبوظبي'];
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

          if (lower.includes('drawn') || lower.includes('sketch') || lower.includes('aoi') || lower.includes('polygon') || lower.includes('circle buffer') || lower.includes('point marker') || lower.includes('rectangle box')) {
            const isCircle = lower.includes('circle');
            const isPoint = lower.includes('point');
            const isRect = lower.includes('rectangle') || lower.includes('rect') || lower.includes('box');
            
            const shapeLabel = isCircle ? 'Circle Buffer (2 km)' : isPoint ? 'Point Marker Location' : isRect ? 'Rectangle Bounding Box' : 'Polygon Boundary AOI';
            const shapeLabelAr = isCircle ? 'نطاق دائرية (2 كم)' : isPoint ? 'موقع نقطي' : isRect ? 'مربع محيط' : 'حدود مضلع';

            interp = {
              titleEn: 'GeoVision Spatial AOI Overlay',
              titleAr: 'تحليل التغطية المكانية GeoVision',
              chips: [
                { labelEn: 'Drawn Area', labelAr: 'المنطقة المرسومة', key: 'aoi', isUpdated: true },
                { labelEn: shapeLabel, labelAr: shapeLabelAr, key: 'shape' },
                { labelEn: '47 GIS Features', labelAr: '47 عنصر مكاني', key: 'count' },
              ],
            };

            countData = {
              count: 47,
              titleEn: 'GIS Items Found in Drawn Boundary',
              titleAr: 'عناصر جغرافية في المنطقة المرسومة',
              scopeEn: `Spatial Overlay Join (${shapeLabel})`,
              scopeAr: `الربط المكاني للمنطقة المرسومة`,
            };
          } else if (lower.includes('only nurseries') || lower.includes('nurseries')) {
            interp = {
              titleEn: 'GeoVision updated',
              titleAr: 'قام GeoVision بالتحديث',
              chips: [
                { labelEn: 'Nurseries', labelAr: 'حضانات', key: 'type', isUpdated: true },
                { labelEn: 'Zayed City', labelAr: 'مدينة زايد', key: 'loc' },
                { labelEn: '5 km', labelAr: '5 كم', key: 'radius' },
              ],
            };
          } else if (lower.includes('zayed city') && (lower.includes('school') || lower.includes('5km'))) {
            interp = {
              titleEn: 'GeoVision understood',
              titleAr: 'فهم GeoVision',
              chips: [
                { labelEn: 'Schools', labelAr: 'مدارس', key: 'type' },
                { labelEn: 'Zayed City', labelAr: 'مدينة زايد', key: 'loc' },
                { labelEn: '5 km', labelAr: '5 كم', key: 'radius' },
              ],
            };
          } else if (lower.includes('how many private') || lower.includes('private school')) {
            countData = {
              count: 6,
              titleEn: 'Private Schools',
              titleAr: 'مدارس خاصة',
              scopeEn: 'Current search area (Zayed City · 5 km)',
              scopeAr: 'نطاق البحث الحالي (مدينة زايد · 5 كم)',
            };
          } else if (lower.includes('how many open') || lower.includes('open now')) {
            countData = {
              count: 3,
              titleEn: 'Open Vehicle Inspection Centers',
              titleAr: 'مراكز فحص المركبات المفتوحة',
              scopeEn: 'Current location radius',
              scopeAr: 'نطاق الموقع الحالي',
            };
          }

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
            locationPromptRequired: locRequired,
            detailsFeatureId: detFeatId,
            detailsFeature: detFeat,
            showPrivateListAction: showPrivList,
            mapAction: {
              type: 'zoom_and_filter',
              center: newCenter,
              zoom: newZoom,
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
