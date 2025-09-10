import { generateDocx } from "./docx.js";
import { generatePdf } from "./pdf.js";
import { generateMarkdown } from "./markdown.js";
import { StructuredRequirements, GenerateDocInput } from "./types.js";
import { translateText } from "./translate.js";

/**
 * This function simulates your LangGraph workflow.
 * For now, it will:
 * 1. Accept parsed input (requirementsText, format, style, language)
 * 2. Convert it into a structured format (mock for now)
 * 3. Call the correct generator and return the file path
 */
export async function runWorkflow(input: GenerateDocInput): Promise<string> {
  // TODO: Replace this mock with real LangGraph + LLM pipeline
  const structuredData: StructuredRequirements = {
    title:
      input.language === "es"
        ? "Documento de requisitos del chatbot de IA"
        : "AI Chatbot Requirement Document",

    figures: [
      {
        caption:
          input.language === "es"
            ? "Diagrama de arquitectura del sistema"
            : "System Architecture Diagram",
      },
      {
        caption:
          input.language === "es"
            ? "Diagrama de flujo de un chatbot"
            : "Chatbot Flowchart",
      },
    ],

    sections: [
      {
        heading: input.language == "es" ? "Descripción general" : "Overview",
        bullets: [
          input.language == "es"
          ?
            // ? await translateText(
            //   input.requirementsText,
            //   "es"
            // )
            "El chatbot debe responder consultas de clientes, brindar soporte en preguntas frecuentes y escalar a agentes humanos cuando sea necesario."
            : input.requirementsText
        ],
      },
      {
        heading:
          input.language == "es" ? "Requisitos funcionales" : "Functional Requirements",
        subheadings: [
          {
            title: input.language == "es" ? "Consultas de usuario" : "User Queries",
            bullets: [
              input.language == "es"
                ? "El sistema debe gestionar tanto la entrada de texto como la de voz."
                : "System must handle both text and voice input.",
              input.language == "es"
                ? "Admite conversaciones en varios idiomas (inglés, español)."
                : "Support multi-language conversations (English, Spanish).",
              input.language == "es"
                ? "Permitir a los usuarios solicitar detalles de la cuenta, estado del pedido y preguntas frecuentes generales."
                : "Allow users to request account details, order status, and general FAQs.",
            ],
          },
          {
            title: input.language == "es" ? "Escalada" : "Escalation",
            bullets: [
              input.language == "es"
                ? "Las consultas no resueltas o complejas deben escalarse a un agente de soporte en vivo."
                : "Unresolved or complex queries must be escalated to a live support agent.",
              input.language == "es"
                ? "Los usuarios deben recibir un número de ticket cuando se escala."
                : "Users must receive a ticket number when escalated.",
            ],
          },
          {
            title: input.language == "es" ? "Integración" : "Integration",
            bullets: [
              input.language == "es"
                ? "El sistema debe integrarse con los sistemas CRM y Helpdesk (por ejemplo, Salesforce, Zendesk)."
                : "System must integrate with CRM and Helpdesk systems (e.g., Salesforce, Zendesk).",
              input.language == "es"
                ? "El chatbot debe obtener datos en tiempo real (estado del pedido, actualizaciones de entrega)."
                : "Chatbot should fetch real-time data (order status, delivery updates).",
            ],
          },
        ],
      },
      {
        heading:
          input.language == "es" ? "Requisitos no funcionales" : "Non-Functional Requirements",
        bullets: [
          input.language == "es"
            ? "El tiempo de actividad del sistema debe ser del 99,9%."
            : "System uptime must be 99.9%.",
          input.language == "es"
            ? "El tiempo de respuesta promedio debe ser inferior a 2 segundos."
            : "Average response time must be under 2 seconds.",
          input.language == "es"
            ? "El chatbot debe cumplir con el RGPD y las regulaciones locales de privacidad de datos."
            : "The chatbot must comply with GDPR and local data privacy regulations.",
          input.language == "es"
            ? "El sistema debe manejar al menos 10.000 sesiones simultáneas."
            : "System should handle at least 10,000 concurrent sessions.",
        ],
      },
    ],

    assumptions: [
      input.language == "es"
        ? 
          "Los usuarios tendrán conexiones a Internet estables para interactuar con el chatbot."
        : "Users will have stable internet connections to interact with the chatbot.",
      input.language == "es"
        ? "La empresa proporciona API para la integración con sistemas backend."
        : "The company provides APIs for integration with backend systems.",
    ],

    outOfScope: [
      input.language == "es"
        ? "El chatbot no gestionará pagos ni transacciones financieras directamente."
        : "The chatbot will not handle payments or financial transactions directly.",
      input.language == "es"
        ? "El soporte para idiomas poco comunes además del inglés y el español está excluido en la versión inicial."
        : "Support for rare languages beyond English and Spanish is excluded in the initial release.",
    ],
  };

  if (input.format == "docx") {
    return await generateDocx(structuredData, input.style, input.language);
  } else if (input.format == "pdf") {
    return await generatePdf(structuredData, input.style, input.language);
  } else {
    return await generateMarkdown(structuredData, input.style, input.language);
  }
}
