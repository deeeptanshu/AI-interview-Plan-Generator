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
      // Use the 'error' or 'details' field from the backend's JSON response
      const errorMessage = data.error || data.details || 'An unknown error occurred';
      throw new Error(errorMessage);
    }

    return data.questions;
  } catch (error) {
    console.error("Error calling backend to generate questions:", error);
    if (error instanceof Error) {
      // Re-throw the specific error message
      throw new Error(error.message);
    }
    throw new Error("Failed to generate questions due to an unexpected network error.");
  }
};