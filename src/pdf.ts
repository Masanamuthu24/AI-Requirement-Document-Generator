import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { StructuredRequirements } from "./types.js";
import { buildTOC } from "./formatUtils.js";


export async function generatePdf(
  data: StructuredRequirements,
  style: "corporate" | "minimal" = "corporate",
  lang: "en" | "es" = "en",
  outDir = "out"
): Promise<string> {
  fs.mkdirSync(outDir, { recursive: true });

  const fileName = `Requirements_${Date.now()}.pdf`;
  const filePath = path.join(outDir, fileName);

  // ✅ Style settings
  const heading1Size = style === "corporate" ? 18 : 16;
  const heading2Size = style === "corporate" ? 14 : 12;
  const normalSize = style === "corporate" ? 12 : 10;
  const bulletIndent = style === "corporate" ? 20 : 15;
  const subBulletIndent = style === "corporate" ? 40 : 30;

  // Create PDF
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  // Set default font
  doc.font("Times-Roman");

  // ✅ Title Page
  doc.fontSize(24).font("Times-Bold").text(
    lang === "es"
      ? "Documento de requisitos del chatbot de IA"
      : data.title || "AI Chatbot Requirement Document",
    { align: "center" }
  );
  doc.moveDown(2);

  // ✅ Table of Contents
  doc.fontSize(heading1Size).font("Times-Bold").text(
    lang === "es"
      ? "Tabla de contenido"
      : "Table of Contents"
  );
  doc.moveDown(0.5);

  const toc = buildTOC(data,lang);
  toc.forEach((item) => {
    doc.fontSize(normalSize).font("Times-Roman").text(item, { indent: bulletIndent });
  });
  doc.moveDown(1);

  // ✅ Table of Figures
  if (data.figures && data.figures.length > 0) {
    doc.fontSize(heading1Size).font("Times-Bold").text(
      lang === "es" ? "Tabla de figuras" : "Table of Figures"
    );
    doc.moveDown(0.5);
    data.figures.forEach((fig, idx) => {
      doc.fontSize(normalSize).font("Times-Roman").text(`${idx + 1}. ${fig.caption}`, {
        indent: bulletIndent,
      });
    });
    doc.moveDown(1);
  }

  // ✅ Sections
  data.sections.forEach((section) => {
    doc.fontSize(heading1Size).font("Times-Bold").text(section.heading);
    doc.moveDown(0.5);

    (section.bullets || []).forEach((b) => {
      doc.fontSize(normalSize).font("Times-Roman").text(`• ${b}`, { indent: bulletIndent });
    });

    (section.subheadings || []).forEach((sub) => {
      doc.moveDown(0.3);
      doc.fontSize(heading2Size).font("Times-Bold").text(sub.title, { indent: subBulletIndent });
      (sub.bullets || []).forEach((b) => {
        doc
          .fontSize(normalSize)
          .font("Times-Roman")
          .text(`• ${b}`, { indent: subBulletIndent + bulletIndent });
      });
    });

    doc.moveDown(1);
  });

  // ✅ Assumptions
  if (data.assumptions && data.assumptions.length > 0) {
    doc.fontSize(heading1Size).font("Times-Bold").text(
      lang === "es" ? "Suposiciones" : "Assumptions"
    );
    doc.moveDown(0.5);
    data.assumptions.forEach((a) => {
      doc.fontSize(normalSize).font("Times-Roman").text(`• ${a}`, { indent: bulletIndent });
    });
    doc.moveDown(1);
  }

  // ✅ Out of Scope
  if (data.outOfScope && data.outOfScope.length > 0) {
    doc.fontSize(heading1Size).font("Times-Bold").text(
      lang === "es" ? "Fuera de alcance" : "Out of Scope"
    );
    doc.moveDown(0.5);
    data.outOfScope.forEach((o) => {
      doc.fontSize(normalSize).font("Times-Roman").text(`• ${o}`, { indent: bulletIndent });
    });
  }

  doc.end();
  return filePath;
}
