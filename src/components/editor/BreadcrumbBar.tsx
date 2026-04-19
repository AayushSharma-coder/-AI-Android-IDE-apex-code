import React from 'react';
import { ChevronRight, FileCode, Folder } from 'lucide-react';

interface BreadcrumbBarProps {
  path: string;
}

const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ path }) => {
  const parts = path.split('/').filter(Boolean);

  return (
    <div className="h-6 flex items-center px-4 bg-[#1e1e1e] text-[11px] text-[#858585] select-none border-b border-[#2b2b2b]">
      <div className="flex items-center gap-1.5 hover:text-[#cccccc] cursor-pointer transition-colors">
        <Folder size={12} />
        <span>src</span>
      </div>
      
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={10} className="mx-0.5 text-[#555]" />
          <div className="flex items-center gap-1.5 hover:text-[#cccccc] cursor-pointer transition-colors">
            {index === parts.length - 1 ? <FileCode size={12} className="text-[#519aba]" /> : <Folder size={12} />}
            <span>{part}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadcrumbBar;
