import React from 'react';
import { useStore } from '../../store';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import EditorPanel from './EditorPanel';

const MainEditor = () => {
  const { panels, tabs } = useStore();

  if (tabs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-editor)] text-[var(--text-muted)] select-none p-8 text-center">
        <div className="w-24 h-24 mb-8 text-[var(--accent)] opacity-40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
        </div>
        <h1 className="text-3xl font-light mb-2 text-[var(--text-primary)] tracking-tight">ApexCode <span className="text-[10px] bg-[var(--accent)] text-white px-1.5 py-0.5 rounded-full font-bold align-top ml-1">PRO</span></h1>
        <p className="text-sm italic opacity-50 mb-12">The last code editor you will ever need.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 w-full max-w-lg text-[13px]">
            <ShortcutRow label="Show All Commands" keys={['Ctrl', 'Shift', 'P']} />
            <ShortcutRow label="Go to File" keys={['Ctrl', 'P']} />
            <ShortcutRow label="Global Search" keys={['Ctrl', 'Shift', 'F']} />
            <ShortcutRow label="Toggle Sidebar" keys={['Ctrl', 'B']} />
            <ShortcutRow label="AI Assistant" keys={['Ctrl', 'Shift', 'A']} />
            <ShortcutRow label="Toggle Panel" keys={['Ctrl', 'J']} />
        </div>
        
        <div className="mt-16 text-[11px] text-[#444] font-medium border-t border-[var(--border-color)] pt-6 w-full max-w-md">
            Built with Passion for Cloud Native Development
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
      <PanelGroup direction="horizontal">
        {panels.map((panel, index) => (
          <React.Fragment key={panel.id}>
            {index > 0 && (
              <PanelResizeHandle className="w-0.5 bg-black hover:bg-[#007acc] transition-colors" />
            )}
            <Panel minSize={20}>
              <EditorPanel panelId={panel.id} />
            </Panel>
          </React.Fragment>
        ))}
      </PanelGroup>
    </div>
  );
};

const ShortcutRow = ({ label, keys }: { label: string; keys: string[] }) => (
    <div className="flex justify-between items-center group cursor-default">
        <span className="text-[#888] group-hover:text-[#aaa] transition-colors">{label}</span>
        <div className="flex gap-1">
            {keys.map((key, i) => (
                <kbd key={i} className="bg-[#333] px-1.5 py-0.5 rounded border border-[#444] text-[#aaa] font-mono text-[11px] shadow-sm">
                    {key}
                </kbd>
            ))}
        </div>
    </div>
);

export default MainEditor;
