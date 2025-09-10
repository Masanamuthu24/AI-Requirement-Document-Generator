import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function translateText(
  text: string,
  targetLang: "es" | "en" = "es"
): Promise<string> {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful translator." },
        { role: "user", content: `Translate this to ${targetLang}: "${text}"` },
      ],
    });

    // Safe access with null checks
    const choice = res.choices?.[0];
    const message = choice?.message?.content;

    if (message) {
      return message.trim();
    } else {
      console.warn("GPT translation returned no message. Returning original text.");
      return text;
    }
  } catch (err) {
    console.error("GPT translation error:", err);
    return text; // fallback
  }
}
