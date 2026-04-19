import React, { useState } from 'react';
import { useStore } from '../../store';
import { 
  Search, 
  Settings, 
  Download, 
  Star, 
  CheckCircle2, 
  MoreVertical,
  Terminal,
  Layout,
  Shield,
  BookOpen,
  GitBranch,
  Box,
  RotateCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const iconMap: Record<string, any> = {
  Terminal,
  Layout,
  Shield,
  BookOpen,
  GitBranch,
  Box
};

const ExtensionsPanel = () => {
  const { extensions, installExtension, uninstallExtension } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'installed'>('all');

  const filteredExtensions = extensions.market.filter(ext => 
    ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ext.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedExtensions = activeTab === 'all' 
    ? filteredExtensions 
    : filteredExtensions.filter(ext => extensions.installed.includes(ext.id));

  const ExtensionItem = ({ extension }: { extension: any }) => {
    const isInstalled = extensions.installed.includes(extension.id);
    const isInstalling = extensions.installing.includes(extension.id);
    const Icon = iconMap[extension.icon] || Box;

    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex gap-3 p-3 hover:bg-[#2a2d2e] cursor-pointer border-b border-[#2b2b2b]/50"
      >
        <div className="w-10 h-10 bg-[#3c3c3c] rounded-md flex items-center justify-center shrink-0">
          <Icon size={20} className="text-[#858585] group-hover:text-[#cccccc] transition-colors" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[13px] font-semibold text-[#cccccc] truncate">{extension.name}</h3>
            {isInstalled && <CheckCircle2 size={12} className="text-[#4caf50] shrink-0" />}
          </div>
          
          <p className="text-[11px] text-[#858585] line-clamp-2 mt-0.5 leading-relaxed">
            {extension.description}
          </p>
          
          <div className="flex items-center gap-3 mt-2 text-[10px] text-[#555555]">
            <span className="flex items-center gap-1 font-medium">
              <Star size={10} className="text-[#e2c08d]" />
              {extension.rating}
            </span>
            <span className="flex items-center gap-1">
              <Download size={10} />
              {extension.downloads}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {isInstalled ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  uninstallExtension(extension.id);
                }}
                className="bg-[#3c3c3c] hover:bg-[#4a4a4a] text-[#cccccc] px-3 py-1 rounded text-[11px] transition-colors"
              >
                Uninstall
              </button>
            ) : (
              <button 
                disabled={isInstalling}
                onClick={(e) => {
                  e.stopPropagation();
                  installExtension(extension.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] transition-colors ${
                  isInstalling 
                    ? 'bg-[#3c3c3c] text-[#858585]' 
                    : 'bg-[#007acc] hover:bg-[#1177bb] text-white'
                }`}
              >
                {isInstalling ? (
                  <>
                    <RotateCw size={10} className="animate-spin" />
                    Installing...
                  </>
                ) : 'Install'}
              </button>
            )}
            <button className="bg-[#3c3c3c] hover:bg-[#4a4a4a] text-[#cccccc] p-1 rounded transition-colors">
              <Settings size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] select-none text-[13px]">
      <div className="p-3 border-b border-[#2b2b2b]">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858585]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Extensions in Marketplace"
            className="w-full bg-[#3c3c3c] text-[#cccccc] text-xs pl-8 pr-3 py-1.5 rounded border border-transparent focus:border-[#007acc] outline-none transition-all placeholder:text-[#555555]"
          />
        </div>

        <div className="flex items-center gap-4 mt-3 px-1 text-[11px] font-bold uppercase tracking-wider text-[#858585]">
            <button 
                onClick={() => setActiveTab('all')}
                className={`pb-1 border-b-2 transition-all ${activeTab === 'all' ? 'border-[#007acc] text-[#cccccc]' : 'border-transparent hover:text-[#cccccc]'}`}
            >
                Marketplace
            </button>
            <button 
                onClick={() => setActiveTab('installed')}
                className={`pb-1 border-b-2 transition-all ${activeTab === 'installed' ? 'border-[#007acc] text-[#cccccc]' : 'border-transparent hover:text-[#cccccc]'}`}
            >
                Installed ({extensions.installed.length})
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {displayedExtensions.map(ext => (
            <ExtensionItem key={ext.id} extension={ext} />
          ))}
        </AnimatePresence>
        
        {displayedExtensions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center text-[#858585]">
            <Box size={32} className="mb-2 opacity-20" />
            <p className="text-xs">No extensions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtensionsPanel;
