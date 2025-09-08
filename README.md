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
  
    git clone https://github.com/your-username/ai-reqdoc-bot.git
    cd ai-reqdoc-bot
  
  ### 2. Install Dependencies
  
    npm install
  
  ### 3. Configure Environment Variables
  
    Create a .env file in the root folder:
    
    OPENAI_API_KEY=your-openai-api-key
    PORT=3000
    BASE_URL=http://localhost:3000
  
  ### 4. Run in Development
  
    npm run dev
    
    Server will be available at:
    
    http://localhost:3000
    
    API Usage Endpoint
    
    POST /generate-doc
    Request Body
    json
    {
      "requirementsText": "The chatbot must support English and Spanish. It should integrate with CRM. It must be available 24/7. Assumptions: Users have internet access."
    }
    Example Response
    json
    
      {
        "ok": true,
        "message": "Requirement document generated successfully.",
        "downloadUrl": "http://localhost:3000/downloads/Requirements_1725600000000.docx"
      }
    Use the downloadUrl to fetch the generated document.
  
  ## Project Structure
  
    src/
    ├─ server.ts        # Express API entry point
    ├─ graph.ts         # Workflow orchestration
    ├─ docx.ts          # DOCX generation logic
    ├─ llm.ts           # OpenAI helper functions
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
