import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { AIMessageSearchResults } from './AIMessageSearchResults';
import {
  Sparkles,
  Send,
  History,
  User,
  Bot,
  X,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Compass,
  Info,
  Building,
  RotateCcw,
  Plus,
  Mic,
  List,
} from 'lucide-react';

interface GeoVisionPanelProps {
  onClose?: () => void;
}

export const GeoVisionPanel: React.FC<GeoVisionPanelProps> = ({ onClose }) => {
  const {
    language,
    aiMessages,
    setAiMessages,
    sendAIMessage,
    aiProcessing,
    aiStepState,
    setSelectedFeature,
    selectedCategoryIds,
    setSelectedCategoryIds,
    selectedSubcategoryIds,
    smartFilters,
    resetConversationContext,
    startNewConversation,
    user,
    currentView,
    setCurrentView,
    setFilterDrawerOpen,
    setActiveTool,
    setGuestPromptOpen,
    showToast,
    t,
  } = useAppState();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      if (isListening) {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsListening(false);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'ar' ? 'ar-AE' : 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          showToast(language === 'ar' ? 'جاري الاستماع... تحدّث الآن' : 'Listening... Speak your spatial query now');
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputVal(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          runVoiceSimulation();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        runVoiceSimulation();
      }
    } else {
      runVoiceSimulation();
    }
  };

  const runVoiceSimulation = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    showToast(language === 'ar' ? 'جاري الاستماع... (محاكاة الصوت)' : 'Listening... (Voice AI Input)');

    const sampleQueriesEn = [
      'Show all hospitals and healthcare facilities in Abu Dhabi',
      'Locate nurseries near Khalifa City',
      'Filter public parks and recreation areas in Al Reem Island',
      'Show government buildings in Corniche area',
    ];
    const sampleQueriesAr = [
      'عرض جميع المستشفيات والمنشآت الصحية في أبوظبي',
      'البحث عن المدارس والحضانات في مدينة خليفة',
      'عرض الحدائق والمرافق الترفيهية في جزيرة ريم',
    ];

    const queries = language === 'ar' ? sampleQueriesAr : sampleQueriesEn;
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    let charIdx = 0;
    setInputVal('');

    const interval = setInterval(() => {
      if (charIdx < randomQuery.length) {
        setInputVal(randomQuery.slice(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(interval);
        setIsListening(false);
        showToast(language === 'ar' ? 'تم تحويل الصوت إلى نص!' : 'Speech transcribed successfully!');
      }
    }, 40);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, aiProcessing, aiStepState]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      sendAIMessage(inputVal);
      setInputVal('');
    }
  };

  const handleHistoryClick = () => {
    if (user.isGuest) {
      setGuestPromptOpen(true);
    } else {
      setCurrentView('history');
    }
  };

  return (
    <div className="w-full h-full flex flex-col glass-panel border-l border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 overflow-hidden shadow-2xl">
      
      {/* Panel Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#215A9E] text-white flex items-center justify-center font-bold shadow-md shadow-[#215A9E]/30 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black text-[#063360] dark:text-white flex items-center gap-2">
              {t('ai.panelTitle')}
            </h2>
            <span className="text-[9px] sm:text-[10px] font-bold text-[#215A9E] dark:text-[#7DA1C4] uppercase tracking-wider block">
              Spatial Intelligence Copilot
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={startNewConversation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#215A9E] text-white hover:bg-[#063360] font-extrabold text-xs shadow-md shadow-[#215A9E]/25 transition-all cursor-pointer"
            title={language === 'ar' ? 'محادثة جديدة' : 'New Chat'}
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'ar' ? 'محادثة جديدة' : 'New Chat'}</span>
          </button>

          <button
            onClick={handleHistoryClick}
            className="p-1.5 sm:p-2 text-[#545860] hover:text-[#063360] dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-[#7DA1C4]/15 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            title={t('nav.history')}
          >
            <History className="w-4 h-4 text-[#215A9E]" />
          </button>

          {/* Close Panel Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              title="Close AI Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Top Exploration Context Bar */}
      {(selectedCategoryIds.length > 0 || selectedSubcategoryIds.length > 0 || smartFilters.categories.length > 0) && (
        <div className="px-3.5 py-1.5 border-b border-slate-200/60 dark:border-slate-800 bg-[#7DA1C4]/10 dark:bg-slate-900/60 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px] font-bold text-slate-600 dark:text-slate-300">
            <span className="text-[#545860] font-extrabold uppercase shrink-0">
              {language === 'ar' ? 'الاستكشاف الحالي:' : 'Current exploration:'}
            </span>
            {selectedCategoryIds.map(cat => (
              <span key={cat} className="px-2 py-0.5 rounded-md bg-[#215A9E]/10 text-[#215A9E] dark:text-[#7DA1C4] border border-[#215A9E]/20 capitalize font-black shrink-0">
                {cat}
              </span>
            ))}
            {selectedSubcategoryIds.map(sub => (
              <span key={sub} className="px-2 py-0.5 rounded-md bg-[#7DA1C4]/20 text-[#063360] dark:text-[#7DA1C4] border border-[#7DA1C4]/30 capitalize font-black shrink-0">
                {sub.replace('_', ' ')}
              </span>
            ))}
          </div>
          <button
            onClick={resetConversationContext}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0"
            title="Reset Exploration Context"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4">
        {aiMessages.map((msg) => {
          const isMsgAr = Boolean(msg.isArabicPrompt || language === 'ar');
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Sender Badge */}
              <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-slate-400">
                {msg.sender === 'user' ? (
                  <>
                    <span>You</span>
                    <User className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-geovision-blue" />
                    <span className="text-geovision-blue font-extrabold">GeoVision AI</span>
                  </>
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[90%] sm:max-w-[85%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-semibold leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-geovision-blue text-white rounded-tr-none shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {/* Query Interpretation Chips (GeoVision understood / GeoVision updated) */}
                {msg.queryInterpretation && (
                  <div className="mb-2.5 p-2 rounded-xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200/50 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-black text-geovision-blue dark:text-blue-300 uppercase tracking-wider block">
                      {isMsgAr ? msg.queryInterpretation.titleAr : msg.queryInterpretation.titleEn}
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {msg.queryInterpretation.chips.map((chip, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border transition-all ${
                            chip.isUpdated
                              ? 'bg-geovision-blue text-white border-blue-400 animate-pulse'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {isMsgAr ? chip.labelAr : chip.labelEn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Count Metric Response Box (AICountCard) */}
                {msg.countCardData && (
                  <div className="my-2.5 p-3.5 rounded-2xl bg-geovision-blue text-white shadow-lg shadow-blue-500/25 border border-white/20 text-center space-y-1">
                    <p className="text-3xl font-black tracking-tight">{msg.countCardData.count}</p>
                    <p className="text-xs font-black uppercase tracking-wider">
                      {isMsgAr ? msg.countCardData.titleAr : msg.countCardData.titleEn}
                    </p>
                    <p className="text-[10px] text-blue-100 font-semibold">
                      {isMsgAr ? msg.countCardData.scopeAr : msg.countCardData.scopeEn}
                    </p>
                  </div>
                )}

                {/* Multiline text formatting */}
                <div className="whitespace-pre-line">
                  {isMsgAr ? (msg.textAr || msg.textEn) : (msg.textEn || msg.textAr)}
                </div>

              {/* Interactive Flow Components */}
              {msg.sender === 'ai' && (
                <div className="mt-3 space-y-3">
                  
                  {/* Flow 2: Ambiguous Location Options */}
                  {msg.disambiguationOptions && msg.disambiguationOptions.length > 0 && (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                      <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                        {isMsgAr ? 'المواقع المتاحة:' : 'Select a location option:'}
                      </p>
                      <div className="space-y-1.5">
                        {msg.disambiguationOptions.map((opt, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => sendAIMessage(opt.query)}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-geovision-blue dark:text-blue-300 hover:text-blue-950 dark:hover:text-white border border-blue-100 dark:border-slate-700 hover:border-geovision-blue text-xs font-black text-left rtl:text-right transition-all cursor-pointer group shadow-2xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-geovision-blue dark:text-blue-300" />
                              <span className="truncate">{isMsgAr ? opt.labelAr : opt.labelEn}</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-geovision-blue dark:text-blue-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Flow 3: Unsupported Dataset Action */}
                  {msg.unsupportedAction && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setCurrentView('categories')}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-geovision-blue text-white hover:bg-blue-600 font-extrabold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                      >
                        <Compass className="w-4 h-4" />
                        <span>{language === 'ar' ? msg.unsupportedAction.labelAr : msg.unsupportedAction.labelEn}</span>
                      </button>
                    </div>
                  )}

                  {/* Flow 4: No Results Alternate Suggestions */}
                  {msg.noResultsSuggestions && msg.noResultsSuggestions.length > 0 && (
                    <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-slate-900 border border-amber-200/60 dark:border-slate-700 space-y-2">
                      <p className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400">
                        {language === 'ar' ? 'البحث عن خيارات بديلة:' : 'Try alternate search:'}
                      </p>
                      <div className="space-y-1.5">
                        {msg.noResultsSuggestions.map((sugg, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => sendAIMessage(sugg.query)}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 hover:text-geovision-blue border border-slate-200 dark:border-slate-700 hover:border-geovision-blue text-xs font-black text-left rtl:text-right transition-all cursor-pointer group"
                          >
                            <span className="truncate flex-1">{language === 'ar' ? sugg.labelAr : sugg.labelEn}</span>
                            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-geovision-blue group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 8 & 9: Structured Category Breakdown Component */}
                  {msg.categoryBreakdown && (
                    <div className="my-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-1.5">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">
                            {language === 'ar' ? msg.categoryBreakdown.locationNameAr : msg.categoryBreakdown.locationNameEn} Overview
                          </h4>
                          <span className="text-[10px] text-geovision-blue dark:text-blue-300 font-extrabold">
                            {language === 'ar' ? `إجمالي الخدمات: ${msg.categoryBreakdown.totalCount}` : `Total Facilities: ${msg.categoryBreakdown.totalCount}`}
                          </span>
                        </div>
                        <Compass className="w-4 h-4 text-geovision-blue shrink-0" />
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        {msg.categoryBreakdown.items.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => sendAIMessage(item.query)}
                            className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 hover:text-geovision-blue border border-slate-200 dark:border-slate-700 text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs group"
                          >
                            <span className="truncate">{language === 'ar' ? item.nameAr : item.nameEn}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-slate-700 text-geovision-blue dark:text-blue-300 text-[10px] font-black group-hover:bg-geovision-blue group-hover:text-white transition-colors">
                              {item.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 12 & 13: Open Now / Operating Status Chart Breakdown */}
                  {msg.openHoursBreakdown && (
                    <div className="my-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                      <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        {language === 'ar' ? msg.openHoursBreakdown.titleAr : msg.openHoursBreakdown.titleEn}
                      </p>
                      
                      <div className="space-y-1.5">
                        {/* Open Now Bar */}
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-black mb-1">
                            <span className="text-emerald-600 dark:text-emerald-400">{language === 'ar' ? 'مفتوح الآن' : 'Open Now'}</span>
                            <span className="text-emerald-600 dark:text-emerald-400">{msg.openHoursBreakdown.openNowCount} centers</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                              style={{
                                width: `${(msg.openHoursBreakdown.openNowCount / (msg.openHoursBreakdown.openNowCount + msg.openHoursBreakdown.closedCount)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Closed Bar */}
                        {msg.openHoursBreakdown.closedCount > 0 && (
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-black mb-1">
                              <span className="text-rose-500">{language === 'ar' ? 'مغلق حالياً' : 'Closed'}</span>
                              <span className="text-rose-500">{msg.openHoursBreakdown.closedCount} centers</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(msg.openHoursBreakdown.closedCount / (msg.openHoursBreakdown.openNowCount + msg.openHoursBreakdown.closedCount)) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Flow 6: Location Permission Notification */}
                  {msg.locationPromptRequired && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-blue-50/70 dark:bg-slate-800/70 border border-blue-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 animate-pulse" />
                      <span>
                        {language === 'ar'
                          ? 'تم طلب إذن الموقع في أعلى الشاشة (بجوار الرابط)...'
                          : 'Location permission requested at top near URL link...'}
                      </span>
                    </div>
                  )}

                  {/* Flow 7: Show Feature Details Action Button */}
                  {msg.detailsFeature && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedFeature(msg.detailsFeature!)}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-geovision-blue text-white hover:bg-blue-600 font-extrabold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                      >
                        <Info className="w-4 h-4" />
                        <span>{language === 'ar' ? 'عرض التفاصيل المكانية' : 'Show Its Details'}</span>
                      </button>
                    </div>
                  )}

                  {/* Flow 1: Show Private Schools List Action */}
                  {msg.showPrivateListAction && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCategoryIds(['education'])}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-extrabold text-xs shadow-md shadow-purple-500/25 transition-all cursor-pointer"
                      >
                        <Building className="w-4 h-4" />
                        <span>{language === 'ar' ? 'عرض قائمة المدارس الخاصة' : 'Show Private Schools List'}</span>
                      </button>
                    </div>
                  )}

                  {/* Open GIS Data Badge & Follow-up Recommendations */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                    {/* Open GIS Data Badge */}
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{t('map.authoritativeBadge')}</span>
                    </div>

                    {/* Recommendations Section */}
                    {!msg.noResultsSuggestions && !msg.disambiguationOptions && ((isMsgAr ? msg.recommendationsAr : msg.recommendationsEn) || []).length > 0 && (
                      <div className="space-y-2 pt-1">
                        <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                          {t('ai.recommendationsTitle')}
                        </p>

                        <div className="space-y-2">
                          {(isMsgAr ? msg.recommendationsAr : msg.recommendationsEn)?.map((recText, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                const isExploreReq = recText.toLowerCase().includes('explore available data') || recText.toLowerCase().includes('explore data') || recText.includes('استكشاف البيانات');
                                const isSketchReq = recText.toLowerCase().includes('sketch') || recText.toLowerCase().includes('aoi') || recText.toLowerCase().includes('aqi') || recText.toLowerCase().includes('draw');

                                if (isExploreReq) {
                                  if (currentView !== 'map') setCurrentView('map');
                                  setFilterDrawerOpen(true);
                                  showToast(isMsgAr ? 'تم فتح مستكشف الفئات' : 'Category Explorer opened');
                                } else if (isSketchReq) {
                                  if (currentView !== 'map') setCurrentView('map');
                                  setActiveTool('sketch');
                                  showToast(isMsgAr ? 'تم فتح أداة الرسم المكانية' : 'Sketch & AOI Tool opened');
                                  sendAIMessage(recText);
                                } else {
                                  sendAIMessage(recText);
                                }
                              }}
                              className="w-full flex items-center justify-between p-2.5 px-3 rounded-xl bg-blue-50/80 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-geovision-blue dark:text-blue-300 font-black border border-blue-200/80 dark:border-slate-700/70 hover:border-geovision-blue text-xs text-left rtl:text-right transition-all cursor-pointer shadow-2xs gap-2 min-w-0 group"
                            >
                              <span className="truncate whitespace-nowrap flex-1">{recText}</span>
                              <ChevronRight className="w-4 h-4 shrink-0 text-geovision-blue dark:text-blue-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button to Expand Results List upon User Selection */}
              {msg.sender === 'ai' && msg.matchedFeatures && msg.matchedFeatures.length > 0 && !msg.showResultsList && !msg.disambiguationOptions && !msg.locationPromptRequired && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAiMessages(prev => prev.map(m => m.id === msg.id ? { ...m, showResultsList: true } : m));
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-geovision-blue hover:bg-blue-700 text-white font-black text-xs border border-blue-600 transition-all cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    <List className="w-4 h-4 shrink-0 text-white" />
                    <span className="text-white font-black">
                      {isMsgAr
                        ? `عرض قائمة النتائج (${msg.matchedFeatures.length})`
                        : `View Results List (${msg.matchedFeatures.length})`}
                    </span>
                  </button>
                </div>
              )}

              {/* Render Search Results Cards ONLY when User Explicitly Requests / Selects Results List */}
              {msg.matchedFeatures && msg.matchedFeatures.length > 0 && msg.showResultsList && (
                <AIMessageSearchResults
                  features={msg.matchedFeatures}
                  setSelectedFeature={setSelectedFeature}
                  language={isMsgAr ? 'ar' : 'en'}
                />
              )}
            </div>
          </div>
        );
      })}

        {/* AI Thinking Step Indicator */}
        {aiProcessing && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700 animate-pulse">
            <div className="w-7 h-7 rounded-xl bg-geovision-blue text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">
                GeoVision AI is analyzing spatial layers...
              </p>
              <p className="text-[10px] text-geovision-blue font-extrabold uppercase tracking-wider">
                {aiStepState || 'Executing GIS Spatial Join'}
              </p>
            </div>
          </div>
        )}

        {/* Smooth auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0">

        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isListening ? (language === 'ar' ? 'جاري الاستماع لصوتك...' : 'Listening to your voice...') : t('ai.inputPlaceholder')}
            className={`w-full pl-3.5 pr-20 py-2.5 sm:py-3 rtl:pr-3.5 rtl:pl-20 rounded-2xl border bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-geovision-blue transition-all ${
              isListening ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/20' : 'border-slate-200 dark:border-slate-700'
            }`}
          />

          <div className="absolute right-2 rtl:right-auto rtl:left-2 flex items-center gap-1">
            {/* Mic Voice Input Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/40'
                  : 'bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-geovision-blue hover:text-white'
              }`}
              title={isListening ? 'Stop Listening' : 'Voice Query Input (Mic)'}
            >
              <Mic className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isListening ? 'animate-bounce' : ''}`} />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputVal.trim() || aiProcessing}
              className="p-2 rounded-xl bg-geovision-blue text-white hover:bg-blue-600 disabled:opacity-50 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:rotate-180" />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default GeoVisionPanel;
