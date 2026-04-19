/**
 * ApexCode - Master Blueprint Types
 * These define the standard interfaces for all subsystems.
 */

export type ThemeType = 'vs-dark' | 'light' | 'one-dark' | 'dracula' | 'cyberpunk' | 'github-dark' | 'monokai';

export interface ThemeDefinition {
  id: ThemeType;
  name: string;
  type: 'dark' | 'light';
  colors: {
    [key: string]: string;
  };
  rules: {
    token: string;
    foreground?: string;
    background?: string;
    fontStyle?: string;
  }[];
}

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  parentId?: string;
  content?: string;
  language?: string;
}

export interface EditorLocation {
  line: number;
  column?: number;
  length?: number;
}

export interface EditorTab {
  id: string;
  fileId: string;
  title: string;
  isDirty: boolean;
  content: string;
  language: string;
  lastScrollPosition?: number;
}

export interface AIProvider {
  id: string;
  name: string;
  icon: string;
  status: 'Active' | 'No Key' | 'Free';
  apiKey?: string;
}

export interface Settings {
  theme: ThemeType;
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  minimapSide: 'right' | 'left';
  lineNumbers: 'on' | 'off';
  renderWhitespace: 'none' | 'boundary' | 'all';
  cursorStyle: 'line' | 'block' | 'underline';
  smoothScrolling: boolean;
  bracketPairColorization: boolean;
}

export interface Project {
  id: string;
  name: string;
  path: string;
  lastOpened: number;
}

export interface EditorPanelState {
  id: string;
  activeTabId: string | null;
  tabIds: string[];
}

export interface SearchResult {
  fileId: string;
  filePath: string;
  fileName: string;
  matches: {
    line: number;
    text: string;
    preview: string;
    index: number;
    length: number;
  }[];
}

export interface GitChange {
  fileId: string;
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
  staged: boolean;
}

export interface Extension {
  id: string;
  name: string;
  publisher: string;
  description: string;
  version: string;
  icon: string;
  installed: boolean;
  rating: number;
  downloads: string;
  categories: string[];
  contributions?: {
    commands?: { id: string; label: string }[];
    languages?: { id: string; extensions: string[]; icon?: string }[];
    themes?: string[];
    views?: { id: string; title: string }[];
  };
}

export interface AppState {
  // Navigation
  activeSidebar: 'explorer' | 'search' | 'git' | 'extensions' | 'ai' | 'settings';
  isSidebarOpen: boolean;
  isCommandPaletteOpen: boolean;
  isQuickOpenOpen: boolean;
  
  // UI Panels
  bottomPanelTab: 'terminal' | 'problems' | 'output' | 'debug';
  isBottomPanelOpen: boolean;
  
  // Search
  searchState: {
    query: string;
    replaceQuery: string;
    isReplaceOpen: boolean;
    results: SearchResult[];
    isSearching: boolean;
    useRegex: boolean;
    matchCase: boolean;
    wholeWord: boolean;
    includeFilter: string;
    excludeFilter: string;
  };
  
  // AI Chat
  chatMessages: {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: number;
  }[];
  isAIChatLoading: boolean;
  
  // Smart Edit
  smartEdit: {
    isOpen: boolean;
    lineNumber: number;
    prompt: string;
    isGenerating: boolean;
    selection: { startLine: number; endLine: number } | null;
  };
  
  // Projects & Files
  currentProject: Project | null;
  files: FileNode[];
  
  // Editor
  tabs: EditorTab[];
  panels: EditorPanelState[];
  activePanelId: string;
  pendingNavigation: {
    fileId: string;
    location: EditorLocation;
  } | null;
  
  // AI
  aiProviders: AIProvider[];
  activeAIProviderId: string;
  
  // Settings
  settings: Settings;

  // Git / Source Control
  gitState: {
    branches: string[];
    activeBranch: string;
    changes: GitChange[];
    isStagingAll: boolean;
  };

  // Extensions
  extensions: {
    market: Extension[];
    installed: string[];
    installing: string[];
  };
}
