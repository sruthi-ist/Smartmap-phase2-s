import React from 'react';
import { AISearchBar } from '../ai/AISearchBar';
import { Sparkles } from 'lucide-react';
import homeVideo from '../../assets/homevideo.mp4';

export const LandingPage: React.FC = () => {
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

      {/* Left-Aligned Hero & Search Launchpad without Box Container */}
      <div className="relative z-10 w-full max-w-3xl text-left rtl:text-right space-y-6 my-auto flex flex-col items-start">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black glass-level-1 text-geovision-blue border border-white/90 dark:border-blue-900/50 shadow-xs">
          <Sparkles className="w-4 h-4 text-geovision-blue animate-pulse" />
          <span>AI-Powered Spatial Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-tight max-w-2xl drop-shadow-md">
          Ask. Explore. Understand Abu Dhabi.
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-base text-slate-900 dark:text-slate-100 max-w-xl font-bold leading-relaxed drop-shadow-sm">
          Interact naturally with trusted spatial information, discover places, and analyze locations through GeoVision.
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
