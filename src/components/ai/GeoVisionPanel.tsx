import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  Sparkles,
  Send,
  History,
  User,
  Bot,
  X,
  ChevronRight,
  RotateCcw,
  Plus,
  Mic,
  BarChart2,
  AlertTriangle,
} from 'lucide-react';

interface GeoVisionPanelProps {
  onClose?: () => void;
}

export const GeoVisionPanel: React.FC<GeoVisionPanelProps> = ({ onClose }) => {
  const {
    language,
    aiMessages,
    sendAIMessage,
    aiProcessing,
    aiStepState,
    selectedCategoryIds,
    selectedSubcategoryIds,
    smartFilters,
    resetConversationContext,
    startNewConversation,
    user,
    setCurrentView,
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
      'Show high-risk manufacturing facilities in Abu Dhabi',
      'Compare emissions between Mussafah and KIZAD',
      'Why is this facility high risk?',
      'Show all hospitals and healthcare facilities in Abu Dhabi',
    ];
    const sampleQueriesAr = [
      'عرض المنشآت الصناعية عالية الخطورة في أبوظبي',
      'مقارنة الانبعاثات بين مصفح وكيزاد',
      'لماذا هذه المنشأة عالية الخطورة؟',
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
            className="p-1.5 sm:p-2 text-[#545860] hover:text-[#063360] dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-[#7DA1C4]/15 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('nav.history')}
          >
            <History className="w-4 h-4 text-[#215A9E]" />
          </button>

          {/* Close Panel Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                className={`max-w-[95%] sm:max-w-[90%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-semibold leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-geovision-blue text-white rounded-tr-none shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {/* Query Interpretation Chips */}
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

                {/* Multiline text formatting */}
                <div className="whitespace-pre-line leading-relaxed">
                  {isMsgAr ? (msg.textAr || msg.textEn) : (msg.textEn || msg.textAr)}
                </div>

                {/* Spatial Comparison Chart (e.g. Mussafah vs KIZAD) - Directly Visible */}
                {msg.comparisonData && (
                  <div className="my-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 shadow-md space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <BarChart2 className="w-4 h-4 text-geovision-blue" />
                          {isMsgAr ? msg.comparisonData.titleAr : msg.comparisonData.titleEn}
                        </h4>
                        {msg.comparisonData.subtitleEn && (
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {isMsgAr ? msg.comparisonData.subtitleAr : msg.comparisonData.subtitleEn}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-slate-800 text-geovision-blue dark:text-blue-300 text-[10px] font-black border border-blue-200/60 dark:border-slate-700">
                        {isMsgAr ? 'مقارنة مكانية' : 'Spatial Comparison'}
                      </span>
                    </div>

                    {/* Two Entity Highlight Cards */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Entity A */}
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-700 dark:text-amber-300">
                            {isMsgAr ? msg.comparisonData.entityA.nameAr : msg.comparisonData.entityA.nameEn}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[9px] font-extrabold">
                            {msg.comparisonData.entityA.badge}
                          </span>
                        </div>
                        <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                          {msg.comparisonData.entityA.totalEmissions}
                        </p>
                      </div>

                      {/* Entity B */}
                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-blue-700 dark:text-blue-300">
                            {isMsgAr ? msg.comparisonData.entityB.nameAr : msg.comparisonData.entityB.nameEn}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[9px] font-extrabold">
                            {msg.comparisonData.entityB.badge}
                          </span>
                        </div>
                        <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                          {msg.comparisonData.entityB.totalEmissions}
                        </p>
                      </div>
                    </div>

                    {/* Metric Comparison Bars */}
                    <div className="space-y-2.5 pt-1">
                      {msg.comparisonData.metrics.map((m, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-600 dark:text-slate-300">{isMsgAr ? m.labelAr : m.labelEn}</span>
                            <div className="flex items-center gap-3 text-[10px] font-black">
                              <span className="text-amber-600 dark:text-amber-400 font-extrabold">{m.valA}</span>
                              <span className="text-slate-300 dark:text-slate-600">vs</span>
                              <span className="text-blue-600 dark:text-blue-400 font-extrabold">{m.valB}</span>
                            </div>
                          </div>

                          {/* Dual Comparative Progress Bar */}
                          <div className="grid grid-cols-2 gap-1.5 h-2.5">
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex justify-end">
                              <div
                                className="h-full bg-amber-500 rounded-full transition-all duration-700"
                                style={{ width: `${m.percentA}%` }}
                              />
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-geovision-blue rounded-full transition-all duration-700"
                                style={{ width: `${m.percentB}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Takeaway Insight */}
                    {msg.comparisonData.takeawayEn && (
                      <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-geovision-blue shrink-0 mt-0.5" />
                        <span className="leading-snug">{isMsgAr ? msg.comparisonData.takeawayAr : msg.comparisonData.takeawayEn}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Multi-Factor Facility Risk Evaluation Breakdown - Directly Visible */}
                {msg.riskBreakdownData && (
                  <div className="my-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 shadow-md space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {msg.riskBreakdownData.riskLevel} Risk Facility
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            • {isMsgAr ? msg.riskBreakdownData.zoneAr : msg.riskBreakdownData.zoneEn}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-1">
                          {isMsgAr ? msg.riskBreakdownData.facilityNameAr : msg.riskBreakdownData.facilityNameEn}
                        </h4>
                      </div>

                      {/* Overall Score Circle Badge */}
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-600 text-white shadow-md shadow-rose-500/25 shrink-0">
                        <span className="text-base font-black leading-none">{msg.riskBreakdownData.overallScore}</span>
                        <span className="text-[8px] font-extrabold uppercase opacity-90">Index</span>
                      </div>
                    </div>

                    {/* Primary Risk Driver */}
                    <div className="p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 text-[11px] font-bold text-rose-900 dark:text-rose-200">
                      <span className="font-black uppercase text-[10px] text-rose-600 dark:text-rose-400 block mb-0.5">
                        {isMsgAr ? 'السبب الرئيسي للخطورة:' : 'Primary Risk Factor:'}
                      </span>
                      {isMsgAr ? msg.riskBreakdownData.primaryReasonAr : msg.riskBreakdownData.primaryReasonEn}
                    </div>

                    {/* 4 Multi-Factor Evaluation Bars */}
                    <div className="space-y-2 pt-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {isMsgAr ? 'معايير تقييم المخاطر البيئية (EAD):' : 'EAD Environmental Risk Criteria:'}
                      </p>

                      {msg.riskBreakdownData.factors.map((f, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-extrabold">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-800 dark:text-slate-200">{isMsgAr ? f.categoryAr : f.categoryEn}</span>
                              <span className="text-[9px] text-slate-400">({f.weight})</span>
                            </div>
                            <span className={`text-[10px] font-black ${
                              f.score >= 90 ? 'text-rose-600 dark:text-rose-400' : f.score >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {f.score}/100
                            </span>
                          </div>

                          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                f.score >= 90 ? 'bg-rose-500' : f.score >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${f.score}%` }}
                            />
                          </div>

                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                            {isMsgAr ? f.detailAr : f.detailEn}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Compliance & Audit Box */}
                    {msg.riskBreakdownData.complianceInfo && (
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>🛡️ {isMsgAr ? msg.riskBreakdownData.complianceInfo.authorityAr : msg.riskBreakdownData.complianceInfo.authorityEn}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                          {isMsgAr ? msg.riskBreakdownData.complianceInfo.cemsStatusAr : msg.riskBreakdownData.complianceInfo.cemsStatusEn}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommendations Section */}
                {!msg.noResultsSuggestions && !msg.disambiguationOptions && ((isMsgAr ? msg.recommendationsAr : msg.recommendationsEn) || []).length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700/60 mt-3">
                    <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                      {t('ai.recommendationsTitle')}
                    </p>

                    <div className="space-y-1.5">
                      {(isMsgAr ? msg.recommendationsAr : msg.recommendationsEn)?.map((recText, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendAIMessage(recText)}
                          className="w-full flex items-center justify-between p-2 px-3 rounded-xl bg-blue-50/80 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-geovision-blue dark:text-blue-300 font-black border border-blue-200/80 dark:border-slate-700/70 hover:border-geovision-blue text-xs text-left rtl:text-right transition-all cursor-pointer shadow-2xs gap-2 min-w-0 group"
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
                {aiStepState || 'Executing GIS Spatial Join & Risk Scoring'}
              </p>
            </div>
          </div>
        )}

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
