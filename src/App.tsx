import React from 'react';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { AppHeader } from './components/layout/AppHeader';
import { LandingPage } from './components/pages/LandingPage';
import { MapWorkspace } from './components/map/MapWorkspace';
import { CategoryExplorer } from './components/categories/CategoryExplorer';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { HelpPage } from './components/pages/HelpPage';
import { FavoritesPage } from './components/pages/FavoritesPage';
import { HistoryPage } from './components/pages/HistoryPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { AuthModal } from './components/auth/AuthModal';
import { GuestPromptModal } from './components/auth/GuestPromptModal';
import { FeedbackModal } from './components/common/FeedbackModal';
import { Toast } from './components/common/Toast';

const MainContent: React.FC = () => {
  const { currentView } = useAppState();

  return (
    <main className="w-full min-h-[calc(100vh-4rem)]">
      {currentView === 'home' && <LandingPage />}
      {currentView === 'map' && <MapWorkspace />}
      {currentView === 'categories' && <CategoryExplorer />}
      {currentView === 'about' && <AboutUsPage />}
      {currentView === 'help' && <HelpPage />}
      {currentView === 'favorites' && <FavoritesPage />}
      {currentView === 'history' && <HistoryPage />}
      {currentView === 'profile' && <ProfilePage />}
    </main>
  );
};

export function App() {
  return (
    <AppStateProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <AppHeader />
        <MainContent />
        <AuthModal />
        <GuestPromptModal />
        <FeedbackModal />
        <Toast />
      </div>
    </AppStateProvider>
  );
}

export default App;
