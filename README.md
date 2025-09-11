# AI Requirement Document Generator

  This project is a *Node.js + Express + OpenAI* based service that converts *raw requirement text* into a structured *Requirement Specification Document (.docx)*.
  
  ---

## Features
  - Accepts plain text requirements via API  
  - Uses AI to structure into sections, assumptions, and out-of-scope items  
  - Automatically generates a *.docx file*  
  - Exposes a *download URL* for the generated file  
  - Lightweight and easy to deploy  
  
  ---

## Setup

  ### 1. Clone Repository
  
    git clone https://github.com/Masanamuthu24/AI-Requirement-Document-Generator.git
    cd AI-Requirement-Document-Generator
  
  ### 2. Install Dependencies
  
    npm install
  
  ### 3. Configure Environment Variables
  
    Create a .env file in the root folder and put the below variables in the same file (API Key will be shared via email):
    
    OPENAI_API_KEY=your-openai-api-key
    PORT=3000
    BASE_URL=http://localhost:3000
  
  ### 4. Run in Development
  
    npm run dev
    
    Server will be available at:  http://localhost:3000
    
    API Usage Endpoint  : POST /generate-doc
    Request Body :
     {
      "requirementsText": "The chatbot should answer customer queries, support FAQs, and escalate to human agents when needed.",
      "format": "docx", 
      "style": "corporate", 
      "language": "en"
     }

    Example Response json :
      {
        "ok": true,
        "message": "Requirement document generated successfully.",
        "downloadUrl": "http://localhost:3000/downloads/Requirements_1725600000000.docx"
      }
      
    Use the downloadUrl to fetch the generated document as shown below.
<img width="829" height="475" alt="image" src="https://github.com/user-attachments/assets/cc139fc8-49fd-4a96-9494-3c504bd97815" />

<img width="1209" height="689" alt="image" src="https://github.com/user-attachments/assets/1aab5894-5d7f-481f-a425-45215c872c08" />

  
  ## Project Structure
  
    src/
    ├─ server.ts        # Express API entry point
    ├─ graph.ts         # Workflow orchestration
    ├─ docx.ts          # DOCX generation logic
    ├─ markdown.ts      # MD generation logic
    ├─ pdf.ts           # PDF generation logic
    ├─ llm.ts           # OpenAI helper functions
    ├─ translate.ts     # Translate the content based on user language selection
    ├─ formatUtils.ts   # To ensure the formats on across different formats
    ├─ prompt.ts        # AI prompt templates
    ├─ preprocess.ts    # Input cleaning
    ├─ types.ts         # Types & validation schemas
    out/ – contains generated .docx files
  
    Tech Stack
    
       Node.js + TypeScript
  
       Express.js
  
       OpenAI API
  
       LangGraph
  
       docx (Word generation)
  
       Zod (schema validation)
