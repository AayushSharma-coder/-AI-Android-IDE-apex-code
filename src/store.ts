import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, AIProvider, Settings, EditorTab, FileNode, Project, EditorPanelState, Extension, EditorLocation } from './types';
import { INITIAL_EXTENSIONS } from './constants/extensions';

interface AppActions {
  setActiveSidebar: (sidebar: AppState['activeSidebar']) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  
  toggleCommandPalette: (isOpen?: boolean) => void;
  toggleQuickOpen: (isOpen?: boolean) => void;
  setBottomPanelTab: (tab: AppState['bottomPanelTab']) => void;
  setBottomPanelOpen: (isOpen: boolean) => void;
  
  // Projects & Files
  currentProject: Project | null;
  files: FileNode[];
  setFiles: (files: FileNode[]) => void;
  addFile: (file: FileNode) => void;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  createFolder: (name: string, parentId?: string) => void;
  createFile: (name: string, parentId?: string) => void;
  
  // Editor Actions
  openTab: (file: FileNode, panelId?: string, location?: EditorLocation) => void;
  closeTab: (tabId: string, panelId?: string) => void;
  setActiveTabId: (tabId: string, panelId?: string) => void;
  setActivePanelId: (panelId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  splitPanel: (panelId: string, direction: 'horizontal' | 'vertical') => void;
  clearPendingNavigation: () => void;
  
  // AI Actions
  setAIKey: (providerId: string, apiKey: string) => void;
  setActiveAIProvider: (providerId: string) => void;

  // Search Actions
  updateSearch: (search: Partial<AppState['searchState']>) => void;
  performSearch: () => void;
  replaceInFile: (fileId: string, search: string, replace: string) => void;
  replaceAllInFile: (fileId: string, search: string, replace: string) => void;

  // AI Chat Actions
  sendChatMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  
  // Smart Edit Actions
  openSmartEdit: (lineNumber: number, selection?: { startLine: number; endLine: number }) => void;
  closeSmartEdit: () => void;
  updateSmartEdit: (data: Partial<AppState['smartEdit']>) => void;
  
  // Settings
  updateSettings: (settings: Partial<Settings>) => void;

  // Git Actions
  stageChange: (fileId: string) => void;
  unstageChange: (fileId: string) => void;
  stageAll: () => void;
  unstageAll: () => void;
  commitChanges: (message: string) => void;
  discardChange: (fileId: string) => void;

  // Extension Actions
  installExtension: (extensionId: string) => void;
  uninstallExtension: (extensionId: string) => void;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'elegant-dark',
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Fira Code, monospace',
  tabSize: 2,
  wordWrap: 'on',
  minimap: true,
  minimapSide: 'right',
  lineNumbers: 'on',
  renderWhitespace: 'none',
  cursorStyle: 'line',
  smoothScrolling: true,
  bracketPairColorization: true,
};

const INITIAL_PROVIDERS: AIProvider[] = [
  { id: 'gemini', name: 'Google Gemini', icon: 'Sparkles', status: 'No Key' },
  { id: 'openai', name: 'OpenAI GPT-4o', icon: 'Zap', status: 'No Key' },
  { id: 'anthropic', name: 'Anthropic Claude', icon: 'Cpu', status: 'No Key' },
  { id: 'mistral', name: 'Mistral AI', icon: 'Wind', status: 'No Key' },
];

const INITIAL_PANEL_ID = 'main-panel';

export const useStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      activeSidebar: 'explorer',
      isSidebarOpen: true,
      isCommandPaletteOpen: false,
      isQuickOpenOpen: false,
      bottomPanelTab: 'terminal',
      isBottomPanelOpen: false,
      currentProject: { id: 'default', name: 'ApexCode Project', path: '/', lastOpened: Date.now() },
      files: [
        { id: 'root', name: 'src', path: 'src', type: 'directory' },
        { id: 'app-tsx', name: 'App.tsx', path: 'src/App.tsx', type: 'file', parentId: 'root', language: 'typescript', content: 'export default function App() {\n  return <div>Hello World</div>;\n}' },
        { id: 'styles-css', name: 'index.css', path: 'src/index.css', type: 'file', parentId: 'root', language: 'css', content: 'body { background: #1e1e1e; }' },
      ],
      tabs: [],
      panels: [{ id: INITIAL_PANEL_ID, activeTabId: null, tabIds: [] }],
      activePanelId: INITIAL_PANEL_ID,
      pendingNavigation: null,
      aiProviders: INITIAL_PROVIDERS,
      activeAIProviderId: 'gemini',
      settings: DEFAULT_SETTINGS,
      searchState: {
        query: '',
        replaceQuery: '',
        isReplaceOpen: false,
        results: [],
        isSearching: false,
        useRegex: false,
        matchCase: false,
        wholeWord: false,
        includeFilter: '',
        excludeFilter: '',
      },
      chatMessages: [],
      isAIChatLoading: false,
      smartEdit: {
        isOpen: false,
        lineNumber: 0,
        prompt: '',
        isGenerating: false,
        selection: null,
      },
      gitState: {
        branches: ['main', 'develop', 'feature/ai-integration'],
        activeBranch: 'main',
        changes: [],
        isStagingAll: false,
      },
      extensions: {
        market: INITIAL_EXTENSIONS,
        installed: [],
        installing: [],
      },
      
