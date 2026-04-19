import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { aiService } from '../../services/aiService';
import { Sparkles, X, ChevronRight, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SmartEditWidgetProps {
  editor: any;
  panelId: string;
}

const SmartEditWidget: React.FC<SmartEditWidgetProps> = ({ editor, panelId }) => {
  const { smartEdit, closeSmartEdit, updateSmartEdit, files, activePanelId, updateTabContent, tabs } = useStore();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  if (!smartEdit.isOpen || activePanelId !== panelId) return null;

  useEffect(() => {
    if (smartEdit.isOpen) {
      inputRef.current?.focus();
    }
  }, [smartEdit.isOpen]);

  const handleGenerate = async () => {
    if (!input.trim() || smartEdit.isGenerating) return;

    updateSmartEdit({ isGenerating: true });
    
    // Get current panel and active tab
    const state = useStore.getState();
    const panel = state.panels.find(p => p.id === panelId);
    if (!panel) return;

    const currentTab = state.tabs.find(t => t.id === panel.activeTabId);
    const currentFile = state.files.find(f => f.id === currentTab?.fileId);

    if (!currentFile) {
        updateSmartEdit({ isGenerating: false });
        return;
    }

    try {
      const selection = editor.getSelection();
      const selectedContent = editor.getModel().getValueInRange(selection);
      const fullContent = editor.getValue();

      const result = await aiService.smartEdit(input, fullContent, selectedContent);
      
      // Basic extraction of code from markdown
      const codeMatch = result.match(/```(?:\w+)?\n([\s\S]*?)```/) || [null, result];
      const code = codeMatch[1].trim();

      if (selectedContent) {
        // Replace selection
        editor.executeEdits('ai-edit', [{
          range: selection,
          text: code,
          forceMoveMarkers: true
        }]);
      } else {
        // Insert at cursor
        const position = editor.getPosition();
        editor.executeEdits('ai-edit', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: code,
          forceMoveMarkers: true
        }]);
      }

      // Sync back to store
      updateTabContent(currentTab!.id, editor.getValue());
      closeSmartEdit();
    } catch (err) {
      console.error('Smart Edit Error:', err);
    } finally {
      updateSmartEdit({ isGenerating: false });
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute top-12 left-1/2 -translate-x-1/2 z-[100] w-[400px] bg-[#252526] border border-[#007acc] rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] border-b border-[#2b2b2b]">
          <Sparkles size={14} className="text-[#007acc]" />
          <span className="text-[11px] font-bold text-[#cccccc] uppercase tracking-wider">Smart Edit</span>
          <button onClick={closeSmartEdit} className="ml-auto text-[#858585] hover:text-[#cccccc]">
            <X size={14} />
          </button>
        </div>
        
        <div className="p-3">
          <div className="flex items-center gap-2 bg-[#3c3c3c] rounded p-2 focus-within:ring-1 focus-within:ring-[#007acc]">
            <input 
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate();
                if (e.key === 'Escape') closeSmartEdit();
              }}
              placeholder="Ask AI to edit or generate code..."
              className="flex-1 bg-transparent text-[#cccccc] text-xs outline-none placeholder:text-[#858585]"
            />
            <button 
                onClick={handleGenerate}
                disabled={!input.trim() || smartEdit.isGenerating}
                className={`p-1 rounded transition-colors ${!input.trim() || smartEdit.isGenerating ? 'text-[#555555]' : 'text-white bg-[#007acc] hover:bg-[#0062a3]'}`}
            >
              {smartEdit.isGenerating ? <RotateCcw size={14} className="animate-spin" /> : <ChevronRight size={14} />}
            </button>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="text-[10px] text-[#858585]">
                {smartEdit.selection ? `Editing selection (lines ${smartEdit.selection.startLine}-${smartEdit.selection.endLine})` : 'Generating at cursor'}
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#555555]">ESC to close</span>
                <span className="text-[10px] text-[#555555]">ENTER to run</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartEditWidget;
