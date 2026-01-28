
import React, { useState } from 'react';
import { Seniority, Persona, InterviewConfig, InferenceResult } from '../types';
import { PERSONAS } from '../constants';
import { inferPersona } from '../services/geminiService';

interface JobSetupProps {
  onStart: (config: InterviewConfig) => void;
}

const JobSetup: React.FC<JobSetupProps> = ({ onStart }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [seniority, setSeniority] = useState<Seniority>(Seniority.MID);
  const [questionCount, setQuestionCount] = useState<number>(7);
  const [isInferring, setIsInferring] = useState(false);
  const [castingResult, setCastingResult] = useState<{ persona: Persona, inference: InferenceResult } | null>(null);

  const handleNext = async () => {
    if (!jobTitle) return;
    setIsInferring(true);
    try {
      const result = await inferPersona(jobTitle, seniority, PERSONAS, companyUrl);
      setCastingResult(result);
    } catch (error) {
      console.error(error);
      setCastingResult({ 
        persona: PERSONAS[0], 
        inference: { 
          umbrella: 'Technical & Systems',
          methodology: 'First Principles',
          selectedPersona: PERSONAS[1].name, 
          industryInference: 'General Systems', 
          pressureScore: 5, 
          focusPillars: ['Clarity', 'Logic'],
          generatedSystemInstruction: `You are Claire. Be clinical and forensic.`
        } 
      });
    } finally {
      setIsInferring(false);
    }
  };

  const handleFinalStart = () => {
    if (castingResult) {
      onStart({ 
        jobTitle, 
        seniority, 
        companyUrl,
        persona: castingResult.persona, 
        inference: castingResult.inference,
        questionCount: Math.round(questionCount)
      });
    }
  };

  if (castingResult) {
    const { persona, inference } = castingResult;
    return (
      <div className="max-w-xl w-full p-10 theme-card animate-in fade-in zoom-in-95 duration-500">
        <div className="border-b border-theme-border pb-6 mb-8 flex justify-between items-start">
          <div>
            <span className="technical-label text-theme-accent block mb-1">Casting Intelligence</span>
            <h2 className="text-2xl font-black font-theme-heading text-theme-text tracking-tight uppercase">{inference.umbrella}</h2>
          </div>
          <div className="text-right">
            <span className="technical-label block mb-1">Methodology</span>
            <span className="text-xs font-black text-theme-text uppercase">{inference.methodology}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8 mb-10 p-6 bg-theme-text/5 border border-theme-border rounded-theme">
          <div className="relative shrink-0">
            <div className="w-24 h-24 bg-theme-bg border border-theme-border rounded-full overflow-hidden p-1">
              <img src={persona.avatar} alt={persona.name} className="w-full h-full grayscale hover:grayscale-0 transition-all object-cover rounded-full" />
            </div>
            <span className="absolute -bottom-1 -right-1 px-3 py-1 bg-theme-text text-theme-bg font-bold text-[9px] uppercase tracking-tighter rounded-full border-2 border-theme-bg">
              {persona.focus.split(' ')[0]}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black font-theme-heading text-theme-text uppercase">{persona.name}</h3>
            <p className="text-theme-text/60 text-xs mt-1 font-bold leading-snug uppercase tracking-widest">{persona.focus}</p>
            <p className="text-theme-text/60 text-[11px] mt-2 font-medium leading-relaxed italic opacity-80">"{persona.description}"</p>
          </div>
        </div>

        <div className="space-y-4 mb-10">
            <div className="p-5 bg-theme-card border border-theme-border rounded-theme shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="technical-label">Evaluation Rigor</span>
                  <span className="text-[10px] font-black text-theme-text uppercase">Score: {inference.pressureScore}/10</span>
                </div>
                <div className="flex gap-1 h-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-full ${i < inference.pressureScore ? 'bg-theme-accent' : 'bg-theme-border'}`} />
                  ))}
                </div>
            </div>

            <div className="p-5 bg-theme-card border border-theme-border rounded-theme shadow-sm">
                <span className="technical-label block mb-4">Assessment Pillars</span>
                <div className="flex flex-wrap gap-2">
                  {inference.focusPillars.map(pillar => (
                    <div key={pillar} className="px-3 py-1.5 bg-theme-text/5 border border-theme-border rounded-theme text-[10px] font-black uppercase text-theme-text/80 tracking-tight">
                      {pillar}
                    </div>
                  ))}
                </div>
            </div>
        </div>

        <button 
          onClick={handleFinalStart}
          className="w-full bg-theme-accent text-white font-black py-5 uppercase tracking-widest hover:brightness-110 transition-all active:scale-[0.99] rounded-theme"
        >
          Initialize Session
        </button>
        <button 
          onClick={() => setCastingResult(null)}
          className="w-full mt-6 text-theme-text/40 font-bold uppercase tracking-widest text-[9px] hover:text-theme-text transition-colors"
        >
          Modify Parameters
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl w-full p-10 theme-card animate-in fade-in duration-500">
      <div className="mb-12 border-b border-theme-border pb-8">
        <h1 className="text-5xl font-black font-theme-heading text-theme-text uppercase tracking-tighter mb-2">Configure<span className="text-theme-accent">.</span></h1>
        <p className="technical-label">Vertical Interview Parameters</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="technical-label">01. Target Role</label>
          <input 
            type="text" 
            placeholder="E.G. TECHNICAL DIRECTOR"
            className="w-full bg-theme-bg border border-theme-border rounded-theme px-5 py-4 text-theme-text focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all placeholder:text-theme-text/20 font-medium text-sm uppercase tracking-tight"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="technical-label">02. Context URL</label>
          <input 
            type="text" 
            placeholder="HTTPS://COMPANY.COM"
            className="w-full bg-theme-bg border border-theme-border rounded-theme px-5 py-4 text-theme-text focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all placeholder:text-theme-text/20 font-medium text-sm uppercase tracking-tight"
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <label className="technical-label">03. Seniority Scalar</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.values(Seniority).map((s) => (
              <button
                key={s}
                onClick={() => setSeniority(s)}
                className={`py-3 text-[10px] font-black uppercase tracking-tighter border transition-all rounded-theme ${
                  seniority === s 
                    ? 'bg-theme-accent border-theme-accent text-white shadow-md' 
                    : 'bg-theme-card border-theme-border text-theme-text/40 hover:border-theme-accent/50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleNext}
          disabled={!jobTitle || isInferring}
          className="w-full bg-theme-text text-theme-bg font-black py-5 uppercase tracking-widest hover:bg-theme-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4 rounded-theme shadow-lg"
        >
          {isInferring ? (
            <>
              <div className="w-3 h-3 border-2 border-theme-bg/30 border-t-theme-bg animate-spin" />
              DEPLOYING DIRECTOR...
            </>
          ) : 'Configure Session'}
        </button>
      </div>
    </div>
  );
};

export default JobSetup;
