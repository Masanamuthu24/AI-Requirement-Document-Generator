import { generateDocx } from "./docx.js";
import { generatePdf } from "./pdf.js";
import { generateMarkdown } from "./markdown.js";
import { StructuredRequirements, GenerateDocInput } from "./types.js";
import { translateText } from "./translate.js";

// import your llm helpers
import { structureRequirements } from "./llm.js";
import { SYSTEM_PROMPT, userPromptFor, } from "./prompt.js";

export async function runWorkflow(input: GenerateDocInput): Promise<string> {
  // Call LLM to structure requirements
  const userPrompt = userPromptFor([input.requirementsText]);
  let structuredData: StructuredRequirements = await structureRequirements(
    SYSTEM_PROMPT,
    userPrompt
  );

  // translate fields if language is not English
  if (input.language === "es") {
    structuredData.title = await translateText(structuredData.title, "es");

    structuredData.assumptions = await Promise.all(
      structuredData.assumptions.map((a) => translateText(a, "es"))
    );

    structuredData.outOfScope = await Promise.all(
      structuredData.outOfScope.map((o) => translateText(o, "es"))
    );

    structuredData.sections = await Promise.all(
      structuredData.sections.map(async (sec) => {
        const heading = await translateText(sec.heading, "es");
        const bullets = sec.bullets
          ? await Promise.all(sec.bullets.map((b) => translateText(b, "es")))
          : undefined;

        const subheadings = sec.subheadings
          ? await Promise.all(
            sec.subheadings.map(async (sh) => ({
              title: await translateText(sh.title, "es"),
              bullets: sh.bullets
                ? await Promise.all(
                  sh.bullets.map((b) => translateText(b, "es"))
                )
                : undefined,
            }))
          )
          : undefined;

        return { heading, bullets, subheadings };
      })
    );

    if (structuredData.figures) {
      structuredData.figures = await Promise.all(
        structuredData.figures.map(async (f) => ({
          caption: await translateText(f.caption, "es"),
        }))
      );
    }
  }

  // Generate file in requested format
  if (input.format === "docx") {
    return await generateDocx(structuredData, input.style, input.language);
  } else if (input.format === "pdf") {
    return await generatePdf(structuredData, input.style, input.language);
  } else {
    return await generateMarkdown(structuredData, input.style, input.language);
  }
}
