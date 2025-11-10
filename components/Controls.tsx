import React from 'react';
import { RoleSelector } from './RoleSelector';
import { SkillsSelector } from './SkillsSelector';
import { RoundsTable } from './RoundsTable';
import { StyleSelector } from './StyleSelector';
import type { Role, Seniority, Round } from '../types';

interface ControlsProps {
  role: Role;
  setRole: (role: Role) => void;
  seniority: Seniority;
  setSeniority: (seniority: Seniority) => void;
  allSkills: string[];
  selectedSkills: Set<string>;
  setSelectedSkills: (skills: Set<string>) => void;
  rounds: Round[];
  setRounds: (rounds: Round[]) => void;
  totalMinutes: number;
  styles: Set<string>;
  setStyles: (styles: Set<string>) => void;
}

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`border border-slate-800 bg-slate-900/50 rounded-xl p-5 backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const SectionHeader: React.FC<{ title: string, step: number }> = ({ title, step }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/50 border border-blue-800 text-blue-300 font-bold">{step}</span>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
  </div>
);

export const Controls: React.FC<ControlsProps> = (props) => {
  return (
    <div className="space-y-6">
      <Card>
        <SectionHeader title="Role & Seniority" step={1} />
        <RoleSelector role={props.role} setRole={props.setRole} seniority={props.seniority} setSeniority={props.setSeniority} />
      </Card>
      
      <Card>
        <SectionHeader title="Core Skills" step={2} />
        <SkillsSelector allSkills={props.allSkills} selectedSkills={props.selectedSkills} setSelectedSkills={props.setSelectedSkills} />
        <p className="text-xs text-slate-400 mt-3">Pick 3–6 skills to focus your plan. We’ll weight rubrics automatically.</p>
      </Card>

      <Card>
        <SectionHeader title="Rounds & Durations" step={3} />
        <RoundsTable rounds={props.rounds} setRounds={props.setRounds} />
         <div className="text-sm mt-4 flex justify-between items-center">
          <span className="text-slate-400">Adjust durations to fit your process.</span>
          <span>Total interview time: <span className="font-semibold text-blue-300 bg-blue-900/50 border border-blue-800 rounded-full px-3 py-1">{props.totalMinutes} min</span></span>
        </div>
      </Card>
      
      <Card>
        <SectionHeader title="Question Styles" step={4} />
        <StyleSelector styles={props.styles} setStyles={props.setStyles} />
      </Card>
    </div>
  );
};