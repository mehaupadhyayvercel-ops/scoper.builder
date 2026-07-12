import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const NVIDIA_KEY = process.env.NVIDIA_API_KEY || "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";

const ai = new OpenAI({
  apiKey: NVIDIA_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

/* ── fallback when AI is unavailable ── */
const FALLBACK = {
  recommendedSolution:
    "A custom web platform tailored to your business needs with modern architecture and scalable infrastructure.",
  whyThisRecommendation:
    "This approach provides the most flexibility for your unique requirements while ensuring long-term scalability and security.",
  features: [
    "User Authentication & Role Management",
    "Admin Dashboard & Analytics",
    "Real-time Notifications",
    "Payment Gateway Integration",
    "REST API & Third-party Integrations",
  ],
  complexity: {
    level: "Medium",
    meaning: "This means your project involves standard integrations and multiple user roles, requiring a balanced approach to architecture and testing."
  },
  timeline: "14-18 weeks",
  investmentRange: "₹20-35L",
  team: [
    { role: "Project Manager", reason: "To ensure smooth communication and delivery." },
    { role: "UI/UX Designer", reason: "To create an intuitive and engaging user experience." },
    { role: "Full-Stack Developer", reason: "To build both the frontend interfaces and backend logic." },
    { role: "QA Engineer", reason: "To thoroughly test the application for bugs and usability." },
  ]
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

    const prompt = `You are an expert software consultant at OpenXcell.
Based on the following project assessment input, generate a highly personalized project summary consulting brief as strictly valid JSON.

Input:
${JSON.stringify(data, null, 2)}

Instructions:
1. Analyze the 'business', 'projectDescription', 'projectTypes', 'endUsers', and 'preferences' thoroughly.
2. Recommended Solution: What OpenXcell recommends in plain terms.
3. Why This Recommendation: Plain-language reasoning for why this solution fits.
4. Suggested Features: Only list features that are highly relevant to this specific project.
5. Estimated Timeline: Provide a realistic range based on their input.
6. Estimated Investment: Provide a realistic cost range aligning with their budget preference.
7. Suggested Delivery Team: List necessary roles and ONE line on why each is needed.
8. Project Complexity: A label (Low, Medium, High) plus what that actually means for the user's project.

Return ONLY a JSON object with this exact schema (no markdown, no code fences):
{
  "recommendedSolution": "string",
  "whyThisRecommendation": "string",
  "features": ["string", "string"],
  "timeline": "string",
  "investmentRange": "string",
  "team": [
    { "role": "string", "reason": "string" }
  ],
  "complexity": {
    "level": "string",
    "meaning": "string"
  }
}`;

    const aiCall = ai.chat.completions.create({
      model: "z-ai/glm-5.2",
      messages: [
        {
          role: "system",
          content: "You output only valid JSON. No markdown. No code blocks.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 1,
      top_p: 0.95,
      max_tokens: 3000,
      stream: false
    });

    // Vercel max timeout is 60s, so we time out at 55s to gracefully return fallback if needed
    const completion = await withTimeout(aiCall, 55000);

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
