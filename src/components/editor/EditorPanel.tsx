import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useStore } from '../../store';
import { X, FileCode, Split, Layout, Sparkles } from 'lucide-react';
import BreadcrumbBar from './BreadcrumbBar';
import SmartEditWidget from './SmartEditWidget';
import { themeService } from '../../services/themeService';

interface EditorPanelProps {
  panelId: string;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ panelId }) => {
  const { 
    tabs, 
    panels, 
    activePanelId, 
    setActiveTabId, 
    closeTab, 
    updateTabContent, 
    settings,
    setActivePanelId,
    splitPanel,
    openSmartEdit,
    smartEdit,
    pendingNavigation,
    clearPendingNavigation
  } = useStore();

  const editorRef = React.useRef<any>(null);

  const panel = panels.find(p => p.id === panelId);
  const panelTabs = tabs.filter(t => panel?.tabIds.includes(t.id));
  const activeTab = tabs.find(t => t.id === panel?.activeTabId);
  const isActivePanel = activePanelId === panelId;

  // Handle pending navigation
  React.useEffect(() => {
    if (editorRef.current && pendingNavigation && activeTab && pendingNavigation.fileId === activeTab.fileId) {
      const editor = editorRef.current;
      const { line, column, length } = pendingNavigation.location;
      
      // Navigate and highlight
      editor.revealLineInCenterIfOutsideViewport(line);
      editor.setPosition({ lineNumber: line, column: column || 1 });
      
      if (length) {
        editor.setSelection({
            startLineNumber: line,
            startColumn: column || 1,
            endLineNumber: line,
            endColumn: (column || 1) + length
        });
      }

      editor.focus();
      clearPendingNavigation();
    }
  }, [pendingNavigation, activeTab, clearPendingNavigation]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Register custom themes
    themeService.registerThemes(monaco);

    // Add Ctrl+I keybinding for Smart Edit
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI, () => {
      const selection = editor.getSelection();
      const hasSelection = !selection.isEmpty();
      
      openSmartEdit(
        editor.getPosition().lineNumber,
        hasSelection ? { 
          startLine: selection.startLineNumber, 
          endLine: selection.endLineNumber 
        } : undefined
      );
    });

    // Add context menu action
    editor.addAction({
      id: 'apexcode-explain',
      label: 'AI: Explain Selection',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: (ed: any) => {
        const selection = ed.getSelection();
        const content = ed.getModel().getValueInRange(selection);
        if (content) {
            // This would interact with the Sidebar chat
            useStore.getState().setActiveSidebar('ai');
            useStore.getState().sendChatMessage(`Explain this code:\n\n\`\`\`\n${content}\n\`\`\``);
        }
      }
    });
  };

  if (!panel || panelTabs.length === 0) {
    return (
      <div 
        onClick={() => setActivePanelId(panelId)}
        className={`flex-1 flex flex-col items-center justify-center bg-[var(--workbench-bg)] text-[#555555] ${isActivePanel ? 'ring-1 ring-inset ring-[#007acc]' : ''}`}
      >
        <div className="w-16 h-16 mb-4 opacity-5">
            <Layout size={64} />
        </div>
        <p className="text-xs">No documents open in this panel.</p>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setActivePanelId(panelId)}
      className={`flex-1 flex flex-col bg-[var(--bg-editor)] overflow-hidden ${isActivePanel ? 'ring-[1px] ring-inset ring-[var(--accent)]/30' : ''}`}
    >
      {/* Tab Row */}
      <div className="flex bg-[var(--bg-surface)] h-9 overflow-x-auto scrollbar-hide border-b border-[var(--border-color)]">
        {panelTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id, panelId)}
            className={`flex items-center gap-2 px-4 min-w-[120px] max-w-[200px] h-full cursor-pointer border-r border-[var(--border-color)] transition-colors relative group
              ${panel.activeTabId === tab.id ? 'bg-[var(--bg-editor)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]'}
            `}
          >
            {panel.activeTabId === tab.id && <div className={`absolute top-0 left-0 right-0 h-[2px] ${isActivePanel ? 'bg-[var(--accent)]' : 'bg-[var(--text-muted)]/30'}`} />}
            <FileCode size={13} className="text-[var(--accent)] opacity-70 shrink-0" />
            <span className="text-[11px] truncate flex-1">{tab.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id, panelId);
              }}
              className={`p-0.5 rounded hover:bg-white/10 transition-colors ${panel.activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        
        <div className="flex-1 flex justify-end items-center px-2 pointer-events-none">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              splitPanel(panelId, 'vertical');
            }}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded pointer-events-auto"
            title="Split Editor"
          >
            <Split size={14} />
          </button>
        </div>
      </div>

      {activeTab && <BreadcrumbBar path={activeTab.title} />}

      {/* Editor Area */}
      <div className="flex-1 relative">
        <SmartEditWidget editor={editorRef.current} panelId={panelId} />
        {activeTab && (
          <Editor
            height="100%"
            theme={settings.theme}
            path={activeTab.title}
            defaultLanguage={activeTab.language}
            defaultValue={activeTab.content}
            onMount={handleEditorMount}
            onChange={(value) => updateTabContent(activeTab.id, value || '')}
            options={{
              fontSize: settings.fontSize,
              fontFamily: settings.fontFamily,
              tabSize: settings.tabSize,
              wordWrap: settings.wordWrap,
              minimap: { 
                enabled: settings.minimap,
                side: settings.minimapSide
              },
              lineNumbers: settings.lineNumbers,
              renderWhitespace: settings.renderWhitespace,
              cursorStyle: settings.cursorStyle,
              smoothScrolling: settings.smoothScrolling,
              bracketPairColorization: { enabled: settings.bracketPairColorization },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 10 },
              cursorBlinking: 'smooth',
              stickyScroll: { enabled: true },
              inlineSuggest: { enabled: true },
              multiCursorModifier: 'alt',
              multiCursorPaste: 'spread',
              multiCursorMergeOverlapping: true,
              formatOnPaste: true,
              formatOnType: true,
              scrollBeyondLastColumn: 5,
              wordBasedSuggestions: 'allDocuments',
              suggestSelection: 'recentlyUsed',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EditorPanel;
