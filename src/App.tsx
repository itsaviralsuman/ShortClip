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

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
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
    // Navigate immediately to Creator Studio (dashboard) so the user sees real-time AI progress
    setActiveTab('dashboard');
    createNewProjectFromInput(title, durationMinutes, sourceType, sourceUrl, config, thumbnailUrl);
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
        clipsCount={activeProject?.clipsCount || 4}
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

      {/* 4. Global Ingestion & Quota Validation Modal */}
      {isUploadModalOpen && (
        <UploadModal
          isOpen={isUploadModalOpen}
          initialUrl={initialUrlForModal}
          onClose={() => setIsUploadModalOpen(false)}
          onStartProcessing={handleStartProcessingFromModal}
        />
      )}

      {/* 5. Fullscreen Vizard Studio Modal (Multi-Track, 35 Styles, Auto-Zoom, AI Emojis & Auto B-Roll) */}
      {isEditorOpen && selectedClip && (
        <StudioEditorModal
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
