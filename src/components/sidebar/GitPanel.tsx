import React, { useState } from 'react';
import { useStore } from '../../store';
import { 
  GitBranch, 
  GitCommit, 
  Plus, 
  Minus, 
  RotateCcw, 
  Check, 
  MoreHorizontal,
  FileCode,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GitPanel = () => {
  const { gitState, stageChange, unstageChange, stageAll, unstageAll, commitChanges, discardChange, extensions } = useStore();
  const [commitMessage, setCommitMessage] = useState('');

  const stagedChanges = gitState.changes.filter(c => c.staged);
  const unstagedChanges = gitState.changes.filter(c => !c.staged);

  // Dynamic extension views
  const extensionViews = extensions.market
    .filter(ext => extensions.installed.includes(ext.id))
    .flatMap(ext => ext.contributions?.views || []);

  const handleCommit = () => {
    if (!commitMessage.trim() || stagedChanges.length === 0) return;
    commitChanges(commitMessage);
    setCommitMessage('');
  };

  const ChangeItem = ({ change, isStaged }: { change: any, isStaged: boolean }) => (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="group flex items-center gap-2 px-3 py-1 hover:bg-[#2a2d2e] cursor-pointer text-[13px]"
    >
      <FileCode size={14} className="text-[#858585] shrink-0" />
      <div className="flex-1 flex flex-col min-w-0">
        <span className="truncate text-[#cccccc]">{change.path.split('/').pop()}</span>
        <span className="truncate text-[10px] text-[#555555]">{change.path}</span>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            isStaged ? unstageChange(change.fileId) : stageChange(change.fileId);
          }}
          className="p-1 hover:bg-[#3c3c3c] rounded text-[#858585] hover:text-[#cccccc]"
          title={isStaged ? "Unstage Changes" : "Stage Changes"}
        >
          {isStaged ? <Minus size={14} /> : <Plus size={14} />}
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            discardChange(change.fileId);
          }}
          className="p-1 hover:bg-[#3c3c3c] rounded text-[#858585] hover:text-[#f44336]"
          title="Discard Changes"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <span className={`text-[10px] font-bold shrink-0 w-4 text-center ${
        change.status === 'modified' ? 'text-yellow-500' : 
        change.status === 'added' ? 'text-green-500' : 'text-red-500'
      }`}>
        {change.status === 'modified' ? 'M' : change.status === 'added' ? 'A' : 'D'}
      </span>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full bg-[#252526] select-none text-[13px]">
      <div className="p-3 text-[11px] uppercase tracking-wider text-[#858585] font-bold border-b border-[#2b2b2b] flex items-center justify-between">
        <div className="flex items-center gap-2">
            <GitBranch size={14} />
            Source Control: {gitState.activeBranch}
        </div>
        <MoreHorizontal size={14} className="cursor-pointer hover:text-[#cccccc]" />
      </div>

      <div className="p-3 space-y-3 border-b border-[#2b2b2b]">
        <div className="relative">
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Commit message (Ctrl+Enter to commit)"
            className="w-full bg-[#3c3c3c] text-[#cccccc] text-xs p-2 rounded border border-transparent focus:border-[#007acc] outline-none resize-none min-h-[60px]"
            onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleCommit();
            }}
          />
        </div>
        <button 
          onClick={handleCommit}
          disabled={!commitMessage.trim() || stagedChanges.length === 0}
          className="w-full bg-[#007acc] hover:bg-[#1177bb] disabled:bg-[#3c3c3c] disabled:text-[#858585] text-white py-1.5 rounded flex items-center justify-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Check size={16} />
          Commit
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2">
        {/* Staged Changes */}
        {stagedChanges.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between px-3 py-1 group cursor-pointer">
              <span className="text-[11px] font-bold text-[#858585] uppercase tracking-wider">Staged Changes</span>
              <div className="flex items-center gap-2">
                <span className="bg-[#333333] text-[#cccccc] text-[10px] px-1.5 py-0.5 rounded-full">{stagedChanges.length}</span>
                <button onClick={unstageAll} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#3c3c3c] rounded text-[#858585]">
                  <Minus size={14} />
                </button>
              </div>
            </div>
            <div className="mt-1">
              <AnimatePresence mode="popLayout">
                {stagedChanges.map(c => <ChangeItem key={c.fileId} change={c} isStaged={true} />)}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Changes */}
        <div>
          <div className="flex items-center justify-between px-3 py-1 group cursor-pointer">
            <span className="text-[11px] font-bold text-[#858585] uppercase tracking-wider">Changes</span>
            <div className="flex items-center gap-2">
              <span className="bg-[#333333] text-[#cccccc] text-[10px] px-1.5 py-0.5 rounded-full">{unstagedChanges.length}</span>
              <button onClick={stageAll} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#3c3c3c] rounded text-[#858585]">
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="mt-1">
            <AnimatePresence mode="popLayout">
              {unstagedChanges.map(c => <ChangeItem key={c.fileId} change={c} isStaged={false} />)}
            </AnimatePresence>
            {unstagedChanges.length === 0 && stagedChanges.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center text-[#858585]">
                <AlertCircle size={32} className="mb-2 opacity-20" />
                <p className="text-xs">No changes detected in the workspace.</p>
                <p className="text-[10px] mt-2 leading-relaxed">Start editing files to see them tracked in source control.</p>
              </div>
            )}
          </div>
        </div>

        {/* Extension Contributed Views */}
        {extensionViews.map(view => (
          <div key={view.id} className="mt-2 border-t border-[#2b2b2b]">
            <div className="flex items-center justify-between px-3 py-1.5 group cursor-pointer bg-[#2d2d2d]/30">
              <span className="text-[11px] font-bold text-[#858585] uppercase tracking-wider">{view.title}</span>
              <div className="flex items-center gap-2">
                <ChevronRight size={14} className="text-[#858585]" />
              </div>
            </div>
            <div className="px-5 py-3 text-[11px] text-[#555555] italic">
                {view.title} view content provided by extension.
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-[#2b2b2b] bg-[#1e1e1e]">
        <div className="flex items-center justify-between text-[11px] text-[#858585]">
            <span>STASH: 0</span>
            <span>TAGS: 0</span>
        </div>
      </div>
    </div>
  );
};

export default GitPanel;
