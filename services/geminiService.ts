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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error("Error calling backend to generate questions:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
    throw new Error("Failed to generate questions due to an unexpected error.");
  }
};
