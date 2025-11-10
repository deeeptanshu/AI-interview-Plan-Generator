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

  // FIX: The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured on the server. Please contact the site administrator.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const { role, seniority, skills, styles, numQuestions } = (await req.json()) as GenerateQuestionsBody;

    // Basic validation
    if (!role || !seniority || !skills || skills.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields: role, seniority, and skills.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const skillsList = skills.join(', ');
    const stylesList = styles.join(', ');
    const questionCount = numQuestions && numQuestions >= 3 && numQuestions <= 10 ? numQuestions : 5;

    const prompt = `
      You are an expert interviewer creating an interview plan.
      Generate ${questionCount} insightful and distinct interview questions for a candidate.
      
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

    // FIX: Property 'json' does not exist on type 'Part'. The correct way to get the JSON response is to access the `text` property and parse it.
    const result = JSON.parse(response.text) as { questions: string[] };

    if (result && Array.isArray(result.questions)) {
      return new Response(JSON.stringify({ questions: result.questions }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    throw new Error("Invalid or empty response format from the Gemini API.");

  } catch (error) {
    console.error("Error in API route:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: "Failed to communicate with the AI model.", details: errorMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
};
