import React from 'react';

interface SkillsSelectorProps {
  allSkills: string[];
  selectedSkills: Set<string>;
  setSelectedSkills: (skills: Set<string>) => void;
}

const SkillChip: React.FC<{ skill: string, isSelected: boolean, onToggle: (skill: string) => void }> = ({ skill, isSelected, onToggle }) => {
    const baseClasses = "flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 text-sm font-medium border";
    const selectedClasses = "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/10";
    const unselectedClasses = "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-600";

    return (
        <label className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
            <input 
                type="checkbox"
                value={skill}
                checked={isSelected}
                onChange={() => onToggle(skill)}
                className="hidden"
            />
            {skill}
        </label>
    );
};

export const SkillsSelector: React.FC<SkillsSelectorProps> = ({ allSkills, selectedSkills, setSelectedSkills }) => {
  const handleToggle = (skill: string) => {
    const newSkills = new Set(selectedSkills);
    if (newSkills.has(skill)) {
      newSkills.delete(skill);
    } else {
      newSkills.add(skill);
    }
    setSelectedSkills(newSkills);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allSkills.map(skill => (
        <SkillChip 
            key={skill} 
            skill={skill} 
            isSelected={selectedSkills.has(skill)}
            onToggle={handleToggle}
        />
      ))}
    </div>
  );
};