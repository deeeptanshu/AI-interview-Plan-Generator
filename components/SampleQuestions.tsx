import React from 'react';
import type { SampleQuestion } from '../types';
import { WarningIcon } from './icons';

interface SampleQuestionsProps {
  questions: SampleQuestion[];
  isLoading: boolean;
  error: string | null;
}

export const SampleQuestions: React.FC<SampleQuestionsProps> = ({ questions, isLoading, error }) => {
  return (
    <div className="mt-4 text-sm min-h-[120px]">
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-4 bg-slate-800/50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="mt-3 text-slate-400">Gemini is crafting questions...</p>
        </div>
      )}
      {error && (
        <div className="text-amber-400 bg-amber-900/50 border border-amber-700 rounded-lg p-3 flex items-start gap-3">
          <WarningIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Generation Failed</p>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      )}
      {!isLoading && !error && questions.length > 0 && (
        <ol className="list-decimal list-inside space-y-2 text-slate-300 print:text-black">
          {questions.map((q, index) => (
            <li key={index}>{q.text}</li>
          ))}
        </ol>
      )}
      {!isLoading && !error && questions.length === 0 && (
        <div className="flex items-center justify-center text-center p-4 bg-slate-800/50 rounded-lg h-full">
            <p className="text-slate-400 text-xs italic">Click 'Generate' to create AI-powered questions based on your selections.</p>
        </div>
      )}
    </div>
  );
};