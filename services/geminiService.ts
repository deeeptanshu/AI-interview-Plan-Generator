import type { GenerateQuestionsBody } from '../types';

export const generateQuestions = async (
  params: GenerateQuestionsBody
): Promise<string[]> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.details || 'An unknown server error occurred');
    }

    return data.questions;
  } catch (error) {
    console.error("Error calling backend to generate questions:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
    throw new Error("Failed to generate questions due to an unexpected error.");
  }
};