import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateQuestionsBody } from '../types';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const { role, seniority, skills, styles } = (await req.json()) as GenerateQuestionsBody;

    const skillsList = skills.join(', ');
    const stylesList = styles.join(', ');

    const prompt = `
      You are an expert interviewer creating an interview plan.
      Generate 5 insightful and distinct interview questions for a candidate.
      
      **Role Details:**
      - Role: ${role}
      - Seniority: ${seniority}
      - Core Skills to assess: ${skillsList}
      - Preferred Question Styles: ${stylesList}

      **Instructions:**
      1.  Create questions that are specific, open-ended, and directly probe the listed skills.
      2.  Tailor the complexity and scope of the questions to the specified seniority level.
      3.  Ensure the questions align with the preferred question styles. For example, if 'System design' is a style, one question must be a system design prompt. If 'Live coding' is a style, provide a clear coding problem.
      4.  Do not add any introductory text, closing remarks, or formatting beyond the JSON structure.
      5.  Provide only the questions in a JSON array format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "An interview question."
              }
            }
          }
        },
        temperature: 0.7,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.questions)) {
      return new Response(JSON.stringify({ questions: result.questions }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    throw new Error("Invalid response format from Gemini API");

  } catch (error) {
    console.error("Error in API route:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: "Failed to generate questions.", details: errorMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
};
