
import React from 'react';
import { FeedbackReport as FeedbackReportType, InterviewConfig } from '../types';

interface FeedbackReportProps {
  report: FeedbackReportType;
  config: InterviewConfig;
  onReset: () => void;
}

const FeedbackReport: React.FC<FeedbackReportProps> = ({ report, config, onReset }) => {
  return (
    <div className="max-w-6xl w-full p-10 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="border-b border-theme-border pb-10 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <span className="technical-label text-theme-accent block mb-2">Evaluation Document // CONFIDENTIAL</span>
          <h1 className="text-5xl font-black font-theme-heading text-theme-text uppercase tracking-tighter">Performance Analysis</h1>
          <p className="text-theme-text/40 text-xs font-bold uppercase mt-2 tracking-widest">{config.seniority} Level Candidate Assessment</p>
        </div>
        
        <div className="flex items-center gap-10 bg-theme-card p-8 theme-card rounded-theme">
          <div className="text-right">
            <span className="technical-label block mb-1 text-theme-accent">Final Score</span>
            <span className="text-6xl font-black text-theme-accent tracking-tighter leading-none">{report.overallScore}</span>
          </div>
          <div className="w-[1px] h-14 bg-theme-border" />
          <div className="text-left">
            <span className="technical-label block mb-1">Job Title</span>
            <span className="text-sm font-black text-theme-text uppercase block">{config.jobTitle}</span>
            <span className="text-[10px] text-theme-text/40 font-bold uppercase">{config.persona.name} presiding</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h3 className="technical-label mb-6 flex items-center gap-4">
              <span className="bg-theme-accent w-2 h-2 rounded-full" /> Executive Summary
            </h3>
            <div className="p-10 theme-card rounded-theme relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-theme-accent/20" />
              <p className="text-theme-text/80 text-base font-medium leading-relaxed italic">
                "{report.summary}"
              </p>
            </div>
          </section>

          <section>
            <h3 className="technical-label mb-6 flex items-center gap-4">
              <span className="bg-theme-accent w-2 h-2 rounded-full" /> Behavioral Performance Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.axes.map((axis, i) => (
                <div key={i} className="p-8 theme-card border-theme-border/20 shadow-sm rounded-theme hover:border-theme-accent/20 transition-colors">
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-sm font-black text-theme-text uppercase tracking-tight">{axis.axis}</span>
                    <span className="text-xs font-bold text-theme-accent">{axis.score}%</span>
                  </div>
                  <div className="w-full bg-theme-text/5 h-1.5 mb-5 rounded-full">
                    <div className="bg-theme-accent h-full rounded-full transition-all duration-1000" style={{ width: `${axis.score}%` }} />
                  </div>
                  <p className="text-xs text-theme-text/60 font-medium leading-relaxed">{axis.explanation}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section>
            <h3 className="technical-label mb-6 flex items-center gap-4">
              <span className="bg-theme-accent w-2 h-2 rounded-full" /> Key Recommendations
            </h3>
            <div className="space-y-4">
              {report.tips.map((tip, i) => (
                <div key={i} className="p-6 theme-card border-none bg-theme-text/5 flex gap-5 rounded-theme">
                  <span className="text-sm font-black text-theme-accent">0{i+1}</span>
                  <p className="text-xs font-bold uppercase text-theme-text leading-normal">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="technical-label mb-6 flex items-center gap-4">
              <span className="bg-theme-accent w-2 h-2 rounded-full" /> Signal Log
            </h3>
            <div className="h-72 overflow-y-auto bg-theme-bg border border-theme-border p-6 space-y-4 rounded-theme shadow-inner custom-scrollbar">
              {report.transcript.map((line, i) => {
                  const [speaker, ...content] = line.split(':');
                  return (
                    <div key={i} className="text-[11px] leading-relaxed border-b border-theme-border/10 pb-2">
                      <span className={`font-black uppercase mr-2 ${speaker === 'You' ? 'text-theme-accent' : 'text-theme-text/40'}`}>
                        {speaker}:
                      </span>
                      <span className="text-theme-text/80 font-medium">{content.join(':')}</span>
                    </div>
                  );
              })}
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-theme-bg/80 backdrop-blur-md border-t border-theme-border flex justify-center z-40">
        <button 
          onClick={onReset}
          className="bg-theme-text text-theme-bg px-16 py-5 font-black uppercase tracking-[0.2em] hover:bg-theme-accent hover:text-white transition-all active:scale-95 shadow-xl rounded-theme"
        >
          Start New Session
        </button>
      </div>
    </div>
  );
};

export default FeedbackReport;
