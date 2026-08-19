import React from 'react';
import { AISearchBar } from '../ai/AISearchBar';
import { useAppState } from '../../context/AppStateContext';
import { MapPin } from 'lucide-react';
import homeVideo from '../../assets/homevideo.mp4';

export const LandingPage: React.FC = () => {
  const { language } = useAppState();

  return (
    <div className="relative w-full min-h-screen pt-24 sm:pt-28 pb-10 px-4 sm:px-12 md:px-16 flex flex-col items-start justify-between bg-spatial-canvas overflow-hidden">
      
      {/* Background Video Layer — Full Original Video */}
      <video
        src={homeVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none z-0"
      />

      {/* Left-Aligned Hero & Search Launchpad */}
      <div className="relative z-10 w-full max-w-3xl text-left rtl:text-right space-y-4 my-auto flex flex-col items-start">
        
        {/* BIG GeoVision Hero Brand Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-[#063360] dark:text-white tracking-tight flex items-center gap-2 drop-shadow-md">
            GeoVision
            <MapPin className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#215A9E] fill-[#215A9E] shrink-0" />
          </h1>
        </div>

        {/* Small Elegant Sub-Headline */}
        <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#063360] dark:text-white tracking-tight drop-shadow-sm">
          {language === 'ar' ? (
            <>
              استكشف البيانات المكانية في <span className="text-[#215A9E] font-black underline underline-offset-4 decoration-[#7DA1C4]">أبوظبي</span>
            </>
          ) : (
            <>
              Explore Public Data Across <span className="text-[#215A9E] font-black underline underline-offset-4 decoration-[#7DA1C4]">Abu Dhabi</span>
            </>
          )}
        </h2>

        {/* Description Subtitle */}
        <p className="text-xs sm:text-sm sm:text-base text-[#545860] dark:text-slate-200 max-w-xl font-bold leading-relaxed drop-shadow-xs">
          {language === 'ar'
            ? 'ابحث عن أسئلة باللغة الطبيعية، واكتشف البيانات المكانية الموثوقة، واستكشف الخرائط التفاعلية في جميع أنحاء الإمارة.'
            : 'Search natural language questions, discover authoritative public datasets, and explore interactive maps across the emirate.'}
        </p>

        {/* Main Glass AI Search Bar */}
        <div className="pt-2 w-full">
          <AISearchBar />
        </div>

      </div>

    </div>
  );
};

export default LandingPage;
