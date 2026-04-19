import React, { useState } from 'react';
import { useStore } from '../../store';
import { 
  Search as SearchIcon, 
  ChevronRight as ChevronRightIcon, 
  ChevronDown as ChevronDownIcon, 
  Replace as ReplaceIcon, 
  MoreHorizontal,
  CaseSensitive,
  WholeWord,
  Regex,
  X,
  FileText,
  RotateCw
} from 'lucide-react';
import { SearchResult } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

const SearchPanel = () => {
  const { searchState, updateSearch, performSearch, files, openTab, replaceAllInFile } = useStore();
  const { 
    query, 
    replaceQuery, 
    isReplaceOpen, 
    results, 
    isSearching, 
    useRegex, 
    matchCase, 
    wholeWord,
    includeFilter,
    excludeFilter
  } = searchState;
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const toggleReplace = () => updateSearch({ isReplaceOpen: !isReplaceOpen });
  const toggleAdvanced = () => setIsAdvancedOpen(!isAdvancedOpen);

  const clearSearch = () => {
    updateSearch({ query: '', results: [] });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        performSearch();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] select-none text-[13px]">
      <div className="p-3 text-[11px] uppercase tracking-wider text-[#858585] font-bold flex items-center justify-between">
        <span>Search</span>
        <div className="flex items-center gap-1">
            <button 
                onClick={clearSearch} 
                className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-[#cccccc]"
                title="Clear Search"
            >
                <X size={14} />
            </button>
            <button 
                onClick={toggleAdvanced} 
                className={`p-1 hover:bg-[#333333] rounded transition-colors ${isAdvancedOpen ? 'text-[#007acc]' : 'text-[#858585] hover:text-[#cccccc]'}`}
                title="Search Details"
            >
                <MoreHorizontal size={14} />
            </button>
        </div>
      </div>
      
      <div className="px-4 pb-4 space-y-2">
        <div className="flex flex-col gap-1">
          {/* Search Box */}
          <div className="flex items-center gap-1 bg-[#3c3c3c] rounded px-2 py-1 focus-within:ring-1 focus-within:ring-[#007acc]">
            <button onClick={toggleReplace} className="text-[#858585] hover:text-[#cccccc]">
               {isReplaceOpen ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
            </button>
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => updateSearch({ query: e.target.value })}
              onKeyDown={handleSearchKeyPress}
              className="flex-1 bg-transparent border-none outline-none text-[#cccccc] placeholder:text-[#555555] text-xs h-6"
            />
            <div className="flex items-center gap-0.5">
               <SearchToggle 
                active={matchCase} 
                onClick={() => updateSearch({ matchCase: !matchCase })} 
                icon={CaseSensitive} 
                title="Match Case" 
               />
               <SearchToggle 
                active={wholeWord} 
                onClick={() => updateSearch({ wholeWord: !wholeWord })} 
                icon={WholeWord} 
                title="Whole Word" 
               />
               <SearchToggle 
                active={useRegex} 
                onClick={() => updateSearch({ useRegex: !useRegex })} 
                icon={Regex} 
                title="Use Regular Expression" 
               />
            </div>
          </div>
          
          {/* Replace Box */}
          {isReplaceOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center bg-[#3c3c3c] rounded focus-within:ring-1 focus-within:ring-[#007acc] mt-1"
            >
               <input
                type="text"
                placeholder="Replace"
                value={replaceQuery}
                onChange={(e) => updateSearch({ replaceQuery: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-[#cccccc] placeholder:text-[#555555] px-2 py-1 ml-4 text-xs h-6"
               />
               <button 
                className="p-1.5 text-[#858585] hover:text-[#cccccc]" 
                title="Replace All"
                onClick={() => {
                    results.forEach(res => replaceAllInFile(res.fileId, query, replaceQuery));
                }}
               >
                  <ReplaceIcon size={14} />
               </button>
            </motion.div>
          )}

          {/* Advanced Filters */}
          <AnimatePresence>
            {isAdvancedOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 mt-2 pt-2 border-t border-[#2b2b2b] overflow-hidden"
                >
                    <div className="space-y-1">
                        <label className="text-[10px] text-[#858585] font-bold uppercase px-1">Files to include</label>
                        <input
                            type="text"
                            placeholder="e.g. *.ts, src/"
                            value={includeFilter}
                            onChange={(e) => updateSearch({ includeFilter: e.target.value })}
                            className="w-full bg-[#3c3c3c] text-[#cccccc] text-[11px] px-2 py-1 rounded outline-none placeholder:text-[#555555] focus:ring-1 focus:ring-[#007acc]"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-[#858585] font-bold uppercase px-1">Files to exclude</label>
                        <input
                            type="text"
                            placeholder="e.g. *.json, node_modules/"
                            value={excludeFilter}
                            onChange={(e) => updateSearch({ excludeFilter: e.target.value })}
                            className="w-full bg-[#3c3c3c] text-[#cccccc] text-[11px] px-2 py-1 rounded outline-none placeholder:text-[#555555] focus:ring-1 focus:ring-[#007acc]"
                        />
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Header */}
      {results.length > 0 && (
          <div className="px-4 py-1.5 bg-[#2d2d2d]/30 text-[10px] text-[#858585] font-bold border-y border-[#2b2b2b]">
              {results.reduce((acc, r) => acc + r.matches.length, 0)} results in {results.length} files
          </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide py-1">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-[#555555]">
              <RotateCw size={24} className="animate-spin" />
              <span className="text-xs italic">Searching workspace...</span>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-0.5">
            {results.map((result) => (
                <SearchFileResult key={result.fileId} result={result} />
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center text-[#555555]">
              <SearchIcon size={32} className="mb-2 opacity-20" />
              <p className="text-xs">No results found for '{query}'</p>
              <p className="text-[10px] mt-2 leading-relaxed">Try adjusting your filters or search options.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center text-[#555555]">
             <SearchIcon size={48} className="mb-4 opacity-10" />
             <p className="text-xs">Enter a search term to find across the project.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchToggle = ({ active, onClick, icon: Icon, title }: any) => (
    <button 
        onClick={onClick}
        className={`p-1 rounded transition-colors ${active ? 'bg-[#007acc] text-white' : 'text-[#858585] hover:bg-[#454545]'}`}
        title={title}
    >
        <Icon size={14} />
    </button>
);

const SearchFileResult: React.FC<{ result: SearchResult }> = ({ result }) => {
    const [isOpen, setIsOpen] = useState(true);
    const { files, openTab, searchState } = useStore();
    const file = files.find(f => f.id === result.fileId);

    if (!file) return null;

    const highlightMatch = (text: string, index: number, length: number) => {
        const before = text.substring(0, index);
        const match = text.substring(index, index + length);
        const after = text.substring(index + length);
        
        return (
            <>
                <span className="opacity-60">{before}</span>
                <span className="text-white bg-[#007acc]/40 font-bold rounded-sm px-0.5">{match}</span>
                <span className="opacity-60">{after}</span>
            </>
        );
    };

    return (
        <div className="mb-0.5">
            <div 
                className="flex items-center px-4 py-1.5 hover:bg-[#2a2d2e] cursor-pointer group border-l-2 border-transparent hover:border-[#007acc] transition-all"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-4 h-4 mr-1 text-[#858585]">
                    {isOpen ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
                </div>
                <FileText size={14} className="mr-2 text-[#519aba] shrink-0" />
                <span className="flex-1 truncate text-[#cccccc] font-medium text-[12px]">{result.fileName}</span>
                <span className="text-[9px] text-[#858585] ml-2 opacity-60 truncate">{result.filePath}</span>
                <span className="text-[10px] text-[#cccccc] px-1.5 py-0.5 bg-[#333333] rounded-sm group-hover:bg-[#444444] ml-auto font-mono">
                    {result.matches.length}
                </span>
            </div>
            
            {isOpen && (
                <div className="ml-6 border-l border-[#333333]">
                    {result.matches.map((match, idx) => {
                        // Find the start index for a better preview if match is deep in line
                        const start = Math.max(0, match.index - 20);
                        const end = Math.min(match.text.length, match.index + match.length + 40);
                        const previewText = match.text.substring(start, end);
                        const relativeIndex = match.index - start;

                        return (
                            <div 
                                key={`${result.fileId}-${idx}`} 
                                className="px-4 py-1 hover:bg-[#323233] cursor-pointer text-[#858585] hover:text-[#cccccc] text-[11px] group/match flex items-center gap-2 border-l-2 border-transparent hover:border-[#007acc] ml-2"
                                onClick={() => openTab(file, undefined, { 
                                    line: match.line, 
                                    column: match.index + 1, 
                                    length: match.length 
                                })}
                            >
                                <span className="text-[#555555] opacity-60 font-mono w-4 text-right">{match.line}</span>
                                <span className="flex-1 truncate font-mono">
                                    {highlightMatch(previewText, relativeIndex, match.length)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchPanel;
