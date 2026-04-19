import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command } from 'lucide-react';

const CommandPalette = () => {
  const { 
    isCommandPaletteOpen, 
    toggleCommandPalette, 
    setActiveSidebar, 
    toggleSidebar, 
    isBottomPanelOpen, 
    setBottomPanelOpen,
    panels,
    activePanelId,
    closeTab,
    extensions
  } = useStore();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activePanel = panels.find(p => p.id === activePanelId);
  const activeTabId = activePanel?.activeTabId;

  // Static IDE commands
  const baseCommands = [
    { id: 'view.explorer', label: 'View: Show Explorer', action: () => setActiveSidebar('explorer') },
    { id: 'view.search', label: 'View: Show Search', action: () => setActiveSidebar('search') },
    { id: 'view.git', label: 'View: Show Source Control', action: () => setActiveSidebar('git') },
    { id: 'view.ai', label: 'View: Show AI Assistant', action: () => setActiveSidebar('ai') },
    { id: 'view.settings', label: 'View: Show Settings', action: () => setActiveSidebar('settings') },
    { id: 'view.toggleSidebar', label: 'View: Toggle Side Bar Visibility', action: () => toggleSidebar() },
    { id: 'view.toggleBottomPanel', label: 'View: Toggle Panel', action: () => setBottomPanelOpen(!isBottomPanelOpen) },
    { id: 'editor.closeTab', label: 'Editor: Close Active Tab', action: () => {
        if (activeTabId && activePanelId) closeTab(activeTabId, activePanelId);
    }},
    { id: 'editor.toggleMinimap', label: 'Editor: Toggle Minimap', action: () => {
        const { settings, updateSettings } = useStore.getState();
        updateSettings({ minimap: !settings.minimap });
    }},
    { id: 'editor.toggleLineNumbers', label: 'Editor: Toggle Line Numbers', action: () => {
        const { settings, updateSettings } = useStore.getState();
        updateSettings({ lineNumbers: settings.lineNumbers === 'on' ? 'off' : 'on' });
    }},
    { id: 'editor.toggleWordWrap', label: 'Editor: Toggle Word Wrap', action: () => {
        const { settings, updateSettings } = useStore.getState();
        updateSettings({ wordWrap: settings.wordWrap === 'on' ? 'off' : 'on' });
    }},
    { id: 'ai.manageKeys', label: 'AI: Manage API Keys', action: () => setActiveSidebar('ai') },
    { id: 'view.resetSettings', label: 'Settings: Reset All to Default', action: () => {
        if (window.confirm('Are you sure you want to reset all settings?')) {
            localStorage.removeItem('apex-code-storage'); // Harsh but effective for persistence
            window.location.reload();
        }
    }},
  ];

  // Dynamic extension commands
  const extensionCommands = extensions.market
    .filter(ext => extensions.installed.includes(ext.id))
    .flatMap(ext => ext.contributions?.commands || [])
    .map(cmd => ({
        id: cmd.id,
        label: cmd.label,
        action: () => {
            console.log(`Executing extension command: ${cmd.id}`);
            alert(`Command executed: ${cmd.label}`);
        }
    }));

  const commands = [...baseCommands, ...extensionCommands];

  const filteredCommands = commands.filter(c => 
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isCommandPaletteOpen) {
      inputRef.current?.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  // Handle scroll into view
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
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
        const cmd = filteredCommands[selectedIndex];
        if (cmd) {
            cmd.action();
            toggleCommandPalette(false);
        }
    } else if (e.key === 'Escape') {
        toggleCommandPalette(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-2 px-4 pointer-events-none">
      <div 
        className="fixed inset-0 bg-black/50 pointer-events-auto" 
        onClick={() => toggleCommandPalette(false)} 
      />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="w-full max-w-2xl bg-[var(--workbench-bg)] rounded-md shadow-2xl border border-[#3c3c3c] overflow-hidden pointer-events-auto mt-12"
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
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-[var(--workbench-fg)] text-sm outline-none"
          />
        </div>
        <div ref={scrollRef} className="max-h-[400px] overflow-y-auto py-1">
          {filteredCommands.map((cmd, index) => (
            <button
              key={cmd.id}
              onClick={() => {
                cmd.action();
                toggleCommandPalette(false);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors group ${
                selectedIndex === index ? 'bg-[#007acc] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
            >
              <span>{cmd.label}</span>
              <Command size={14} className={`transition-opacity ${selectedIndex === index ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          ))}
          {filteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[#858585]">
              No matching commands
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CommandPalette;
