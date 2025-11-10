
export type Role = 'backend' | 'frontend' | 'datasci' | 'devops' | 'qa';
export type Seniority = 'junior' | 'mid' | 'senior';

export interface Round {
  name: string;
  focus: string;
  mins: number;
  eval: string;
}

export interface RoleData {
  label: string;
  skills: string[];
  rounds: Round[];
  skillMap: { [key: string]: 'core' | 'algo' | 'system' };
}

export interface Lead {
  name: string;
  email: string;
  company: string;
  title: string;
}

export interface RubricItem {
  label: string;
  value: number;
}

export interface SampleQuestion {
  text: string;
}

export interface GenerateQuestionsBody {
  role: string;
  seniority: string;
  skills: string[];
  styles: string[];
  numQuestions: number;
}
