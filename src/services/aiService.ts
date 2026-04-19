import { GoogleGenAI } from "@google/genai";
import { useStore } from "../store";

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export class AIService {
  private static instance: AIService;
  
  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private getClient(): GoogleGenAI {
    const { aiProviders, activeAIProviderId } = useStore.getState();
    const provider = aiProviders.find(p => p.id === activeAIProviderId);
    
    // For Gemini, we use the GEMINI_API_KEY from environment if available, 
    // or the one provided by the user in the UI.
    const apiKey = provider?.apiKey || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("No API key found for the active AI provider.");
    }

    return new GoogleGenAI({ apiKey });
  }

  async chat(messages: ChatMessage[], systemInstruction?: string) {
    const ai = this.getClient();
    const { files } = useStore.getState();
    const projectStructure = files.map(f => `- ${f.path} (${f.type})`).join('\n');
    
    const defaultInstruction = `You are ApexCode Assistant, a world-class AI pair programmer.
Current Project Structure:
${projectStructure}

Use this information to provide contextually relevant advice. When referring to files, use their full paths.`;

    // Map roles to Gemini roles
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: systemInstruction || defaultInstruction,
      },
      history
    });

    const result = await chat.sendMessageStream({
        message: lastMessage
    });
    
    return result;
  }

  async generateCode(prompt: string, context?: string) {
    const ai = this.getClient();
    
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Context:\n${context || 'No specific context provided.'}\n\nPrompt:\n${prompt}`,
      config: {
        systemInstruction: "You are an expert software engineer. Provide only the code in your response, no explanations unless specifically asked. Use markdown code blocks.",
      }
    });

    return response.text;
  }

  async smartEdit(prompt: string, codeContext: string, selection?: string) {
    const ai = this.getClient();
    
    let fullPrompt = `Task: ${prompt}\n\n`;
    if (selection) {
      fullPrompt += `Current Selected Code:\n\`\`\`\n${selection}\n\`\`\`\n\n`;
    }
    fullPrompt += `Full File Context:\n\`\`\`\n${codeContext}\n\`\`\`\n\n`;
    fullPrompt += `Please provide ONLY the improved or generated code block. If you are modifying existing code, provide the full replacement for the relevant section. Wrap code in markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: {
        systemInstruction: "You are a senior software engineer. Your goal is to rewrite or generate code based on user instructions. Output ONLY the code, as it will be directly inserted into an editor. No talk.",
      }
    });

    return response.text;
  }

  async explainCode(code: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain this code snippet in detail, but keep it concise:\n\`\`\`\n${code}\n\`\`\``
    });
    return response.text;
  }
}

export const aiService = AIService.getInstance();
