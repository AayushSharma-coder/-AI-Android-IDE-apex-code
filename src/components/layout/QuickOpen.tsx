import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { FileCode, Search } from 'lucide-react';

const QuickOpen = () => {
  const { isQuickOpenOpen, toggleQuickOpen, files, openTab } = useStore();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredFiles = files.filter(f => 
    f.type === 'file' && f.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isQuickOpenOpen) {
      inputRef.current?.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isQuickOpenOpen]);

  // Scroll into view
  useEffect(() => {
    if (scrollRef.current) {
        const selectedElement = scrollRef.current.children[selectedIndex] as HTMLElement;
        if (selectedElement) {
            selectedElement.scrollIntoView({ block: 'nearest' });
        }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredFiles.length);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredFiles.length) % filteredFiles.length);
    } else if (e.key === 'Enter') {
        const file = filteredFiles[selectedIndex];
        if (file) {
            openTab(file);
            toggleQuickOpen(false);
        }
    } else if (e.key === 'Escape') {
        toggleQuickOpen(false);
    }
  };

  if (!isQuickOpenOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-2 px-4 pointer-events-none">
      <div 
        className="fixed inset-0 bg-black/50 pointer-events-auto" 
        onClick={() => toggleQuickOpen(false)} 
      />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="w-full max-w-xl bg-[#252526] rounded-md shadow-2xl border border-[#3c3c3c] overflow-hidden pointer-events-auto mt-12"
      >
        <div className="flex items-center gap-3 px-3 py-2 border-b border-[#3c3c3c]">
          <Search size={16} className="text-[#858585]" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search files by name..."
            className="flex-1 bg-transparent text-white text-sm outline-none"
          />
        </div>
        <div ref={scrollRef} className="max-h-[300px] overflow-y-auto py-1">
          {filteredFiles.map((file, index) => (
            <button
              key={file.id}
              onClick={() => {
                openTab(file);
                toggleQuickOpen(false);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex flex-col items-start px-4 py-2 group border-l-2 transition-colors ${
                selectedIndex === index ? 'bg-[#2a2d2e] border-[#007acc]' : 'border-transparent hover:bg-[#2a2d2e]'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-[#519aba]" />
                <span className={`text-sm font-medium transition-colors ${selectedIndex === index ? 'text-white' : 'text-[#cccccc] group-hover:text-white'}`}>{file.name}</span>
              </div>
              <span className="text-[10px] text-[#858585] ml-6">{file.path}</span>
            </button>
          ))}
          {filteredFiles.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[#858585]">
              No matching files found
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuickOpen;
