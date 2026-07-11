import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export const maxDuration = 60; // Prevent Vercel's default 10s timeout which causes 500 errors

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!NVIDIA_KEY) {
    console.warn("No NVIDIA_API_KEY — returning fallback data");
    return res.json(FALLBACK);
  }

  try {
    const { data } = req.body;

    const prompt = `You are an expert software architect and project estimator at OpenXcell.
Based on the following project assessment input, generate a highly personalized project summary as strictly valid JSON.

Input:
${JSON.stringify(data, null, 2)}

Instructions:
1. Analyze the 'business', 'projectDescription', and 'preferences' thoroughly.
2. Recommended Solution: Write a 2-3 sentence technical solution description tailored specifically to their idea and industry.
3. Features: List 8-10 specific features they will need based on their input (e.g., if healthcare, mention HIPAA compliance or patient portals).
4. Complexity: Calculate realistically based on platforms and capabilities selected (Low | Medium | High).
5. Timeline: Estimate based on their preferences and scope (e.g., 12-16 weeks).
6. Investment Range: Provide a realistic cost (e.g., ₹18-30L) aligning with their budget preference.
7. Team: List 5-7 necessary roles for this specific build.

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
      model: "meta/llama-3.1-8b-instruct", // Using a faster 8B model to stay well under Vercel's 10s limit
      messages: [
        {
          role: "system",
          content: "You output only valid JSON. No markdown. No code blocks.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 1000,
      stream: false,
    });

    // Vercel strict limit timeout (8 seconds to be safe before Vercel kills it at 10s)
    const completion = await withTimeout(aiCall, 8500);

    let content = completion.choices[0]?.message?.content?.trim() || "";

    // Strip markdown code fences if model ignores instructions
    content = content
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const summaryData = JSON.parse(content);

    // Save lead to Supabase asynchronously (we do not await it here to save time for the user, but we can await it if we want to guarantee storage)
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.SUPABASE_URL || 'https://andpelfahbjxsudpiqlo.supabase.co';
      
      // We must use env variable because GitHub blocks pushes containing hardcoded secrets
      const supabaseKey = process.env.SUPABASE_SECRET_KEY; 
      
      if (supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase.from('leads').insert({
          full_name: data.business.fullName,
          email: data.business.email,
          company_name: data.business.companyName,
          industry: data.business.industry,
          project_description: data.projectDescription,
          platforms: data.preferences.platforms || [],
          capabilities: data.preferences.capabilities || [],
          timeline_preference: data.preferences.timeline,
          budget_preference: data.preferences.budget,
          ai_summary: summaryData
        });
        console.log("✅ Lead successfully saved to Supabase.");
      } else {
        console.warn("⚠️ SUPABASE_SECRET_KEY not found in environment variables. Lead not saved.");
      }
    } catch (dbError) {
      console.error("❌ Failed to save lead to Supabase:", dbError);
    }

    return res.json(summaryData);
  } catch (error) {
    console.error("AI generation error — returning fallback:", error);
    return res.json(FALLBACK);
  }
}
