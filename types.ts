
export enum Seniority {
  ENTRY = 'Entry',
  MID = 'Mid',
  SENIOR = 'Senior',
  EXECUTIVE = 'Executive'
}

export type Umbrella = 'Technical & Systems' | 'Human & Social' | 'Commercial & Growth' | 'Strategic & Governance' | 'Operational & Tactical';
export type Methodology = 'First Principles' | 'STAR/Behavioral' | 'Revenue Diagnostic' | 'Case Study' | 'Stress-Simulation';
export type ThemeName = 'Modern Studio' | 'Industrial' | 'Boardroom' | 'Sterile' | 'Creative';

export interface ThemeConfig {
  name: ThemeName;
  bg: string;
  accent: string;
  text: string;
  card: string;
  border: string;
  fontHeading: string;
  fontBody: string;
  radius: string;
  glass?: boolean;
}

export interface Persona {
  id: string;
  name: string;
  focus: string;
  gender: 'Male' | 'Female';
  description: string;
  traits: string[];
  avatar: string;
  voiceName: string;
}

export interface InferenceResult {
  umbrella: Umbrella;
  methodology: Methodology;
  selectedPersona: string;
  industryInference: string;
  pressureScore: number;
  focusPillars: string[];
  generatedSystemInstruction: string;
}

export interface InterviewConfig {
  jobTitle: string;
  seniority: Seniority;
  companyUrl?: string;
  persona: Persona;
  inference: InferenceResult;
  questionCount: number;
}

export interface FeedbackSection {
  axis: string;
  score: number;
  explanation: string;
}

export interface FeedbackReport {
  overallScore: number;
  summary: string;
  axes: FeedbackSection[];
  tips: string[];
  transcript: string[];
}

export enum AppState {
  SETUP = 'setup',
  INTERVIEWING = 'interviewing',
  FEEDBACK = 'feedback'
}
