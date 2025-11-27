import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    if (!apiKey) {
      return "請配置 API KEY 以啟用 AI 助手功能。";
    }
    const chat = getChatSession();
    const result = await chat.sendMessage({ message });
    return result.text || "抱歉，我現在無法回答。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "連線發生錯誤，請稍後再試。";
  }
};
