import React, { useState } from 'react';
import { useStore } from '../../store';
import { AIProvider } from '../../types';
import { Key, Check, AlertCircle, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AIKeyManager = () => {
  const { aiProviders, setAIKey } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);

  const providerLinks: Record<string, string> = {
    gemini: 'https://ai.google.dev/',
    openai: 'https://platform.openai.com/api-keys',
    anthropic: 'https://console.anthropic.com/settings/keys',
    mistral: 'https://console.mistral.ai/api-keys/',
  };

  return (
    <div className="flex flex-col gap-1 p-2 bg-[#252526] rounded-md m-2 border border-[#3c3c3c]">
      <div className="text-[11px] uppercase font-bold text-[#858585] mb-2 flex items-center gap-1.5 px-1">
        <Key size={12} />
        Manage API Keys
      </div>
      
      {aiProviders.map((provider) => (
        <div key={provider.id} className="flex flex-col border-b border-[#333333] last:border-0">
          <button
            onClick={() => setExpandedId(expandedId === provider.id ? null : provider.id)}
            className="flex items-center justify-between p-2 hover:bg-[#2a2d2e] transition-colors rounded text-sm w-full text-left"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${provider.status === 'Active' ? 'bg-green-500' : 'bg-[#555555]'}`} />
              <span className={provider.status === 'Active' ? 'text-[#cccccc]' : 'text-[#858585]'}>
                {provider.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
               {provider.status === 'Active' && <Check size={14} className="text-green-500" />}
               <span className="text-[10px] text-[#666666]">{provider.id === expandedId ? '▼' : '▶'}</span>
            </div>
          </button>

          <AnimatePresence>
            {expandedId === provider.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-[#2d2d2d] px-2 pb-3 pt-1"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mt-1">
                    <div className="relative flex-1">
                      <input
                        type={showKeyId === provider.id ? 'text' : 'password'}
                        value={provider.apiKey || ''}
                        onChange={(e) => setAIKey(provider.id, e.target.value)}
                        placeholder={`Enter ${provider.name} API Key`}
                        className="w-full bg-[#3c3c3c] text-white text-xs p-1.5 pr-8 rounded border border-[#444] outline-none focus:border-[#007acc]"
                      />
                      <button
                        onClick={() => setShowKeyId(showKeyId === provider.id ? null : provider.id)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#858585] hover:text-white"
                      >
                        {showKeyId === provider.id ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px]">
                    <a 
                      href={providerLinks[provider.id]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#3794ff] hover:underline flex items-center gap-1"
                    >
                      Get your free key <ExternalLink size={8} />
                    </a>
                    {provider.apiKey && (
                      <button 
                        onClick={() => setAIKey(provider.id, '')}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove Key
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default AIKeyManager;
