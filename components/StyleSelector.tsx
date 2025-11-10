import React from 'react';

const STYLES = ["Live coding", "Theoretical Q&A", "System design", "Pair programming", "Case simulation", "Take-home"];

interface StyleSelectorProps {
  styles: Set<string>;
  setStyles: (styles: Set<string>) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, setStyles }) => {
  const handleToggle = (style: string) => {
    const newStyles = new Set(styles);
    if (newStyles.has(style)) {
      newStyles.delete(style);
    } else {
      newStyles.add(style);
    }
    setStyles(newStyles);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {STYLES.map(style => (
        <label key={style} className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 text-sm font-medium bg-slate-800 text-slate-300 border border-slate-700 has-[:checked]:bg-green-900/70 has-[:checked]:text-green-300 has-[:checked]:border-green-700 hover:bg-slate-700 hover:border-slate-600">
          <input 
            type="checkbox" 
            value={style} 
            checked={styles.has(style)}
            onChange={() => handleToggle(style)}
            className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-600 ring-offset-gray-800 focus:ring-2 accent-green-500"
          />
          {style}
        </label>
      ))}
    </div>
  );
};