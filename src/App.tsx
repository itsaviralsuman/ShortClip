import React, { useState } from 'react';
import { QuotaProvider } from './context/QuotaContext';
import { VideoProjectProvider, useVideoProjects } from './context/VideoProjectContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar, ActiveTab } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ViralClipsView } from './components/results/ViralClipsView';
import { QuotaAnalyticsPage } from './components/analytics/QuotaAnalyticsPage';
import { UploadModal } from './components/dashboard/UploadModal';
import { StudioEditorModal } from './components/editor/StudioEditorModal';
import { AuthModal } from './components/auth/AuthModal';
import { SeatLimitModal } from './components/auth/SeatLimitModal';
import { SecurityToast } from './components/auth/SecurityToast';
import { SecurityInboxModal } from './components/auth/SecurityInboxModal';
import { ViralClip } from './types';
import { Sparkles, LayoutDashboard, Film, BarChart3, Plus } from 'lucide-react';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    try {
      const saved = localStorage.getItem('clipfusion_active_tab');
      if (saved && ['landing', 'dashboard', 'clips', 'analytics'].includes(saved)) {
        return saved as ActiveTab;
      }
    } catch (e) {}
    return 'landing';
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('clipfusion_active_tab', activeTab);
    } catch (e) {}
  }, [activeTab]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [initialUrlForModal, setInitialUrlForModal] = useState<string>('');

  const {
    activeProject,
    selectedClip,
    isEditorOpen,
    openEditorForClip,
    closeEditor,
    createNewProjectFromInput
  } = useVideoProjects();

  const handleOpenStudio = (clip?: ViralClip) => {
    if (clip) {
      openEditorForClip(clip);
    } else if (activeProject && activeProject.clips.length > 0) {
      openEditorForClip(activeProject.clips[0]);
    }
  };

  const handleStartProcessingFromModal = (
    title: string,
    durationMinutes: number,
    sourceType: 'local' | 'url',
    sourceUrl?: string,
    config?: any,
    thumbnailUrl?: string
  ) => {
    // Navigate to Creator Studio (dashboard) so the user sees real-time AI progress
    setActiveTab('dashboard');
    // Await processing completion, then auto-navigate to Viral Clips tab
    createNewProjectFromInput(title, durationMinutes, sourceType, sourceUrl, config, thumbnailUrl).then(() => {
      // Small delay so the user sees "Processing Complete" banner briefly before navigating
      setTimeout(() => setActiveTab('clips'), 1200);
    });
  };

  const handleHeroUrlSubmit = (url: string) => {
    setInitialUrlForModal(url);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-studio-950 text-slate-100 selection:bg-brand-purple/30 selection:text-purple-200">
      {/* Top Navigation Bar with Mobile Drawer, User Profile / Sign In & Quota Gauge */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUploadModal={() => {
          setInitialUrlForModal('');
          setIsUploadModalOpen(true);
        }}
        clipsCount={activeProject?.clipsCount ?? 8}
      />

      {/* 3. Main Body Content Based on Active Tab */}
      <main className="flex-1 pb-16 md:pb-0">
        {activeTab === 'landing' && (
          <LandingPage
            onStartRepurposing={() => {
              setInitialUrlForModal('');
              setIsUploadModalOpen(true);
            }}
            onPasteUrl={handleHeroUrlSubmit}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            onViewClips={() => setActiveTab('clips')}
            onOpenStudio={() => handleOpenStudio()}
          />
        )}

        {activeTab === 'clips' && (
          <ViralClipsView
            onOpenStudio={handleOpenStudio}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'analytics' && <QuotaAnalyticsPage />}
      </main>

      {/* Native App-Style Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-studio-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('landing')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'landing' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'dashboard' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Studio</span>
        </button>

        {/* Floating Quick Ingest Button */}
        <button
          onClick={() => {
            setInitialUrlForModal('');
            setIsUploadModalOpen(true);
          }}
          title="Ingest Video"
          className="relative -top-3 w-11 h-11 rounded-full bg-gradient-to-tr from-brand-purple to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/40 border-2 border-studio-950 active:scale-95 transition"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab('clips')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'clips' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-4 h-4" />
          <span className="text-[10px]">Clips</span>
          {(activeProject?.clipsCount ?? 0) > 0 && (
            <span className="absolute top-0 right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-brand-emerald text-black text-[9px] font-black flex items-center justify-center">
              {activeProject?.clipsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'analytics' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px]">Quota</span>
        </button>
      </nav>

      {/* 4. Global Ingestion & Quota Validation Modal */}
      {isUploadModalOpen && (
        <UploadModal
          key={initialUrlForModal || 'empty'}
          isOpen={isUploadModalOpen}
          initialUrl={initialUrlForModal}
          onClose={() => setIsUploadModalOpen(false)}
          onStartProcessing={handleStartProcessingFromModal}
        />
      )}

      {/* 5. Fullscreen Vizard Studio Modal (Multi-Track, 35 Styles, Auto-Zoom, AI Emojis & Auto B-Roll) */}
      {isEditorOpen && selectedClip && (
        <StudioEditorModal
          key={selectedClip.id}
          clip={selectedClip}
          onClose={closeEditor}
        />
      )}

      {/* 6. Sign In / Sign Up Modal */}
      <AuthModal />

      {/* 7. 3-Device Workspace Seat Limiter Modal */}
      <SeatLimitModal />

      {/* 8. Transactional Security Email Notification Drawer & Inbox */}
      <SecurityToast />
      <SecurityInboxModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <QuotaProvider>
        <VideoProjectProvider>
          <MainApp />
        </VideoProjectProvider>
      </QuotaProvider>
    </AuthProvider>
  );
};

export default App;
