import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { aiService } from '../../services/aiService';
import { Send, Eraser, Sparkles, Bot, User, Code, RotateCcw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AIKeyManager from './AIKeyManager';
import { motion } from 'motion/react';

const AIAssistant = () => {
  const { chatMessages, isAIChatLoading, sendChatMessage, clearChat, aiProviders, activeAIProviderId } = useStore();
  const [input, setInput] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeProvider = aiProviders.find(p => p.id === activeAIProviderId);
  const isKeyMissing = activeProvider?.status === 'No Key' && !process.env.GEMINI_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || isAIChatLoading || isKeyMissing) return;

    const content = input.trim();
    setInput('');
    await sendChatMessage(content);
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] select-none">
      <div className="p-3 bg-[#2d2d2d]/30 border-b border-[#2b2b2b] flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#007acc]" />
            <span className="text-[11px] font-bold text-[#cccccc] uppercase tracking-tighter">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
            <button 
                onClick={() => setShowKeys(!showKeys)}
                className={`p-1 rounded transition-colors ${showKeys ? 'bg-[#007acc] text-white' : 'text-[#858585] hover:text-[#cccccc]'}`}
                title="Manage API Keys"
            >
                <Code size={14} />
            </button>
            <button 
                onClick={clearChat}
                className="p-1 text-[#858585] hover:text-[#cccccc] transition-colors"
                title="Clear Chat"
            >
                <Eraser size={14} />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        {showKeys ? (
             <div className="absolute inset-0 z-10 bg-[#252526] overflow-y-auto">
                <AIKeyManager />
                <div className="p-4">
                    <button 
                        onClick={() => setShowKeys(false)}
                        className="w-full py-2 bg-[#007acc] text-white text-xs font-medium rounded hover:bg-[#0062a3]"
                    >
                        Return to Chat
                    </button>
                </div>
             </div>
        ) : null}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {chatMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-50 px-6 text-center">
              <Bot size={48} className="text-[#858585] mb-4" />
              <p className="text-sm font-medium text-[#cccccc] mb-2">ApexCode AI is ready</p>
              <p className="text-xs text-[#858585]">Ask any question about your code or request refactoring and explanation.</p>
            </div>
          )}

          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${msg.role === 'user' ? 'bg-[#3c3c3c] text-[#cccccc]' : 'bg-[#007acc] text-white'}`}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                <span className="text-[10px] text-[#858585]">{msg.role === 'user' ? 'You' : 'Apex AI'}</span>
              </div>
              
              <div className={`max-w-[90%] p-3 rounded-lg text-xs leading-relaxed ${
                msg.role === 'user' ? 'bg-[#007acc] text-white' : 'bg-[#1e1e1e] text-[#cccccc] border border-[#2b2b2b]'
              }`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, '')}
                          style={vscDarkPlus as any}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isAIChatLoading && (
            <div className="flex items-center gap-2 text-[#858585] text-xs">
              <RotateCcw size={14} className="animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {isKeyMissing && (
            <div className="px-4 py-2 bg-red-900/20 border-t border-red-900/50 flex items-center gap-3">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <div className="flex flex-col">
                    <span className="text-[10px] text-red-400 font-bold">API KEY MISSING</span>
                    <button 
                        onClick={() => setShowKeys(true)}
                        className="text-[10px] text-white underline text-left"
                    >
                        Add your {activeProvider?.name} key to start.
                    </button>
                </div>
            </div>
        )}

        <div className="p-4 border-t border-[#2b2b2b]">
          <div className="flex items-end gap-2 bg-[#1e1e1e] border border-[#3c3c3c] rounded-md p-2 focus-within:border-[#007acc] transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-white text-xs outline-none resize-none max-h-32 min-h-6"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isAIChatLoading || isKeyMissing}
              className={`p-1 rounded transition-colors ${
                !input.trim() || isAIChatLoading || isKeyMissing ? 'text-[#3c3c3c]' : 'text-[#007acc] hover:text-[#0062a3]'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
