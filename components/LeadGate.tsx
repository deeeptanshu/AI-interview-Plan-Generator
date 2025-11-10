import React, { useState, useEffect } from 'react';
import type { Lead } from '../types';
import { Button } from './Button';

interface LeadGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: Lead) => void;
  currentLead: Lead;
}

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
);

const Label: React.FC<{ htmlFor: string, children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-300 mb-2">{children}</label>
);

export const LeadGate: React.FC<LeadGateProps> = ({ isOpen, onClose, onSubmit, currentLead }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentLead.name !== '—') setName(currentLead.name);
    if (currentLead.email !== '—') setEmail(currentLead.email);
    if (currentLead.company !== '—') setCompany(currentLead.company);
    if (currentLead.title !== '—') setTitle(currentLead.title);
  }, [isOpen, currentLead]);

  const handleSubmit = () => {
    if (!name || !email) {
      setError('Please enter your name and email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    setError('');
    onSubmit({ 
      name: name.trim(), 
      email: email.trim(), 
      company: company.trim() || '—', 
      title: title.trim() || '—' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition text-2xl" aria-label="Close">&times;</button>
        <h4 className="text-xl font-bold text-white mb-2">Almost there!</h4>
        <p className="text-slate-400 mb-6">Enter your details to add them to the plan header.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="leadName">Your Name</Label>
            <Input id="leadName" type="text" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="leadEmail">Work Email</Label>
            <Input id="leadEmail" type="email" placeholder="jane@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="leadCompany">Company</Label>
            <Input id="leadCompany" type="text" placeholder="Acme Corp" value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="leadRole">Your Role</Label>
            <Input id="leadRole" type="text" placeholder="Head of Talent" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
        </div>
        
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <div className="mt-6">
          <Button onClick={handleSubmit} fullWidth>Generate PDF</Button>
          <p className="text-xs text-slate-500 text-center mt-3">We'll use your details for the plan header and open a print window.</p>
        </div>
      </div>
    </div>
  );
};