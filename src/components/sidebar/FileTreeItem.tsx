import React, { useState } from 'react';
import { useStore } from '../../store';
import { FileNode } from '../../types';
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Folder, 
  MoreVertical, 
  Trash2, 
  Edit3,
  FilePlus,
  FolderPlus,
  Terminal, // Python
  Box // Generic
} from 'lucide-react';

const iconMap: Record<string, any> = {
    Terminal,
    Box
};

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { files, openTab, deleteFile, createFile, createFolder, gitState, extensions } = useStore();

  const children = files.filter(f => f.parentId === node.id);
  const isDirectory = node.type === 'directory';

  const gitChange = gitState.changes.find(c => c.fileId === node.id);

  // Determine file icon from extensions
  const getFileIcon = () => {
    if (isDirectory) {
      return <Folder size={14} className={isOpen ? 'text-[#cccccc]' : 'text-[#858585]'} />;
    }

    const extension = node.name.split('.').pop();
    const installedExtensions = extensions.market.filter(ext => extensions.installed.includes(ext.id));
    
    for (const ext of installedExtensions) {
        const langContrib = ext.contributions?.languages?.find(lang => lang.extensions.includes(`.${extension}`));
        if (langContrib?.icon) {
            const IconComponent = iconMap[langContrib.icon] || FileText;
            return <IconComponent size={14} className="text-[#e2c08d]" />; // Use a distinctive color for extension icons
        }
    }

    return <FileText size={14} className="text-[#519aba]" />;
  };

  const handleClick = () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      openTab(node);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${node.name}?`)) {
      deleteFile(node.id);
    }
  };

  const handleCreateFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    const name = window.prompt('Enter file name (e.g. index.ts):');
    if (name) createFile(name, node.id);
    setIsOpen(true);
  };

  const handleCreateFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const name = window.prompt('Enter folder name:');
    if (name) createFolder(name, node.id);
    setIsOpen(true);
  };

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-1.5 px-1 cursor-pointer transition-colors group ${
          isHovered ? 'bg-white/5' : ''
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="w-4 h-4 flex items-center justify-center mr-1 text-[var(--text-muted)]">
          {isDirectory ? (
            isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : null}
        </div>
        
        <div className="w-4 h-4 flex items-center justify-center mr-1.5">
          {getFileIcon()}
        </div>
        
        <span className={`text-[12px] flex-1 truncate ${
            gitChange ? (gitChange.status === 'modified' ? 'text-yellow-500' : 'text-green-500') : 
            (isHovered ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]')
        }`}>
          {node.name}
        </span>

        {gitChange && !isHovered && (
             <span className={`text-[9px] font-bold px-2 ${
                gitChange.status === 'modified' ? 'text-yellow-500' : 'text-green-500'
             }`}>
                {gitChange.status === 'modified' ? 'M' : 'A'}
             </span>
        )}

        {isHovered && (
          <div className="flex items-center gap-0.5 pr-1">
            {isDirectory && (
              <>
                <button 
                  onClick={handleCreateFile}
                  className="p-0.5 hover:bg-white/10 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  title="New File"
                >
                  <FilePlus size={12} />
                </button>
                <button 
                  onClick={handleCreateFolder}
                  className="p-0.5 hover:bg-white/10 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  title="New Folder"
                >
                  <FolderPlus size={12} />
                </button>
              </>
            )}
            <button 
              onClick={handleDelete}
              className="p-0.5 hover:bg-white/10 rounded text-[var(--text-muted)] hover:text-red-400"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {isDirectory && isOpen && (
        <div>
          {children.length > 0 ? (
            children.map(child => (
              <FileTreeItem key={child.id} node={child} depth={depth + 1} />
            ))
          ) : (
            <div 
                className="py-1 italic text-[#555555] text-[11px]"
                style={{ paddingLeft: `${(depth + 1) * 12 + 28}px` }}
            >
                No items
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileTreeItem;
