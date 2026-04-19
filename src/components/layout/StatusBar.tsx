import React from 'react';
import { useStore } from '../../store';
import { 
  GitBranch, 
  Wifi, 
  WifiOff, 
  Bell, 
  Check, 
  RefreshCw,
  Info
} from 'lucide-react';

const StatusBar = () => {
  const { aiProviders, activeAIProviderId, settings, setActiveSidebar, setSidebarOpen, gitState } = useStore();
  const activeProvider = aiProviders.find(p => p.id === activeAIProviderId);
  const isOnline = navigator.onLine;

  const navigateTo = (sidebar: any) => {
    setActiveSidebar(sidebar);
    setSidebarOpen(true);
  };

  const hasChanges = gitState.changes.length > 0;

  return (
    <div className={`h-6 flex items-center justify-between px-3 text-[11px] select-none transition-colors ${activeProvider?.status === 'Active' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-dark)] text-[var(--text-muted)]'} border-t border-[var(--border-color)]`}>
      <div className="flex items-center h-full">
        <button 
          onClick={() => navigateTo('git')}
          className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full transition-colors border-r border-white/5"
        >
          <GitBranch size={12} />
          <span className="font-bold text-[10px] tracking-widest uppercase">{gitState.activeBranch}{hasChanges ? '*' : ''}</span>
          {hasChanges && <span className="opacity-70 text-[9px] ml-0.5">{gitState.changes.length}</span>}
        </button>
        
        <button 
          onClick={() => navigateTo('ai')}
          className={`flex items-center gap-1.5 hover:bg-white/10 px-2 h-full transition-colors border-r border-white/5 ${activeProvider?.status === 'Active' ? 'bg-white/10' : ''}`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${activeProvider?.status === 'Active' ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
          <span className="font-bold tracking-widest uppercase text-[10px]">{activeProvider?.name?.split(' ')[1] || activeProvider?.name} AI</span>
        </button>
      </div>

      <div className="flex items-center h-full">
        <div className="flex items-center gap-4 px-3 h-full opacity-80 text-[10px] font-medium tracking-tight">
          <span>Ln 1, Col 1</span>
          <span>Spaces: {settings.tabSize}</span>
          <span>UTF-8</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer">TypeScript JSX</span>
        </div>
        
        <div className="flex items-center h-full border-l border-white/5">
            <button className="px-2 hover:bg-white/10 h-full transition-colors">
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} className="text-red-400" />}
            </button>
            <button className="px-2 hover:bg-white/10 h-full transition-colors">
              <Check size={12} />
            </button>
            <button className="px-2 hover:bg-white/10 h-full transition-colors">
              <Bell size={12} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
