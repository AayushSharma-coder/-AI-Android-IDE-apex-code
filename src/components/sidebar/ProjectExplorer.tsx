import React from 'react';
import { useStore } from '../../store';
import FileTreeItem from './FileTreeItem';
import { FilePlus, FolderPlus, RotateCcw, MoreHorizontal } from 'lucide-react';

const ProjectExplorer = () => {
  const { files, currentProject, createFile, createFolder } = useStore();

  const rootFiles = files.filter(f => !f.parentId);

  const handleCreateRootFile = () => {
    const name = window.prompt('Enter file name at root:');
    if (name) createFile(name);
  };

  const handleCreateRootFolder = () => {
    const name = window.prompt('Enter folder name at root:');
    if (name) createFolder(name);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-color)] group hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-[10px] font-bold text-[var(--text-primary)] truncate uppercase tracking-widest">
            {currentProject?.name || 'NO PROJECT OPEN'}
          </span>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleCreateRootFile}
            className="p-1 hover:bg-white/10 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]" 
            title="New File..."
          >
            <FilePlus size={14} />
          </button>
          <button 
            onClick={handleCreateRootFolder}
            className="p-1 hover:bg-white/10 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]" 
            title="New Folder..."
          >
            <FolderPlus size={14} />
          </button>
          <button className="p-1 hover:bg-[#3c3c3c] rounded text-[#858585] hover:text-[#cccccc]" title="Refresh">
            <RotateCcw size={14} />
          </button>
          <button className="p-1 hover:bg-[#3c3c3c] rounded text-[#858585] hover:text-[#cccccc]" title="More Actions...">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-1 scrollbar-hide">
        {rootFiles.length > 0 ? (
          rootFiles.map(node => (
            <FileTreeItem key={node.id} node={node} depth={0} />
          ))
        ) : (
          <div className="px-6 py-4 text-xs text-[#858585] italic">
            Your workspace is empty. Create a file to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectExplorer;
