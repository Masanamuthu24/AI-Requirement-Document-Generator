// import OpenAI from "openai";
// import { StructuredRequirements, StructuredRequirementsSchema } from "./types.js";
// import { GoogleGenAI } from "@google/genai";

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export async function structureRequirements(
//   systemPrompt: string,
//   userPrompt: string
// ): Promise<StructuredRequirements> {
//   const completion = await client.chat.completions.create({
//     model: "gpt-4o-mini",         // pick a model you have access to
//     temperature: 0.2,
//     response_format: { type: "json_object" }, // ensures JSON
//     messages: [
//       { role: "system", content: systemPrompt },
//       { role: "user", content: userPrompt }
//     ]
//   });

//   const json = completion.choices[0]?.message?.content ?? "{}";
//   return JSON.parse(json) as StructuredRequirements;
// }


// llm.ts

import { GoogleGenAI } from "@google/genai";
import { StructuredRequirements, StructuredRequirementsSchema } from "./types.js";

// --- MODIFIED CODE START ---
// Get the API key from a module/local constant, or another source
// NOTE: For production, using environment variables is still the safest practice.
// If you must explicitly set it, define a local variable like this:
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

// Initialize the Gemini Client by explicitly passing the API key
const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); 
// --- MODIFIED CODE END ---

/**
 * Generates a structured requirements document using the Gemini API.
 * ... (rest of the JSDoc)
 */
export async function structureRequirements(
  systemInstruction: string,
  userPrompt: string
): Promise<StructuredRequirements> {
  
  // ... (rest of the function remains the same)
  const model = "gemini-2.5-flash"; 

  const response = await client.models.generateContent({
    model: model,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: StructuredRequirementsSchema, 
      temperature: 0.2, 
    },
  });

  const jsonString = response.text ?? "{}";
  return JSON.parse(jsonString) as StructuredRequirements;
}