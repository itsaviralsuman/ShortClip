import React, { useState } from 'react';
import { QuotaProvider } from './context/QuotaContext';
import { VideoProjectProvider, useVideoProjects } from './context/VideoProjectContext';
import { Navbar, ActiveTab } from './components/common/Navbar';
import { DevToolbar } from './components/common/DevToolbar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ViralClipsView } from './components/results/ViralClipsView';
import { QuotaAnalyticsPage } from './components/analytics/QuotaAnalyticsPage';
import { UploadModal } from './components/dashboard/UploadModal';
import { StudioEditorModal } from './components/editor/StudioEditorModal';
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
    config?: any
  ) => {
    createNewProjectFromInput(title, durationMinutes, sourceType, sourceUrl, config).then(() => {
      setActiveTab('clips');
    });
  };

  const handleHeroUrlSubmit = (url: string) => {
    setInitialUrlForModal(url);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-studio-950 text-slate-100">
      {/* 1. Sticky Developer Quota Testing Bar */}
      <DevToolbar />

      {/* 2. Top Navigation Bar with Live Quota Mini-Gauge */}
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
      <main className="flex-1">
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

      {/* 5. Fullscreen Vizard Studio Modal (Multi-Track & Transcript Editor) */}
      {isEditorOpen && selectedClip && (
        <StudioEditorModal
          clip={selectedClip}
          onClose={closeEditor}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QuotaProvider>
      <VideoProjectProvider>
        <MainApp />
      </VideoProjectProvider>
    </QuotaProvider>
  );
};

export default App;