      setActiveSidebar: (sidebar) => set({ activeSidebar: sidebar, isSidebarOpen: true }),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      toggleCommandPalette: (isOpen) => set((state) => ({ 
        isCommandPaletteOpen: isOpen !== undefined ? isOpen : !state.isCommandPaletteOpen,
        isQuickOpenOpen: false 
      })),
      toggleQuickOpen: (isOpen) => set((state) => ({ 
        isQuickOpenOpen: isOpen !== undefined ? isOpen : !state.isQuickOpenOpen,
        isCommandPaletteOpen: false 
      })),
      setBottomPanelTab: (tab) => set({ bottomPanelTab: tab, isBottomPanelOpen: true }),
      setBottomPanelOpen: (isOpen) => set({ isBottomPanelOpen: isOpen }),

      setFiles: (files) => set({ files }),
      
      addFile: (file) => set((state) => ({ 
        files: [...state.files, file],
        gitState: {
          ...state.gitState,
          changes: [...state.gitState.changes, {
            fileId: file.id,
            path: file.path,
            status: 'added',
            staged: false
          }]
        }
      })),
      
      deleteFile: (fileId) => set((state) => {
        const fileToDelete = state.files.find(f => f.id === fileId);
        if (!fileToDelete) return state;
        
        // Also delete children if it's a directory
        const idsToDelete = new Set([fileId]);
        if (fileToDelete.type === 'directory') {
          const findChildren = (pid: string) => {
            state.files.filter(f => f.parentId === pid).forEach(c => {
              idsToDelete.add(c.id);
              if (c.type === 'directory') findChildren(c.id);
            });
          };
          findChildren(fileId);
        }
        
        const newFiles = state.files.filter(f => !idsToDelete.has(f.id));
        const newTabs = state.tabs.filter(t => !idsToDelete.has(t.fileId));
        
        // Update git changes
        let newGitChanges = state.gitState.changes.filter(c => !idsToDelete.has(c.fileId));
        // If the file was not just 'added' in this session, mark as 'deleted'
        if (fileToDelete.type === 'file') {
            const wasAdded = state.gitState.changes.find(c => c.fileId === fileId && c.status === 'added');
            if (!wasAdded) {
                newGitChanges.push({
                    fileId: fileId,
                    path: fileToDelete.path,
                    status: 'deleted',
                    staged: false
                });
            }
        }

        return { 
          files: newFiles,
          tabs: newTabs,
          gitState: {
            ...state.gitState,
            changes: newGitChanges
          },
          panels: state.panels.map(p => ({
            ...p,
            tabIds: p.tabIds.filter(id => {
              const tab = state.tabs.find(t => t.id === id);
              return tab && !idsToDelete.has(tab.fileId);
            }),
            activeTabId: (p.activeTabId && state.tabs.find(t => t.id === p.activeTabId && idsToDelete.has(t.fileId))) ? null : p.activeTabId
          }))
        };
      }),

      renameFile: (fileId, newName) => set((state) => ({
        files: state.files.map(f => f.id === fileId ? { ...f, name: newName } : f)
      })),

