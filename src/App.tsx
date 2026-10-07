import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ImageEditor from './components/ImageEditor';
import VideoEditor from './components/VideoEditor';
import PPTMaker from './components/PPTMaker';
import AIManager from './components/AIManager';

export type Page = 'dashboard' | 'image-editor' | 'video-editor' | 'ppt-maker' | 'ai-manager';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'image-editor':
        return <ImageEditor />;
      case 'video-editor':
        return <VideoEditor />;
      case 'ppt-maker':
        return <PPTMaker />;
      case 'ai-manager':
        return <AIManager />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f23]">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="p-6 fade-in">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
