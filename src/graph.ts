import { generateDocx } from "./docx.js";
import { StructuredRequirements } from "./types.js";

/**
 * This function simulates your LangGraph workflow.
 * For now, it will:
 * 1. Accept raw requirements text (string)
 * 2. Convert it into a structured format (mock for now)
 * 3. Call generateDocx() and return the file path
 */
export async function runWorkflow(requirementsText: string): Promise<string> {
  // TODO: Replace this mock with real LangGraph + LLM pipeline
  const structuredData: StructuredRequirements = {
    title: "AI Chatbot Requirement Document",
    figures: [],
    sections: [
      {
        heading: "Overview",
        bullets: [requirementsText] // Just put raw text for now
      }
    ],
    assumptions: ["This is a demo assumption."],
    outOfScope: ["This is a demo out-of-scope item."]
  };

  // Generate DOCX
  const filePath = await generateDocx(structuredData);
  return filePath;
}
