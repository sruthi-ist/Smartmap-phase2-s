import React from 'react';
import { AISearchBar } from '../ai/AISearchBar';
import { Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen pt-24 sm:pt-28 pb-10 px-4 flex flex-col items-center justify-between bg-spatial-canvas">
      
      {/* Centered Compact Hero & Search Launchpad */}
      <div className="w-full max-w-4xl mx-auto text-center space-y-6 my-auto">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black glass-level-1 text-geovision-blue border border-white/70 dark:border-blue-900/50 shadow-2xs">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>AI-Powered Spatial Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-2xl mx-auto">
          Ask. Explore. Understand Abu Dhabi.
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-semibold leading-relaxed">
          Interact naturally with trusted spatial information, discover places, and analyze locations through GeoVision.
        </p>

        {/* Main Glass AI Search Bar */}
        <div className="pt-2 max-w-3xl mx-auto">
          <AISearchBar />
        </div>

      </div>

    </div>
  );
};

export default LandingPage;
