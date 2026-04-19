import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function parseTransactionWithAI(text: string): Promise<Partial<Transaction> | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set.");
    return null;
  }

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["expense", "income"] },
            isSpend: { type: Type.BOOLEAN },
            date: { type: Type.STRING }
          },
          required: ["amount", "description", "category", "type"]
        }
      }
    });

    const prompt = `
      Extract transaction details from this text: "${text}".
      Identify if it is an expense or income.
      Categories should be one of: Food, Transport, Shopping, Bills, Entertainment, Health, Income, Miscellaneous.
      If it's a bank SMS, set isSpend to true if it's a debit.
      Ensure response is in JSON format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonStr = response.text();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return null;
  }
}

export async function suggestCategoryWithAI(description: string, categories: string[]): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Suggest the best category for this description: "${description}".
      Choose from: ${categories.join(", ")}.
      Return ONLY the category name.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return null;
  }
}
