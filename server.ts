import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import * as dotenv from "dotenv";

// Load .env so keys are never hardcoded in source
dotenv.config();

const NVIDIA_KEY = process.env.NVIDIA_API_KEY || "";

const ai = new OpenAI({
  apiKey: NVIDIA_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

/* ── fallback when AI is unavailable ── */
const FALLBACK = {
  recommendedSolution:
    "A custom web platform tailored to your business needs with modern architecture and scalable infrastructure.",
  features: [
    "User Authentication & Role Management",
    "Admin Dashboard & Analytics",
    "Real-time Notifications",
    "Payment Gateway Integration",
    "Reports & Data Export",
    "REST API & Third-party Integrations",
    "Mobile-responsive UI",
    "Audit Logs & Compliance",
  ],
  complexity: "Medium",
  timeline: "14-18 weeks",
  investmentRange: "₹20-35L",
  team: [
    "Project Manager / Scrum Master",
    "Senior UI/UX Designer",
    "Senior Full-Stack Developer",
    "Backend Developer",
    "QA Engineer",
  ],
  costBreakdown: [
    { category: "UI/UX Design & Prototyping", amount: 15 },
    { category: "Frontend Development", amount: 30 },
    { category: "Backend & API Development", amount: 30 },
    { category: "QA & Testing", amount: 12 },
    { category: "DevOps & Cloud Setup", amount: 8 },
    { category: "Project Management", amount: 5 },
  ],
  timelinePhases: [
    { phase: "Discovery & Planning", weeks: 2 },
    { phase: "UI/UX Design", weeks: 3 },
    { phase: "Frontend Development", weeks: 5 },
    { phase: "Backend & API Development", weeks: 5 },
    { phase: "QA & Testing", weeks: 2 },
    { phase: "Deployment & Handover", weeks: 1 },
  ],
};

/** Race a promise against a timeout */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
    ),
  ]);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/generate-summary", async (req, res) => {
    if (!NVIDIA_KEY) {
      console.warn("No NVIDIA_API_KEY — returning fallback data");
      return res.json(FALLBACK);
    }

    try {
      const { data } = req.body;

      const prompt = `You are an expert software architect and project estimator at OpenXcell.
Based on the following project assessment input, generate a detailed project summary as strictly valid JSON.

Input:
${JSON.stringify(data, null, 2)}

Return ONLY a JSON object with this exact schema (no markdown, no code fences):
{
  "recommendedSolution": "2-3 sentence technical solution description",
  "features": ["8-10 specific feature descriptions based on the project"],
  "complexity": "Low | Medium | High",
  "timeline": "e.g. 12-16 weeks",
  "investmentRange": "e.g. ₹18-30L",
  "team": ["5-7 role titles tailored to the project"],
  "costBreakdown": [
    { "category": "category name", "amount": number_percentage }
  ],
  "timelinePhases": [
    { "phase": "phase name", "weeks": number }
  ]
}`;

      const aiCall = ai.chat.completions.create({
        model: "meta/llama-3.3-70b-instruct",
        messages: [
          {
            role: "system",
            content: "You output only valid JSON. No markdown. No code blocks.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 3000,
        stream: false,
      });

      // 45-second server-side timeout
      const completion = await withTimeout(aiCall, 45000);

      let content = completion.choices[0]?.message?.content?.trim() || "";

      // Strip markdown code fences if model ignores instructions
      content = content
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const summaryData = JSON.parse(content);
      return res.json(summaryData);
    } catch (error) {
      console.error("AI generation error — returning fallback:", error);
      return res.json(FALLBACK);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
