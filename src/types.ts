import { z } from "zod";

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
