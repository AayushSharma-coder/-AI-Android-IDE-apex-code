import React from 'react';
import { 
  Files, 
  Search, 
  GitBranch, 
  Blocks, 
  Sparkles, 
  Settings, 
  Terminal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../store';
import { motion } from 'motion/react';

const ActivityBar = () => {
  const { 
    activeSidebar, 
    setActiveSidebar, 
    isSidebarOpen, 
    setSidebarOpen,
    isBottomPanelOpen,
    setBottomPanelOpen 
  } = useStore();

  const items = [
    { id: 'explorer', icon: Files, label: 'Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'git', icon: GitBranch, label: 'Source Control' },
    { id: 'extensions', icon: Blocks, label: 'Extensions' },
    { id: 'ai', icon: Sparkles, label: 'AI Assistant' },
  ];

  const bottomItems = [
    { id: 'terminal', icon: Terminal, label: 'Terminal', action: () => setBottomPanelOpen(!isBottomPanelOpen) },
    { id: 'settings', icon: Settings, label: 'Settings', action: () => setActiveSidebar('settings') },
  ];

  return (
    <div className="w-12 h-screen bg-[var(--bg-dark)] flex flex-col items-center py-4 border-r border-[var(--border-color)] select-none">
      <div className="flex-1 flex flex-col items-center gap-2 w-full">
        {items.map((item) => {
          const isActive = activeSidebar === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (isActive && isSidebarOpen) {
                  setSidebarOpen(false);
                } else {
                  setActiveSidebar(item.id as any);
                }
              }}
              className={`p-2.5 w-full flex justify-center transition-all relative group cursor-pointer`}
              title={item.label}
            >
              <div className={`absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[var(--accent)] transition-all ${isActive && isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
              <item.icon 
                size={22} 
                className={`${isActive && isSidebarOpen ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'} transition-colors`}
              />
            </button>
          );
        })}
      </div>
      
      <div className="flex flex-col items-center gap-2 w-full">
        {bottomItems.map((item) => {
          const isActive = (activeSidebar as string) === item.id;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="p-2.5 w-full flex justify-center group relative cursor-pointer"
              title={item.label}
            >
              <div className={`absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[var(--accent)] transition-all ${isActive ? 'opacity-100' : 'opacity-0'}`} />
              <item.icon 
                size={22} 
                className={`${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'} transition-colors`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityBar;
