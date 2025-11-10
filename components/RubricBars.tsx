import React from 'react';
import type { RubricItem } from '../types';

interface RubricBarsProps {
  rubric: RubricItem[];
}

export const RubricBars: React.FC<RubricBarsProps> = ({ rubric }) => (
  <div className="space-y-3 mt-4">
    {rubric.map((item) => (
      <div key={item.label}>
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="font-medium text-slate-300 print:text-black">{item.label}</span>
          <span className="font-semibold text-blue-300">{item.value}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2.5 print:border print:border-gray-400">
          <div 
            className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2.5 rounded-full" 
            style={{ width: `${item.value}%` }}
          ></div>
        </div>
      </div>
    ))}
  </div>
);