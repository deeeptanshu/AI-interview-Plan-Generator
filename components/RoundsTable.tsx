import React from 'react';
import type { Round } from '../types';

interface RoundsTableProps {
  rounds: Round[];
  setRounds: (rounds: Round[]) => void;
}

export const RoundsTable: React.FC<RoundsTableProps> = ({ rounds, setRounds }) => {
  const handleDurationChange = (index: number, value: string) => {
    const newRounds = [...rounds];
    newRounds[index] = { ...newRounds[index], mins: Math.max(15, Number(value) || 0) };
    setRounds(newRounds);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                    <th scope="col" className="px-4 py-3">Round</th>
                    <th scope="col" className="px-4 py-3">Focus</th>
                    <th scope="col" className="px-4 py-3 w-32">Duration (min)</th>
                    <th scope="col" className="px-4 py-3">Evaluation</th>
                </tr>
            </thead>
            <tbody>
                {rounds.map((round, index) => (
                    <tr key={index} className="border-t border-slate-800 hover:bg-slate-800/30">
                        <td className="px-4 py-3 font-medium">
                            <span className="bg-slate-700 text-slate-200 rounded-full px-2.5 py-0.5 text-xs">{round.name}</span>
                        </td>
                        <td className="px-4 py-3">{round.focus}</td>
                        <td className="px-4 py-3">
                            <input 
                                type="number" 
                                min="15" 
                                step="5" 
                                value={round.mins}
                                onChange={(e) => handleDurationChange(index, e.target.value)}
                                className="w-24 bg-slate-800/50 border border-slate-700 text-white rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </td>
                        <td className="px-4 py-3 text-slate-400">{round.eval}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};