
import { Persona, ThemeConfig } from './types';

export const THEMES: ThemeConfig[] = [
  {
    name: 'Modern Studio',
    bg: '#F8F9FA',
    accent: '#2563EB',
    text: '#0F172A',
    card: '#FFFFFF',
    border: '#E2E8F0',
    fontHeading: '"Inter", sans-serif',
    fontBody: '"Inter", sans-serif',
    radius: '0.125rem'
  },
  {
    name: 'Industrial',
    bg: '#121212',
    accent: '#FF4F00',
    text: '#E5E5E5',
    card: '#1E1E1E',
    border: '#333333',
    fontHeading: '"JetBrains Mono", monospace',
    fontBody: '"JetBrains Mono", monospace',
    radius: '0rem'
  },
  {
    name: 'Boardroom',
    bg: '#0A192F',
    accent: '#D4AF37',
    text: '#F1F1F1',
    card: '#112240',
    border: '#1d2d50',
    fontHeading: '"Playfair Display", serif',
    fontBody: '"Inter", sans-serif',
    radius: '0.25rem'
  },
  {
    name: 'Sterile',
    bg: '#F0F4F8',
    accent: '#38B2AC',
    text: '#2D3748',
    card: '#FFFFFF',
    border: '#E2E8F0',
    fontHeading: '"Inter", sans-serif',
    fontBody: '"Inter", sans-serif',
    radius: '1.25rem'
  },
  {
    name: 'Creative',
    bg: '#000000',
    accent: '#D946EF',
    text: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    fontHeading: '"Inter", sans-serif',
    fontBody: '"Inter", sans-serif',
    radius: '0.75rem',
    glass: true
  }
];

export const PERSONAS: Persona[] = [
  {
    id: 'sarah',
    name: 'Sarah',
    focus: 'Alignment & EQ',
    gender: 'Female',
    description: 'Alignment Specialist: Evaluates cultural ecosystem fit and situational empathy.',
    traits: ['Empathetic', 'Insightful', 'Values-driven'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    voiceName: 'Zephyr'
  },
  {
    id: 'claire',
    name: 'Claire',
    focus: 'Forensic Logic',
    gender: 'Female',
    description: 'Technical Auditor: Clinical tester of mastery and logical derivation.',
    traits: ['Precise', 'Objective', 'Rigorous'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    voiceName: 'Kore'
  },
  {
    id: 'james',
    name: 'James',
    focus: 'Performance & ROI',
    gender: 'Male',
    description: 'Commercial Lead: Audits unit economics, growth metrics, and SPICED logic.',
    traits: ['Dynamic', 'Results-focused', 'Sharp'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    voiceName: 'Fenrir'
  },
  {
    id: 'david',
    name: 'David',
    focus: 'Resilience & Defense',
    gender: 'Male',
    description: 'Operational Skeptic: Tests composure and adherence to protocols under pressure.',
    traits: ['Direct', 'Skeptical', 'Composed'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    voiceName: 'Puck'
  },
  {
    id: 'thomas',
    name: 'Thomas',
    focus: 'Vision & Scale',
    gender: 'Male',
    description: 'Strategic Executive: Focuses on long-term impact and resource scaling.',
    traits: ['Visionary', 'Broad-thinking', 'Patient'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    voiceName: 'Charon'
  }
];

export const VERTICAL_KNOWLEDGE = `
VERTICAL INTERVIEW ENGINE PROTOCOLS:

# 1. CLASSIFICATION UMBRELLAS
- TECHNICAL & SYSTEMS: Hard science, code, engineering. (Method: First Principles)
- HUMAN & SOCIAL: Empathy, interpersonal, education. (Method: STAR/Behavioral)
- COMMERCIAL & GROWTH: Revenue, persuasions, unit economics. (Method: Revenue Diagnostic)
- STRATEGIC & GOVERNANCE: High-level risk, law, scale. (Method: Case Study)
- OPERATIONAL & TACTICAL: Execution, safety, output. (Method: Stress-Simulation)

# 2. METHODOLOGY EXECUTION
- FIRST PRINCIPLES: Ignore experience; test the "Why" and logical derivation from zero.
- STAR/BEHAVIORAL: Hunt for past evidence of situational EQ and teamwork.
- REVENUE DIAGNOSTIC: Audit KPIs, ROI, and SPICED (Pain/Impact/Decision) logic.
- CASE STUDY: Evaluate multi-step logic and risk assessment through business scenarios.
- STRESS-SIMULATION: Present an active crisis; prioritize speed and protocol over storytelling.

# 3. INTERVIEWER LENSES
- SARAH: Focus on "Alignment." Use soft transitions.
- CLAIRE: Focus on "Forensic." Ask for exact processes.
- JAMES: Focus on "ROI." Drill down into numbers.
- DAVID: Focus on "Resilience." Challenge decisions directly.
- THOMAS: Focus on "Strategy." Ask about 3-year outcomes.
`;
