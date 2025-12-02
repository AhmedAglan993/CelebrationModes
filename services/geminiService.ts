import { GoogleGenAI } from "@google/genai";
import { Occasion } from "../types";

const getSystemInstruction = (): string => {
  return `You are a helpful assistant for a hospitality display system. 
Your goal is to write short, warm, and professional celebration messages.
Do not use emojis. 
Keep the tone joyful but elegant.
Maximum length: 40 words.`;
};

export const generateCelebrationMessage = async (
  guestName: string,
  occasion: Occasion
): Promise<string> => {
  try {
    // Safety check for browser environment
    const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
    
    if (!apiKey) {
      console.warn("API Key not found in process.env.API_KEY");
      // Return a nice fallback immediately if no key, instead of crashing
      return `Wishing you a very happy ${occasion.toLowerCase()}!`;
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Write a celebration message for a guest named "${guestName}" for their ${occasion}.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.7,
      },
    });

    if (response.text) {
      return response.text.trim();
    }
    
    return "Wishing you a wonderful celebration filled with joy and happiness.";
  } catch (error) {
    console.error("Error generating message:", error);
    // Fallback message in case of API failure
    return `Wishing you a very happy ${occasion.toLowerCase()}! We hope you have a wonderful time celebrating with us.`;
  }
};