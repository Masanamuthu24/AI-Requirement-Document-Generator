import fs from "fs";
import path from "path";
import { StructuredRequirements } from "./types.js";
import { buildTOC } from "./formatUtils.js";

export async function generateMarkdown(
  data: StructuredRequirements,
  style: "corporate" | "minimal" = "corporate",
  lang: "en" | "es" = "en",
  outDir = "out"
): Promise<string> {
  fs.mkdirSync(outDir, { recursive: true });

  const fileName = `Requirements_${Date.now()}.md`;
  const filePath = path.join(outDir, fileName);

  // ✅ Heading prefix based on style
  const h1 = style === "corporate" ? "# " : "# ";
  const h2 = style === "corporate" ? "## " : "## ";
  const h3 = style === "corporate" ? "### " : "### ";
  const bullet = style === "corporate" ? "- " : "* ";

  let md = `${h1}${lang === "es"
    ? "Documento de requisitos del chatbot de IA"
    : data.title || "AI Chatbot Requirement Document"}\n\n`;

  // ✅ Table of Contents
  md += `${h2}${lang === "es"
    ? "Tabla de contenido"
    : "Table of Contents"}\n\n`;

  const toc = buildTOC(data, lang);
  toc.forEach((item) => {
    if (/^\d+\.\d+/.test(item)) {
      // Subsections like 2.1, 2.2
      md += `   ${item}\n`;
    } else {
      md += `${item}\n`;
    }
  });
  md += `\n---\n`;

  // ✅ Table of Figures
  if (data.figures && data.figures.length > 0) {
    md += `\n${h2}${lang === "es"
      ? "Tabla de figuras"
      : "Table of Figures"}\n\n`;
    data.figures.forEach((f, i) => {
      md += `${i + 1}. ${f.caption}\n`;
    });
    md += `\n`;
  }

  // ✅ Sections
  (data.sections || []).forEach((s) => {
    md += `\n${h2}${s.heading}\n\n`;
    (s.bullets || []).forEach((b) => (md += `${bullet}${b}\n`));

    (s.subheadings || []).forEach((sub) => {
      md += `\n${h3}${sub.title}\n\n`;
      (sub.bullets || []).forEach((b) => (md += `${bullet}${b}\n`));
    });
  });

  // ✅ Assumptions
  if (data.assumptions && data.assumptions.length > 0) {
    md += `\n${h2}${lang === "es"
      ? "Suposiciones"
      : "Assumptions"}\n\n`;
    data.assumptions.forEach((a) => (md += `${bullet}${a}\n`));
  }

  // ✅ Out of Scope
  if (data.outOfScope && data.outOfScope.length > 0) {
    md += `\n${h2}${lang === "es"
      ? "Fuera de alcance"
      : "Out of Scope"}\n\n`;
    data.outOfScope.forEach((o) => (md += `${bullet}${o}\n`));
  }

  fs.writeFileSync(filePath, md);
  return filePath;
}
