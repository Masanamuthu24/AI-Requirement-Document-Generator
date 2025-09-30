import { z } from "zod";
import { Type } from "@google/genai";

export const GenerateDocSchema = z.object({
  requirementsText: z.string().min(1, "requirementsText is required"),
  format: z.enum(["docx", "pdf", "md"]).default("docx"),
  style: z.enum(["corporate", "minimal"]).default("corporate"),
  language: z.enum(["en", "es"]).default("en")
});

export type GenerateDocInput = z.infer<typeof GenerateDocSchema>;

/** Structured shape the LLM must produce */
export type StructuredRequirements = {
  title: string;
  assumptions: string[];
  outOfScope: string[];
  sections: Array<{
    heading: string;
    subheadings?: Array<{
      title: string;
      bullets?: string[];
    }>;
    bullets?: string[];
  }>;
  figures?: Array<{ caption: string }>;
};

export const StructuredRequirementsSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A strong, descriptive title for the requirements document."
    },
    assumptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of assumptions made about the project or environment."
    },
    outOfScope: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of items explicitly not part of the current project scope."
    },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          heading: { type: Type.STRING },
          subheadings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["title"],
            },
            description: "Optional list of subheadings within this main section."
          },
          bullets: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of core requirement points or details for this section/heading."
          },
        },
        required: ["heading"],
      },
      description: "The core, logically organized sections of the requirements document."
    },
    figures: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          caption: { type: Type.STRING },
        },
        required: ["caption"],
      },
      description: "List of figure captions if relevant (no actual images, just captions)."
    },
  },
  required: ["title", "assumptions", "outOfScope", "sections"],
};