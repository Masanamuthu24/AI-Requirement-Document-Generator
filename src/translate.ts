// import OpenAI from "openai";
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function translateText(
//   text: string,
//   targetLang: "es" | "en" = "es"
// ): Promise<string> {
//   try {
//     const res = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "You are a helpful translator." },
//         { role: "user", content: `Translate this to ${targetLang}: "${text}"` },
//       ],
//     });

//     // Safe access with null checks
//     const choice = res.choices?.[0];
//     const message = choice?.message?.content;

//     if (message) {
//       return message.trim();
//     } else {
//       console.warn("GPT translation returned no message. Returning original text.");
//       return text;
//     }
//   } catch (err) {
//     console.error("GPT translation error:", err);
//     return text; // fallback
//   }
// }


import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini Client.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

// Initialize the Gemini Client by explicitly passing the API key
const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); 
// --- MODIFIED CODE END ---

/**
 * Translates text using the Gemini API.
 * @param text The text to translate.
 * @param targetLang The target language code ("es" for Spanish, "en" for English).
 * @returns A Promise resolving to the translated string, or the original text on error/empty response.
 */
export async function translateText(
  text: string,
  targetLang: "es" | "en" = "es"
): Promise<string> {
  // Use a fast model like gemini-2.5-flash for translation tasks
  const model = "gemini-2.5-flash"; 
  const systemInstruction = "You are a helpful and precise translator. Your response must contain ONLY the translated text, with no extra commentary, explanations, or quotes.";
  const userPrompt = `Translate this to ${targetLang}: "${text}"`;

  try {
    const response = await client.models.generateContent({
      model: model,
      
      // The user's message is passed in the contents array
      contents: [
        { role: "user", parts: [{ text: userPrompt }] }
      ],
      
      config: {
        // The system instruction is passed in the config
        systemInstruction: systemInstruction,
        // Lower temperature for consistent, factual tasks like translation
        temperature: 0.1, 
      },
    });

    // The response text is the model's output
    const message = response.text;

    if (message) {
      return message.trim();
    } else {
      console.warn("Gemini translation returned no message. Returning original text.");
      return text;
    }
  } catch (err) {
    console.error("Gemini translation error:", err);
    return text; // fallback
  }
}