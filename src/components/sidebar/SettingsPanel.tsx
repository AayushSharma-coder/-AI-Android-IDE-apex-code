import React, { useEffect } from 'react';
import { useStore } from '../../store';
import { 
  Settings as SettingsIcon, 
  Type, 
  Eye, 
  MousePointer2, 
  Layout, 
  ChevronRight,
  Palette
} from 'lucide-react';
import { themeService } from '../../services/themeService';

const SettingsPanel = () => {
  const { settings, updateSettings } = useStore();

  // Apply workbench theme colors to CSS variables
  useEffect(() => {
    const colors = themeService.getThemeColors(settings.theme);
    
    if (colors) {
        document.documentElement.style.setProperty('--workbench-bg', colors['editor.background']);
        document.documentElement.style.setProperty('--workbench-fg', colors['editor.foreground'] || '#cccccc');
        
        // Granular sidebar/activity bar variables
        if (colors['sideBar.background']) {
          document.documentElement.style.setProperty('--bg-surface', colors['sideBar.background']);
        }
        if (colors['activityBar.background']) {
          document.documentElement.style.setProperty('--bg-dark', colors['activityBar.background']);
        }
        if (colors['sideBar.border']) {
          document.documentElement.style.setProperty('--border-color', colors['sideBar.border']);
        }
    } else if (settings.theme === 'light') {
        document.documentElement.style.setProperty('--workbench-bg', '#ffffff');
        document.documentElement.style.setProperty('--workbench-fg', '#333333');
        document.documentElement.style.setProperty('--bg-surface', '#f3f3f3');
        document.documentElement.style.setProperty('--bg-dark', '#2c2c2c');
        document.documentElement.style.setProperty('--border-color', '#e5e5e5');
    } else {
        document.documentElement.style.setProperty('--workbench-bg', '#1e1e1e');
        document.documentElement.style.setProperty('--workbench-fg', '#cccccc');
        document.documentElement.style.setProperty('--bg-surface', '#252526');
        document.documentElement.style.setProperty('--bg-dark', '#333333');
        document.documentElement.style.setProperty('--border-color', '#2b2b2b');
    }
  }, [settings.theme]);

  const SettingItem = ({ icon: Icon, label, children }: any) => (
    <div className="flex flex-col gap-2 p-3 hover:bg-[#2a2d2e] transition-colors rounded-lg group">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-[#858585] group-hover:text-[#cccccc]" />
        <span className="text-[11px] font-bold text-[#858585] uppercase tracking-wider">{label}</span>
      </div>
      <div className="pl-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#252526] select-none text-[13px] overflow-y-auto scrollbar-hide">
      <div className="p-3 text-[11px] uppercase tracking-wider text-[#858585] font-bold border-b border-[#2b2b2b] flex items-center gap-2">
        <SettingsIcon size={14} />
        IDE Settings
      </div>

      <div className="p-2 space-y-1">
        {/* Editor Theme */}
        <SettingItem icon={Palette} label="Color Theme">
           <div className="flex flex-col gap-1">
                <select 
                    value={settings.theme}
                    onChange={(e) => updateSettings({ theme: e.target.value as any })}
                    className="bg-[#3c3c3c] text-[#cccccc] text-xs p-1.5 rounded border border-transparent outline-none focus:border-[#007acc] w-full"
                >
                    <option value="vs-dark">Visual Studio Dark</option>
                    <option value="light">Visual Studio Light</option>
                    <option value="one-dark">One Dark Pro</option>
                    <option value="dracula">Dracula</option>
                    <option value="cyberpunk">Cyberpunk 2077</option>
                    <option value="github-dark">GitHub Dark</option>
                    <option value="monokai">Monokai</option>
                </select>
                <p className="text-[10px] text-[#555555] mt-1">Select the primary interface theme</p>
           </div>
        </SettingItem>

        {/* Editor Appearance */}
        <SettingItem icon={Type} label="Editor Typography">
          <div className="space-y-3">
             <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#555555]">Font Size</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="range" 
                        min="8" max="32" 
                        value={settings.fontSize}
                        onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                        className="flex-1 accent-[#007acc]"
                    />
                    <span className="text-xs text-[#cccccc] w-4">{settings.fontSize}</span>
                </div>
             </div>
             
             <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#555555]">Font Family</label>
                <select 
                    value={settings.fontFamily}
                    onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                    className="bg-[#3c3c3c] text-[#cccccc] text-xs p-1 rounded border border-transparent outline-none focus:border-[#007acc]"
                >
                    <option value="JetBrains Mono, Fira Code, monospace">JetBrains Mono</option>
                    <option value="'Courier New', Courier, monospace">Courier New</option>
                    <option value="'Source Code Pro', monospace">Source Code Pro</option>
                </select>
             </div>
          </div>
        </SettingItem>

        <SettingItem icon={Eye} label="Display & Layout">
           <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#cccccc]">Minimap</span>
                <Toggle 
                    active={settings.minimap} 
                    onClick={() => updateSettings({ minimap: !settings.minimap })} 
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#cccccc]">Minimap Side</span>
                <select 
                    value={settings.minimapSide}
                    onChange={(e) => updateSettings({ minimapSide: e.target.value as any })}
                    className="bg-[#3c3c3c] text-[#cccccc] text-[10px] p-0.5 rounded outline-none"
                >
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#cccccc]">Line Numbers</span>
                <select 
                    value={settings.lineNumbers}
                    onChange={(e) => updateSettings({ lineNumbers: e.target.value as any })}
                    className="bg-[#3c3c3c] text-[#cccccc] text-[10px] p-0.5 rounded outline-none"
                >
                    <option value="on">On</option>
                    <option value="off">Off</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#cccccc]">Word Wrap</span>
                <Toggle 
                    active={settings.wordWrap === 'on'} 
                    onClick={() => updateSettings({ wordWrap: settings.wordWrap === 'on' ? 'off' : 'on' })} 
                />
              </div>
           </div>
        </SettingItem>

        <SettingItem icon={MousePointer2} label="Editor Behavior">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-[#cccccc]">Smooth Scrolling</span>
                    <Toggle 
                        active={settings.smoothScrolling} 
                        onClick={() => updateSettings({ smoothScrolling: !settings.smoothScrolling })} 
                    />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-[#cccccc]">Bracket Pairs</span>
                    <Toggle 
                        active={settings.bracketPairColorization} 
                        onClick={() => updateSettings({ bracketPairColorization: !settings.bracketPairColorization })} 
                    />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-[#cccccc]">Whitespace</span>
                    <select 
                        value={settings.renderWhitespace}
                        onChange={(e) => updateSettings({ renderWhitespace: e.target.value as any })}
                        className="bg-[#3c3c3c] text-[#cccccc] text-[10px] p-0.5 rounded outline-none"
                    >
                        <option value="none">None</option>
                        <option value="boundary">Boundary</option>
                        <option value="all">All</option>
                    </select>
                </div>
            </div>
        </SettingItem>

        <div className="mt-8 p-4 bg-[#1e1e1e]/50 rounded-lg mx-2 border border-[#333333]">
            <p className="text-[10px] text-[#858585] mb-2 leading-relaxed">
                Some features like Multi-cursor can be triggered via keyboard shortcuts in the editor (Alt+Click on Desktop, or dedicated commands).
            </p>
            <div className="flex items-center gap-1 text-[10px] text-[#007acc] font-bold">
                <ChevronRight size={10} />
                <span>PART 8: ADVANCED EDITOR</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-[#007acc]' : 'bg-[#3c3c3c]'}`}
    >
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
);

export default SettingsPanel;