      createFile: (name, parentId) => {
        const id = Math.random().toString(36).substring(7);
        const parent = get().files.find(f => f.id === parentId);
        const path = parent ? `${parent.path}/${name}` : name;
        const extension = name.split('.').pop() || '';
        const languageMap: Record<string, string> = {
          'ts': 'typescript',
          'tsx': 'typescript',
          'js': 'javascript',
          'jsx': 'javascript',
          'css': 'css',
          'html': 'html',
          'md': 'markdown',
          'json': 'json'
        };
        
        const newFile: FileNode = {
          id,
          name,
          path,
          type: 'file',
          parentId,
          language: languageMap[extension] || 'plaintext',
          content: ''
        };
        get().addFile(newFile);
      },

      createFolder: (name, parentId) => {
        const id = Math.random().toString(36).substring(7);
        const parent = get().files.find(f => f.id === parentId);
        const path = parent ? `${parent.path}/${name}` : name;
        
        const newFolder: FileNode = {
          id,
          name,
          path,
          type: 'directory',
          parentId
        };
        get().addFile(newFolder);
      },

      openTab: (file, panelId, location) => {
        const state = get();
        const pId = panelId || state.activePanelId;
        
        let existingTab = state.tabs.find((t) => t.fileId === file.id);
        let tabId = existingTab?.id;

        if (!existingTab) {
          tabId = Math.random().toString(36).substring(7);
          const newTab: EditorTab = {
            id: tabId,
            fileId: file.id,
            title: file.name,
            isDirty: false,
            content: file.content || '',
            language: file.language || 'javascript',
          };
          set({ tabs: [...state.tabs, newTab] });
        }

        set({
          panels: state.panels.map((p) => {
            if (p.id === pId) {
              const newTabIds = p.tabIds.includes(tabId!) ? p.tabIds : [...p.tabIds, tabId!];
              return { ...p, activeTabId: tabId!, tabIds: newTabIds };
            }
            return p;
          }),
          activePanelId: pId,
          pendingNavigation: location ? { fileId: file.id, location } : state.pendingNavigation
        });
      },

      clearPendingNavigation: () => set({ pendingNavigation: null }),

      closeTab: (tabId, panelId) => {
        const state = get();
        set({
          panels: state.panels.map((p) => {
            if (p.id === (panelId || state.activePanelId)) {
              const newTabIds = p.tabIds.filter((id) => id !== tabId);
              let newActiveTabId = p.activeTabId;
              if (p.activeTabId === tabId) {
                newActiveTabId = newTabIds.length > 0 ? newTabIds[newTabIds.length - 1] : null;
              }
              return { ...p, activeTabId: newActiveTabId, tabIds: newTabIds };
            }
            return p;
          }),
        });
        
        // Clean up orphaned tabs (optional logic, keeping for now)
        const allTabIdsInPanels = new Set(get().panels.flatMap(p => p.tabIds));
        if (!allTabIdsInPanels.has(tabId)) {
           set({ tabs: get().tabs.filter(t => t.id !== tabId) });
        }
      },

      setActiveTabId: (tabId, panelId) => {
        const state = get();
        const pId = panelId || state.activePanelId;
        set({
          panels: state.panels.map((p) => 
            p.id === pId ? { ...p, activeTabId: tabId } : p
          ),
          activePanelId: pId,
        });
      },

      setActivePanelId: (panelId) => set({ activePanelId: panelId }),

      updateTabContent: (tabId, content) => set((state) => {
        const tab = state.tabs.find(t => t.id === tabId);
        if (!tab) return state;

        const file = state.files.find(f => f.id === tab.fileId);
        if (!file) return state;

        // Add to git changes if not already there
        const alreadyTracked = state.gitState.changes.find(c => c.fileId === file.id);
        const newChanges = [...state.gitState.changes];
        
        if (!alreadyTracked && tab.content !== content) {
          newChanges.push({
            fileId: file.id,
            path: file.path,
            status: 'modified',
            staged: false
          });
        }

        return {
          tabs: state.tabs.map((t) => t.id === tabId ? { ...t, content, isDirty: true } : t),
          gitState: {
            ...state.gitState,
            changes: newChanges
          }
        };
      }),

      splitPanel: (panelId, direction) => {
        const state = get();
        const existingPanel = state.panels.find(p => p.id === panelId);
        if (!existingPanel) return;

        const newPanel: EditorPanelState = {
          id: Math.random().toString(36).substring(7),
          activeTabId: existingPanel.activeTabId,
          tabIds: [...existingPanel.tabIds],
        };

        set({
          panels: [...state.panels, newPanel],
          activePanelId: newPanel.id
        });
      },

