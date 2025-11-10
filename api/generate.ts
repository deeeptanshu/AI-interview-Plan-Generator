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

  // Robust API Key check: Checks for Vercel's default or a custom name.
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API key is not configured on the server.");
    return new Response(JSON.stringify({ error: 'API key not configured. Please set API_KEY or GEMINI_API_KEY in your environment variables.' }), {
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
      You are an expert interviewer creating a tailored interview plan.
      Generate exactly 5 insightful and distinct interview questions for a candidate.
      
      **Role Details:**
      - Role: ${role}
      - Seniority: ${seniority}
      - Core Skills to assess: ${skillsList}
      - Preferred Question Styles: ${stylesList}

      **Instructions:**
      1. Create questions that are specific, open-ended, and directly probe the listed skills.
      2. Tailor the complexity and scope of the questions to the specified seniority level.
      3. Ensure questions align with the preferred styles. For 'System design', provide a system design prompt. For 'Live coding', provide a clear coding problem.
      4. Do not add any introductory text, closing remarks, or formatting beyond the specified JSON structure.
      5. Provide your response *only* as a JSON object with a single key "questions" which contains an array of the generated question strings.
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
          },
          required: ["questions"]
        },
        temperature: 0.8,
      },
    });
    
    const responseText = response.text;
    if (!responseText) {
        console.error("Gemini API returned an empty response text.");
        throw new Error("Received an empty response from the AI model.");
    }

    // Log the raw response text for debugging purposes
    // console.log("Raw Gemini Response:", responseText);

    const responseData = JSON.parse(responseText);

    if (responseData && Array.isArray(responseData.questions)) {
      return new Response(JSON.stringify({ questions: responseData.questions }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.error("Parsed Gemini response did not have the expected format:", responseData);
    throw new Error("The AI returned an unexpected data format.");

  } catch (error) {
    console.error("Error in Gemini API call:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: "Failed to generate questions from the AI model.", details: errorMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
};