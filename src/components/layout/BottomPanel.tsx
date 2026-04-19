import React from 'react';
import { useStore } from '../../store';
import { X, Terminal as TerminalIcon, AlertCircle, List, Bug } from 'lucide-react';

const BottomPanel = () => {
  const { isBottomPanelOpen, setBottomPanelOpen, bottomPanelTab, setBottomPanelTab } = useStore();

  if (!isBottomPanelOpen) return null;

  const tabs = [
    { id: 'problems', label: 'Problems', icon: AlertCircle },
    { id: 'output', label: 'Output', icon: List },
    { id: 'debug', label: 'Debug Console', icon: Bug },
    { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
  ] as const;

  return (
    <div className="h-64 bg-[#1e1e1e] border-t border-[#2b2b2b] flex flex-col select-none">
      <div className="flex items-center justify-between px-4 bg-[#252526] h-9 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-4 h-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setBottomPanelTab(tab.id)}
              className={`flex items-center gap-2 h-full px-2 text-[11px] uppercase tracking-wider transition-colors border-b-2
                ${bottomPanelTab === tab.id ? 'border-[#007acc] text-white' : 'border-transparent text-[#858585] hover:text-[#cccccc]'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setBottomPanelOpen(false)}
          className="text-[#858585] hover:text-white p-1 hover:bg-[#333333] rounded"
        >
          <X size={14} />
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden p-2 font-mono text-xs text-[#cccccc]">
        {bottomPanelTab === 'terminal' && (
          <div className="flex flex-col gap-1">
            <div className="text-[#00ff00]">apex@mobile:~/project$ <span className="text-white animate-pulse">_</span></div>
            <div className="text-[#858585]"># Type 'help' for available commands</div>
          </div>
        )}
        {bottomPanelTab === 'problems' && (
          <div className="flex items-center gap-2 text-[#858585]">
             <Check size={14} className="text-green-500" /> No problems have been detected in the workspace so far.
          </div>
        )}
        {bottomPanelTab === 'output' && (
          <div className="text-[#858585] italic">Select an output source to view logs.</div>
        )}
        {bottomPanelTab === 'debug' && (
          <div className="text-[#858585] italic">Debug console is empty.</div>
        )}
      </div>
    </div>
  );
};

const Check = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default BottomPanel;
