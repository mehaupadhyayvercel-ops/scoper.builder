# Scoper Builder: App Architecture & Data Flow

This document provides a concise overview of the OpenXcell AI Project Assessment Tool's architecture, user flow, API integrations, and deployment pipeline.

## 1. User Application Flow
The application is a React-based Single Page Application (SPA) structured as a multi-step consulting journey. Data is managed globally using React Context (`AppContext.tsx`).

1. **Welcome (`Welcome.tsx`):** Value proposition and journey preview.
2. **Business Info (`BusinessInfo.tsx`):** Captures lead identity (Name, Email, Company, Industry).
3. **Project Details (`ProjectDetails.tsx`):** Captures project context, dynamic end-users (based on industry), and a free-text description (with starter sentence helpers).
4. **Preferences (`Preferences.tsx`):** Captures target platforms, core capabilities, timeline, and budget.
5. **Processing (`Processing.tsx`):** The transition screen. This screen actively makes the API call to the LLM while showing the user a paced, animated progress tracker.
6. **Summary (`Summary.tsx`):** Displays the generated consulting brief (Solution, Features, Timeline, Investment, Complexity, Team) and provides a clear CTA to book a consultation.

---

## 2. API Integration (NVIDIA NIM / LLM)
The core "intelligence" of the app is powered by a large language model. 
- **Location:** The API call is triggered inside `Processing.tsx`.
- **Client:** Uses the standard `openai` npm package pointing to a custom base URL.
- **Endpoint:** `https://integrate.api.nvidia.com/v1`
- **Model:** `z-ai/glm-5.2`
- **Execution:** The app passes the aggregated JSON data from `AppContext` into a highly structured prompt. It receives a JSON string back containing the structured summary, which is then parsed and saved to the global state.

---

## 3. GitHub & Vercel Pipeline (CI/CD)
The project utilizes a modern, automated continuous deployment pipeline.

- **GitHub (Version Control):** The source code is hosted on GitHub (`mehaupadhyayvercel-ops/scoper.builder`). Developers push changes to the `main` branch.
- **Vercel (Hosting & CI/CD):** 
  - Vercel is connected directly to the GitHub repository.
  - Every time a `git push` is made to the `main` branch, Vercel automatically detects the commit.
  - Vercel runs the build process (compiling TypeScript, bundling React/Vite/Tailwind).
  - If the build is successful, it instantly deploys the new version to the live production URL.

---

## 4. Supabase (Database / Backend)
*(Pipeline integration point)*
Currently, the application manages state locally in memory via React Context. To persist this data (for lead generation and analytics), Supabase fits into the pipeline as follows:

1. **Lead Capture:** When the user clicks "Continue" on the Business Info screen, a record can be created in a Supabase `leads` table.
2. **Assessment Storage:** Once the AI finishes generating the summary in `Processing.tsx`, the final JSON summary alongside the user's inputs can be UPSERTED into a Supabase `assessments` table linked to the lead's ID.
3. **Connection:** This is typically done using the `@supabase/supabase-js` client, securely sending the payload via REST or GraphQL over HTTPS. 
