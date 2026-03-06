import { GoogleGenerativeAI } from "@google/generative-ai";
import { envVars } from "../../../config/env";

const genAI = new GoogleGenerativeAI(envVars.GEMINI_API_KEY);

/**
 * Analyze a code snippet using Google Gemini API
 * @param code - code string
 * @returns JSON array of issues
 */
export const analyzeCode = async (code: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Analyze this code and return security issues in JSON format.
If no issues, return empty array [].
Do NOT include extra text, ONLY JSON.
The JSON should be an array of objects, where each object has:
- severity: "LOW" | "MEDIUM" | "HIGH"
- message: string
- line: number (optional)

Code:
${code}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Remove markdown code blocks if present
    if (text.startsWith("```json")) {
      text = text.replace(/```json\n?/, "").replace(/\n?```/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/```\n?/, "").replace(/\n?```/, "");
    }

    return JSON.parse(text.trim());
  } catch (err) {
    console.error("Gemini analysis failed:", err);
    throw new Error("AI analysis failed: " + (err instanceof Error ? err.message : "Unknown error"));
  }
};