      setAIKey: (providerId, apiKey) => set((state) => ({
        aiProviders: state.aiProviders.map((p) => 
          p.id === providerId 
            ? { ...p, apiKey, status: apiKey ? 'Active' : 'No Key' } 
            : p
        )
      })),
      
      setActiveAIProvider: (providerId) => set({ activeAIProviderId: providerId }),

      updateSearch: (search) => set((state) => ({ 
        searchState: { ...state.searchState, ...search } 
      })),

      performSearch: () => {
        const { query, useRegex, matchCase, wholeWord, includeFilter, excludeFilter } = get().searchState;
        if (!query) {
          set((state) => ({ searchState: { ...state.searchState, results: [] } }));
          return;
        }

        set((state) => ({ searchState: { ...state.searchState, isSearching: true } }));

        setTimeout(() => {
          const files = get().files;
          const tabs = get().tabs;
          const results: any[] = [];
          
          let regex: RegExp;
          try {
            const flags = 'g' + (matchCase ? '' : 'i');
            const pattern = useRegex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const finalPattern = wholeWord ? `\\b${pattern}\\b` : pattern;
            regex = new RegExp(finalPattern, flags);
          } catch (e) {
            set((state) => ({ searchState: { ...state.searchState, isSearching: false, results: [] } }));
            return;
          }

          // Simple glob-to-regex for filters (just startsWith/endsWith/includes for basics)
          const matchesFilter = (path: string, filter: string, isExclude = false) => {
            if (!filter) return !isExclude;
            const patterns = filter.split(',').map(p => p.trim()).filter(Boolean);
            if (patterns.length === 0) return !isExclude;
            
            const matches = patterns.some(p => {
                // Very basic "glob" support: *.ts or src/
                const globPattern = p.replace(/\./g, '\\.').replace(/\*/g, '.*');
                return new RegExp(`^${globPattern}$|^${globPattern}/|/${globPattern}`).test(path);
            });
            return isExclude ? !matches : matches;
          };

          files.forEach((file) => {
            if (file.type !== 'file') return;
            
            // Apply include/exclude filters
            if (!matchesFilter(file.path, includeFilter, false)) return;
            if (!matchesFilter(file.path, excludeFilter, true)) return;

            // Use content from tab if it's open (support dirty state search)
            const tab = tabs.find(t => t.fileId === file.id);
            const content = tab ? tab.content : file.content;

            if (content) {
              const lines = content.split('\n');
              const matches: any[] = [];
              
              lines.forEach((lineText, lineIdx) => {
                let match;
                // Reset regex lastIndex because of 'g' flag
                regex.lastIndex = 0;
                while ((match = regex.exec(lineText)) !== null) {
                  matches.push({
                    line: lineIdx + 1,
                    text: lineText,
                    preview: lineText.trim(),
                    index: match.index,
                    length: match[0].length
                  });
                  // Safety for empty matches to avoid infinite loop
                  if (match[0].length === 0) regex.lastIndex++;
                }
              });

              if (matches.length > 0) {
                results.push({
                  fileId: file.id,
                  filePath: file.path,
                  fileName: file.name,
                  matches
                });
              }
            }
          });

          set((state) => ({ 
            searchState: { ...state.searchState, isSearching: false, results } 
          }));
        }, 100);
      },

      replaceInFile: (fileId, search, replace) => {
        const state = get();
        const file = state.files.find(f => f.id === fileId);
        if (!file || !file.content) return;

        const newContent = file.content.replace(search, replace);
        set((state) => ({
          files: state.files.map(f => f.id === fileId ? { ...f, content: newContent } : f)
        }));
        
        // Update tab content if open
        const tab = state.tabs.find(t => t.fileId === fileId);
        if (tab) {
          state.updateTabContent(tab.id, newContent);
        }
        
        get().performSearch();
      },

      replaceAllInFile: (fileId, search, replace) => {
        const state = get();
        const file = state.files.find(f => f.id === fileId);
        if (!file || !file.content) return;

        const { useRegex, matchCase, wholeWord } = state.searchState;
        const flags = matchCase ? 'g' : 'gi';
        const pattern = useRegex ? search : search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const finalPattern = wholeWord ? `\\b${pattern}\\b` : pattern;
        const regex = new RegExp(finalPattern, flags);

        const newContent = file.content.replace(regex, replace);
        set((state) => ({
          files: state.files.map(f => f.id === fileId ? { ...f, content: newContent } : f)
        }));

        const tab = state.tabs.find(t => t.fileId === fileId);
        if (tab) {
          state.updateTabContent(tab.id, newContent);
        }
        
        get().performSearch();
      },

