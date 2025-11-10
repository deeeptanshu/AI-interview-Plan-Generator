import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Controls } from './components/Controls';
import { Preview } from './components/Preview';
import { Footer } from './components/Footer';
import { LeadGate } from './components/LeadGate';
import { generateQuestions } from './services/geminiService';
import { ROLES, SENIORITY_WEIGHTS } from './constants';
import type { Role, Seniority, Round, Lead, RubricItem, SampleQuestion } from './types';

// Helper to get initial state from localStorage
const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};


const App: React.FC = () => {
  const [role, setRole] = useState<Role>(() => getInitialState('intervue_role', 'backend'));
  const [seniority, setSeniority] = useState<Seniority>(() => getInitialState('intervue_seniority', 'mid'));
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(() => 
    new Set(getInitialState<string[]>('intervue_selectedSkills', []))
  );
  const [rounds, setRounds] = useState<Round[]>([]);
  const [styles, setStyles] = useState<Set<string>>(new Set(['Live coding']));
  const [lead, setLead] = useState<Lead>({ name: '—', email: '—', company: '—', title: '—' });
  const [isLeadGateOpen, setLeadGateOpen] = useState(false);
  const [sampleQuestions, setSampleQuestions] = useState<SampleQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false); // Do not start generating on load
  const [error, setError] = useState<string | null>(null);

  const currentRoleData = useMemo(() => ROLES[role], [role]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('intervue_role', JSON.stringify(role));
  }, [role]);

  useEffect(() => {
    localStorage.setItem('intervue_seniority', JSON.stringify(seniority));
  }, [seniority]);
  
  useEffect(() => {
    // Don't save empty set on initial mount before skills are loaded
    if (selectedSkills.size > 0) {
      localStorage.setItem('intervue_selectedSkills', JSON.stringify(Array.from(selectedSkills)));
    }
  }, [selectedSkills]);

  const handleGenerateQuestions = useCallback(async () => {
    if (selectedSkills.size === 0) {
        setError('Please select at least one skill to generate questions.');
        return;
    }
    setIsGenerating(true);
    setError(null);
    setSampleQuestions([]);

    try {
        const questions = await generateQuestions({
            role: currentRoleData.label,
            seniority,
            skills: Array.from(selectedSkills),
            styles: Array.from(styles),
        });
        setSampleQuestions(questions.map(q => ({ text: q })));
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        const cleanMessage = errorMessage.replace('Failed to generate questions: ', '');
        setError(cleanMessage);
        console.error(err);
    } finally {
        setIsGenerating(false);
    }
  }, [currentRoleData.label, seniority, selectedSkills, styles]);

  // Effect for initializing and changing roles
  useEffect(() => {
    const roleData = ROLES[role];
    
    // On role change, reset skills to default for the new role.
    // Also handles initial skill selection if localStorage is empty.
    if (getInitialState('intervue_role', 'backend') !== role || selectedSkills.size === 0) {
        const skillsToSet = new Set(roleData.skills.slice(0, 4));
        setSelectedSkills(skillsToSet);
    }
    
    setRounds(roleData.rounds.map(r => ({ ...r })));
    
    // Clear old questions when role changes
    setSampleQuestions([]);
    setError(null);
  }, [role]);


  const handleReset = useCallback(() => {
    localStorage.removeItem('intervue_role');
    localStorage.removeItem('intervue_seniority');
    localStorage.removeItem('intervue_selectedSkills');
    
    setRole('backend');
    setSeniority('mid');
    setStyles(new Set(['Live coding']));
    setLead({ name: '—', email: '—', company: '—', title: '—' });
    
    const roleData = ROLES['backend'];
    const initialSkills = new Set(roleData.skills.slice(0, 4));
    setSelectedSkills(initialSkills);
    setRounds(roleData.rounds.map(r => ({ ...r })));
    setSampleQuestions([]);
    setError(null);
    setIsGenerating(false);
  }, []);

  const totalMinutes = useMemo(() => rounds.reduce((acc, r) => acc + (r.mins || 0), 0), [rounds]);

  const rubric = useMemo((): RubricItem[] => {
    const buckets: { [key: string]: number } = { core: 0, algo: 0, system: 0, culture: 0 };
    const map = currentRoleData.skillMap;
    
    selectedSkills.forEach(s => {
      const bucket = map[s] || "core";
      buckets[bucket] = (buckets[bucket] || 0) + 1;
    });

    const total = Object.values(buckets).reduce((a, b) => a + b, 0) || 1;
    const prop = Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v / total]));
    
    const w = SENIORITY_WEIGHTS[seniority];
    const blended = {
      core: Math.round((prop.core * 0.5 + w.core * 0.5) * 100),
      algo: Math.round((prop.algo * 0.5 + w.algo * 0.5) * 100),
      system: Math.round((prop.system * 0.5 + w.system * 0.5) * 100),
      culture: Math.round((prop.culture * 0.5 + w.culture * 0.5) * 100)
    };
    
    const sum = Object.values(blended).reduce((a,b) => a+b, 0) || 1;
    Object.keys(blended).forEach(k => {
      blended[k as keyof typeof blended] = Math.round(blended[k as keyof typeof blended] * 100 / sum);
    });

    const labels: { [key: string]: string } = { core: "Core Role Skills", algo: "Problem Solving", system: "System Design & Architecture", culture: "Collaboration & Culture" };
    return Object.entries(blended).map(([k, v]) => ({ label: labels[k], value: v }));
  }, [selectedSkills, seniority, currentRoleData.skillMap]);

  const handleDownload = useCallback(() => {
    setLeadGateOpen(true);
  }, []);

  const handleLeadSubmit = useCallback((submittedLead: Lead) => {
    setLead(submittedLead);
    setLeadGateOpen(false);
    setTimeout(() => window.print(), 300);
  }, []);
  
  return (
    <div className="bg-slate-950 min-h-screen text-gray-200 font-sans antialiased">
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Header />
          <main>
            <Hero onReset={handleReset} />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <Controls
                  role={role}
                  setRole={setRole}
                  seniority={seniority}
                  setSeniority={setSeniority}
                  allSkills={currentRoleData.skills}
                  selectedSkills={selectedSkills}
                  setSelectedSkills={setSelectedSkills}
                  rounds={rounds}
                  setRounds={setRounds}
                  totalMinutes={totalMinutes}
                  styles={styles}
                  setStyles={setStyles}
                />
              </div>
              <div className="lg:col-span-2">
                <Preview
                  lead={lead}
                  roleLabel={currentRoleData.label}
                  seniorityLabel={seniority.charAt(0).toUpperCase() + seniority.slice(1)}
                  rubric={rubric}
                  sampleQuestions={sampleQuestions}
                  styles={styles}
                  onDownload={handleDownload}
                  onGenerateQuestions={handleGenerateQuestions}
                  isGenerating={isGenerating}
                  error={error}
                />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <LeadGate
        isOpen={isLeadGateOpen}
        onClose={() => setLeadGateOpen(false)}
        onSubmit={handleLeadSubmit}
        currentLead={lead}
      />
    </div>
  );
};

export default App;