import React from 'react';
import type { Role, Seniority } from '../types';

interface RoleSelectorProps {
  role: Role;
  setRole: (role: Role) => void;
  seniority: Seniority;
  setSeniority: (seniority: Seniority) => void;
}

const Label: React.FC<{ htmlFor: string, children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-300 mb-2">{children}</label>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
);


export const RoleSelector: React.FC<RoleSelectorProps> = ({ role, setRole, seniority, setSeniority }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="role">Role</Label>
      <Select id="role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
        <option value="backend">Backend Engineer</option>
        <option value="frontend">Frontend Engineer</option>
        <option value="datasci">Data Scientist</option>
        <option value="devops">DevOps / SRE</option>
        <option value="qa">QA / Test Engineer</option>
      </Select>
    </div>
    <div>
      <Label htmlFor="seniority">Seniority</Label>
      <Select id="seniority" value={seniority} onChange={(e) => setSeniority(e.target.value as Seniority)}>
        <option value="junior">Junior / Entry</option>
        <option value="mid">Mid-level</option>
        <option value="senior">Senior / Lead</option>
      </Select>
    </div>
  </div>
);