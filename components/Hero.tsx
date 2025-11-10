import React from 'react';
import { Button } from './Button';
import { ResetIcon } from './icons';

interface HeroProps {
  onReset: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onReset }) => (
  <section className="border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white">Build a structured plan your team can use today</h2>
      <p className="mt-2 text-slate-300 max-w-3xl">
        Choose a role and seniority, select skills, fine-tune rounds, and generate a printable plan with AI-powered rubric weights and sample questions.
      </p>
    </div>
    <Button onClick={onReset} variant="secondary" title="Start over" className="flex-shrink-0">
      <ResetIcon />
      Reset Plan
    </Button>
  </section>
);