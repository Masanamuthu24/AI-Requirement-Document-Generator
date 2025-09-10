import fs from "node:fs";
import path from "node:path";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  TableOfContents,
  NumberFormat,
} from "docx";
import { StructuredRequirements } from "./types.js";
import { buildTOC } from "./formatUtils.js";

export async function generateDocx(
  data: StructuredRequirements,
  style: "corporate" | "minimal" = "corporate",
  lang: "en" | "es" = "en",
  outDir = "out"
): Promise<string> {
  fs.mkdirSync(outDir, { recursive: true });

  // Elegant font sizes (Times New Roman standard)
  const heading1Size = style === "corporate" ? 32 : 28;
  const heading2Size = style === "corporate" ? 26 : 22;
  const normalSize = 22; // ≈ 11pt font

  const children: Paragraph[] = [];

  //  Title Page
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: lang === "es"
            ? "Documento de requisitos del chatbot de IA"
            : data.title || "AI Chatbot Requirement Document",
          bold: true,
          size: 48, // 24pt
          font: "Times New Roman",
        }),
      ],
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 },
    })
  );

  //  TOC Section
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: lang === "es"
            ? "Tabla de contenido"
            : "Table of Contents",
          bold: true,
          size: 28,
          font: "Times New Roman",
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 200 },
    })
  );

  // Fallback TOC
  const tocItems = buildTOC(data, lang);
  tocItems.forEach((item) =>
    children.push(
      new Paragraph({
        text: item,
        spacing: { before: 120, after: 120 },
      })
    )
  );

  //  Table of Figures
  if (data.figures && data.figures.length > 0) {
    children.push(
      new Paragraph({
        text: lang === "es"
          ? "Tabla de figuras"
          : "Table of Figures",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 },
      })
    );
    data.figures.forEach((f, i) => {
      children.push(
        new Paragraph({
          text: `${i + 1}. ${f.caption}`,
          spacing: { before: 100, after: 100 },
        })
      );
    });
  }

  //  Sections
  for (const section of data.sections || []) {
    children.push(
      new Paragraph({
        text: section.heading,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    (section.bullets || []).forEach((b) =>
      children.push(
        new Paragraph({
          text: b,
          numbering: { reference: "bullet-points", level: 0 },
          spacing: { before: 100, after: 100 },
        })
      )
    );

    (section.subheadings || []).forEach((sub) => {
      children.push(
        new Paragraph({
          text: sub.title,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );

      (sub.bullets || []).forEach((b) =>
        children.push(
          new Paragraph({
            text: b,
            numbering: { reference: "bullet-points", level: 1 },
            spacing: { before: 80, after: 80 },
          })
        )
      );
    });
  }

  //  Assumptions
  if (data.assumptions && data.assumptions.length > 0) {
    children.push(
      new Paragraph({
        text: lang === "es"
          ? "Suposiciones"
          : "Assumptions",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );
    data.assumptions.forEach((a) =>
      children.push(
        new Paragraph({
          text: a,
          numbering: { reference: "bullet-points", level: 0 },
          spacing: { before: 100, after: 100 },
        })
      )
    );
  }

  //  Out of Scope
  if (data.outOfScope && data.outOfScope.length > 0) {
    children.push(
      new Paragraph({
        text: lang === "es"
          ? "Fuera de alcance"
          : "Out of Scope",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );
    data.outOfScope.forEach((o) =>
      children.push(
        new Paragraph({
          text: o,
          numbering: { reference: "bullet-points", level: 0 },
          spacing: { before: 100, after: 100 },
        })
      )
    );
  }

  //  Build DOC with Times New Roman
  const doc = new Document({
    sections: [{ children }],
    numbering: {
      config: [
        {
          reference: "bullet-points",
          levels: [
            {
              level: 0,
              format: NumberFormat.BULLET,
              text: "•",
              alignment: "left",
              style: { paragraph: { indent: { left: 720, hanging: 360 } } }
            },
            {
              level: 1,
              format: NumberFormat.BULLET,
              text: "•",
              alignment: "left",
              style: { paragraph: { indent: { left: 1440, hanging: 360 } } }
            },
          ],
        },
      ],
    },
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: { size: normalSize, font: "Times New Roman" },
          paragraph: { spacing: { line: 276 } }, // 1.15 line spacing
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { bold: true, size: heading1Size, font: "Times New Roman" },
          paragraph: { spacing: { before: 300, after: 150 } },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { bold: true, size: heading2Size, font: "Times New Roman" },
          paragraph: { spacing: { before: 200, after: 120 } },
        },
      ],
    },
  });

  const fileName = `Requirements_${Date.now()}.docx`;
  const filePath = path.join(outDir, fileName);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}