      sendChatMessage: async (content) => {
        const { chatMessages } = get();
        const userMessage = {
          id: Math.random().toString(36).substring(7),
          role: 'user' as const,
          content,
          timestamp: Date.now()
        };

        set({ chatMessages: [...chatMessages, userMessage], isAIChatLoading: true });

        try {
          const { aiService } = await import('./services/aiService');
          const messages = [...chatMessages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content }];
          const stream = await aiService.chat(messages as any);
          
          const modelMessageId = Math.random().toString(36).substring(7);
          set((state) => ({
            chatMessages: [
              ...state.chatMessages,
              { id: modelMessageId, role: 'model', content: '', timestamp: Date.now() }
            ]
          }));

          let fullResponse = '';
          for await (const chunk of stream) {
            if (chunk.text) {
              fullResponse += chunk.text;
              set((state) => ({
                chatMessages: state.chatMessages.map(m => 
                  m.id === modelMessageId ? { ...m, content: fullResponse } : m
                )
              }));
            }
          }
        } catch (error) {
          console.error('AI Chat Error:', error);
          const errorMessage = {
            id: Math.random().toString(36).substring(7),
            role: 'model' as const,
            content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
            timestamp: Date.now()
          };
          set((state) => ({ chatMessages: [...state.chatMessages, errorMessage] }));
        } finally {
          set({ isAIChatLoading: false });
        }
      },

      clearChat: () => set({ chatMessages: [] }),

      openSmartEdit: (lineNumber, selection) => set({ 
        smartEdit: { 
          isOpen: true, 
          lineNumber, 
          prompt: '', 
          isGenerating: false, 
          selection: selection || null 
        } 
      }),
      closeSmartEdit: () => set({ smartEdit: { ...get().smartEdit, isOpen: false } }),
      updateSmartEdit: (data) => set({ smartEdit: { ...get().smartEdit, ...data } }),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      // Git Actions
      stageChange: (fileId) => set((state) => ({
        gitState: {
          ...state.gitState,
          changes: state.gitState.changes.map(c => 
            c.fileId === fileId ? { ...c, staged: true } : c
          )
        }
      })),

      unstageChange: (fileId) => set((state) => ({
        gitState: {
          ...state.gitState,
          changes: state.gitState.changes.map(c => 
            c.fileId === fileId ? { ...c, staged: false } : c
          )
        }
      })),

      stageAll: () => set((state) => ({
        gitState: {
          ...state.gitState,
          changes: state.gitState.changes.map(c => ({ ...c, staged: true }))
        }
      })),

      unstageAll: () => set((state) => ({
        gitState: {
          ...state.gitState,
          changes: state.gitState.changes.map(c => ({ ...c, staged: false }))
        }
      })),

      commitChanges: (message) => set((state) => {
        if (!message.trim()) return state;
        const remainingChanges = state.gitState.changes.filter(c => !c.staged);
        return {
          gitState: {
            ...state.gitState,
            changes: remainingChanges
          }
        };
      }),

      discardChange: (fileId) => set((state) => ({
        gitState: {
          ...state.gitState,
          changes: state.gitState.changes.filter(c => c.fileId !== fileId)
        }
      })),

      // Extension Actions
      installExtension: (extensionId) => {
        set((state) => ({
          extensions: {
            ...state.extensions,
            installing: [...state.extensions.installing, extensionId]
          }
        }));

        // Simulate installation lag
        setTimeout(() => {
          set((state) => ({
            extensions: {
              ...state.extensions,
              installing: state.extensions.installing.filter(id => id !== extensionId),
              installed: [...state.extensions.installed, extensionId]
            }
          }));
        }, 1500);
      },

      uninstallExtension: (extensionId) => set((state) => ({
        extensions: {
          ...state.extensions,
          installed: state.extensions.installed.filter(id => id !== extensionId)
        }
      })),
    }),
    {
      name: 'apex-code-storage',
      partialize: (state) => ({
        aiProviders: state.aiProviders,
        settings: state.settings,
        currentProject: state.currentProject,
        extensions: state.extensions,
      }),
    }
  )
);
