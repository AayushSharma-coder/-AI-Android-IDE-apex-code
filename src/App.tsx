import React, { useEffect } from 'react';
import ActivityBar from './components/layout/ActivityBar';
import Sidebar from './components/sidebar/Sidebar';
import MainEditor from './components/editor/MainEditor';
import StatusBar from './components/layout/StatusBar';
import BottomPanel from './components/layout/BottomPanel';
import CommandPalette from './components/layout/CommandPalette';
import QuickOpen from './components/layout/QuickOpen';
import { useStore } from './store';

/**
 * ApexCode - The Ultimate Mobile Code Editor
 * Part 4: IDE Shell, Navigation & Core UI
 */
export default function App() {
  const { 
    settings, 
    toggleCommandPalette, 
    toggleQuickOpen, 
    isBottomPanelOpen, 
    setBottomPanelOpen,
    isSidebarOpen,
    setSidebarOpen
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + P: Command Palette
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        toggleCommandPalette(true);
      }
      // Ctrl + P: Quick Open
      else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        toggleQuickOpen(true);
      }
      // Ctrl + J: Toggle Bottom Panel
      else if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        setBottomPanelOpen(!isBottomPanelOpen);
      }
      // Ctrl + B: Toggle Sidebar
      else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(!isSidebarOpen);
      }
      // Ctrl + Shift + F: Global Search
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        useStore.getState().setActiveSidebar('search');
        setSidebarOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette, toggleQuickOpen, isBottomPanelOpen, setBottomPanelOpen, isSidebarOpen, setSidebarOpen]);

  return (
    <div className={`h-screen flex flex-col overflow-hidden bg-[var(--workbench-bg)] ${settings.theme !== 'light' ? 'dark' : ''}`}>
      <div className="flex-1 flex overflow-hidden">
        <ActivityBar />
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <MainEditor />
            <BottomPanel />
        </div>
      </div>
      <StatusBar />
      
      {/* Overlays */}
      <CommandPalette />
      <QuickOpen />
    </div>
  );
}
