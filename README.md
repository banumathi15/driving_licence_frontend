# Driving Licence AI — Frontend

## 1. Project Overview

The Driving Licence AI frontend is a web application that allows users to upload driving licence documents, review extracted information, edit fields, preview the uploaded document, and ask questions about its contents.

The frontend communicates with a Node.js/Express backend for document processing, OCR, field extraction, and document question answering.

## 2. Technology Stack

React — Component-based UI development.

TypeScript — Type safety and improved maintainability.

Vite — Development server and build tooling.

Tailwind CSS — Responsive UI styling.

React Hook Form — Form state management and validation integration.

Zod — Schema-based validation.

Axios — HTTP requests to backend APIs.

## 3. Architecture

The frontend follows a component-based architecture.

Frontend
├── React + TypeScript
├── UI Components
│ ├── Document Upload
│ ├── PDF/Image Preview
│ ├── Extracted Fields Form
│ └── Document Q&A Chat
├── Form Validation
│ ├── React Hook Form
│ └── Zod
└── API Communication
└── Axios
|
v
Express Backend

Application Flow

The user uploads a PDF or supported image.

The frontend sends the file to the backend.

The backend processes the document and returns extracted information.

The frontend displays the extracted fields in an editable form.

The user reviews and corrects the extracted information.

The user saves the reviewed fields through the backend API.

The user can ask questions about the document through the chat interface.

## 4. Setup and Run Instructions

Prerequisites

Node.js and npm installed.

The backend server running locally.

Installation

Navigate to the frontend directory:

cd frontend
npm install

Create a .env file in the frontend root directory:

VITE_API_URL=http://localhost:4000/api

Start the Development Server

npm run dev

Open the local URL displayed by Vite, usually:

http://localhost:5173

Production Build

npm run build

To preview the production build locally:

npm run preview

## 5. AI/LLM Approach

The frontend does not directly call the LLM provider. It communicates with the backend, which handles document extraction and AI-related operations.

The frontend supports two processing modes exposed by the backend:

Demo fallback mode: Displays fields extracted using backend rule-based logic, without requiring an OpenAI API key.

LLM mode: Displays structured field extraction returned by the backend when a valid API key and working API access are configured.

The frontend allows users to review and edit extracted values because automatic extraction can produce incorrect or incomplete results.

## 6. Key Technical Decisions

React with TypeScript: Improves component organization and catches many type-related errors during development.

Vite: Provides fast local development and production builds.

Tailwind CSS: Enables consistent styling and responsive layouts.

React Hook Form: Simplifies form state management and field updates.

Zod: Supports validation of user-entered field values.

Axios: Centralizes HTTP communication with the backend.

Environment variables: Keep the backend URL configurable across environments.

Backend-mediated AI calls: Prevents the frontend from exposing the OpenAI API key.

Editable extracted data: Allows users to correct OCR and extraction errors before saving.

## 7. Known Limitations

Extraction accuracy depends on document quality and backend processing.

Scanned, rotated, blurry, or low-resolution documents may produce inaccurate text.

Demo fallback extraction uses pattern matching and may not recognize every document layout or date format.

AI-based extraction and document Q&A may require a valid API key and available API credits.

The frontend depends on the backend being available.

Client-side validation does not replace backend validation.

The application should not be considered an official licence verification system.

## 8. AI Development Tools Used

The following tools may be used during development. Confirm the tools actually used for this submission before finalizing this list.

ChatGPT: Assistance with implementation planning, debugging, code explanations, and documentation.

Vite: Frontend development and build tooling.

Visual Studio Code: Code editing and debugging.

## 9. Security Considerations

Do not store the OpenAI API key in the frontend environment.

Do not expose secrets through VITE\_ environment variables.

Validate user input and handle API errors safely.

Avoid logging sensitive licence information in production.

Use HTTPS when deploying the application.
