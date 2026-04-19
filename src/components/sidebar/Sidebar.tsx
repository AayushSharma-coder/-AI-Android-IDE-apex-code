import React from 'react';
import { useStore } from '../../store';
import { X, MoreHorizontal } from 'lucide-react';
import AIKeyManager from './AIKeyManager';
import ProjectExplorer from './ProjectExplorer';
import SearchPanel from './SearchPanel';
import AIAssistant from './AIAssistant';
import SettingsPanel from './SettingsPanel';
import GitPanel from './GitPanel';
import ExtensionsPanel from './ExtensionsPanel';

const Sidebar = () => {
  const { activeSidebar, isSidebarOpen, setSidebarOpen } = useStore();

  if (!isSidebarOpen) return null;

  const renderContent = () => {
    switch (activeSidebar) {
      case 'explorer':
        return <ProjectExplorer />;
      case 'git':
        return <GitPanel />;
      case 'extensions':
        return <ExtensionsPanel />;
      case 'search':
        return <SearchPanel />;
      case 'ai':
        return <AIAssistant />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <div className="p-4 text-[#858585]">Coming Soon</div>;
    }
  };

  const getTitle = () => {
    switch (activeSidebar) {
      case 'explorer': return 'EXPLORER';
      case 'search': return 'SEARCH';
      case 'git': return 'SOURCE CONTROL';
      case 'extensions': return 'EXTENSIONS';
      case 'ai': return 'AI ASSISTANT';
      case 'settings': return 'SETTINGS';
      default: return '';
    }
  };

  return (
    <div className="w-64 h-screen bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex flex-col select-none overflow-hidden shrink-0">
      <div className="flex items-center justify-between px-4 py-3 text-[10px] text-[var(--text-muted)] font-bold tracking-widest uppercase border-b border-[var(--border-color)]">
        <span>{getTitle()}</span>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="p-1 hover:bg-white/5 rounded transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default Sidebar;
