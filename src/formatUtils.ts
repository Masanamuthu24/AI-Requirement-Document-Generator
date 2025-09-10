import { StructuredRequirements } from "./types.js";

export function buildTOC(data: StructuredRequirements, lang: string): string[] {
  const toc: string[] = [];
  let sectionIndex = 1;

  // Overview + Sections
  (data.sections || []).forEach((section) => {
    // Section heading (1, 2, 3 ...)
    toc.push(`${sectionIndex}. ${section.heading}`);

    // Subheadings (1.1, 1.2, etc.)
    let subIndex = 1;
    (section.subheadings || []).forEach((sub) => {
      toc.push(`   ${sectionIndex}.${subIndex} ${sub.title}`);
      subIndex++;
    });

    sectionIndex++;
  });

  // Table of Figures
  if (data.figures && data.figures.length > 0) {
    toc.push(`${sectionIndex}. ${lang === "es" ? "Tabla de figuras" : "Table of Figures"}`);
    sectionIndex++;
  }

  // Assumptions
  if (data.assumptions && data.assumptions.length > 0) {
    toc.push(`${sectionIndex}. ${lang === "es" ? "Suposiciones" : "Assumptions"}`);
    sectionIndex++;
  }

  // Out of Scope
  if (data.outOfScope && data.outOfScope.length > 0) {
    toc.push(`${sectionIndex}. ${lang === "es" ? "Fuera de alcance" : "Out of Scope"}`);
    sectionIndex++;
  }

  return toc;
}
