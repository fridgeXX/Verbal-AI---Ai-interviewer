
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, InterviewConfig, FeedbackReport as FeedbackReportType, ThemeConfig } from './types';
import { THEMES } from './constants';
import JobSetup from './components/JobSetup';
import InterviewSession from './components/InterviewSession';
import FeedbackReport from './components/FeedbackReport';
import ThemeSelector from './components/ThemeSelector';
import Header from './components/Header';
import { generateFeedback } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [activeTab, setActiveTab] = useState<'parameters' | 'interface'>('parameters');
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(THEMES[0]);
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [feedback, setFeedback] = useState<FeedbackReportType | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  // Inject Theme Variables into Root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', activeTheme.bg);
    root.style.setProperty('--theme-accent', activeTheme.accent);
    root.style.setProperty('--theme-text', activeTheme.text);
    root.style.setProperty('--theme-card', activeTheme.card);
    root.style.setProperty('--theme-border', activeTheme.border);
    root.style.setProperty('--theme-font-heading', activeTheme.fontHeading);
    root.style.setProperty('--theme-font-body', activeTheme.fontBody);
    root.style.setProperty('--theme-radius', activeTheme.radius);
  }, [activeTheme]);

  const handleStartInterview = (config: InterviewConfig) => {
    setConfig(config);
    setAppState(AppState.INTERVIEWING);
  };

  const handleEndInterview = async (transcript: string[]) => {
    if (!config) return;
    setIsGeneratingFeedback(true);
    setAppState(AppState.FEEDBACK);
    
    try {
      const report = await generateFeedback(transcript, config.jobTitle, config.persona);
      setFeedback(report);
    } catch (error) {
      console.error('Feedback generation failed:', error);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleReset = () => {
    setAppState(AppState.SETUP);
    setConfig(null);
    setFeedback(null);
  };

  return (
    <div className={`min-h-screen bg-theme-bg text-theme-text flex flex-col selection:bg-theme-accent/30 transition-colors duration-500`}>
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-10 px-4">
        <AnimatePresence mode="wait">
          {appState === AppState.SETUP && (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col items-center gap-8"
            >
              {/* Tab Selector */}
              <div className="flex p-1 bg-theme-border/20 rounded-theme border border-theme-border/50">
                <button 
                  onClick={() => setActiveTab('parameters')}
                  className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-theme ${activeTab === 'parameters' ? 'bg-theme-card text-theme-accent shadow-sm' : 'opacity-40 hover:opacity-100'}`}
                >
                  Parameters
                </button>
                <button 
                  onClick={() => setActiveTab('interface')}
                  className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-theme ${activeTab === 'interface' ? 'bg-theme-card text-theme-accent shadow-sm' : 'opacity-40 hover:opacity-100'}`}
                >
                  Interface
                </button>
              </div>

              {activeTab === 'parameters' ? (
                <JobSetup onStart={handleStartInterview} />
              ) : (
                <div className="max-w-4xl w-full">
                  <ThemeSelector activeTheme={activeTheme.name} onThemeChange={setActiveTheme} />
                </div>
              )}
            </motion.div>
          )}

          {appState === AppState.INTERVIEWING && config && (
            <motion.div 
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center"
            >
              <InterviewSession config={config} onEnd={handleEndInterview} />
            </motion.div>
          )}

          {appState === AppState.FEEDBACK && (
            <motion.div 
              key="feedback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center"
            >
              {isGeneratingFeedback ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 border-4 border-theme-accent border-t-transparent rounded-full animate-spin mx-auto mb-8" />
                  <h2 className="text-3xl font-theme-heading font-black text-theme-text uppercase tracking-tighter mb-2">Analyzing Performance</h2>
                  <p className="technical-label">Processing session transcript and evaluation matrix...</p>
                </div>
              ) : feedback && config ? (
                <FeedbackReport report={feedback} config={config} onReset={handleReset} />
              ) : (
                <div className="text-center theme-card p-12 max-w-md shadow-2xl">
                    <p className="text-theme-accent font-black uppercase text-xs mb-4">Error // Analytical Failure</p>
                    <p className="text-theme-text/60 text-sm mb-8 font-medium">There was a problem generating the evaluation document.</p>
                    <button onClick={handleReset} className="w-full bg-theme-text text-theme-bg font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-theme-accent hover:text-white transition-all rounded-theme">Restart Session</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-10 py-10 flex flex-col md:flex-row justify-between items-center border-t border-theme-border/50">
        <p className="technical-label">© 2025 Verbal AI. Confidential Assessment Tool.</p>
        <div className="flex gap-10 mt-6 md:mt-0">
          <a href="#" className="technical-label hover:text-theme-accent transition-colors">Privacy</a>
          <a href="#" className="technical-label hover:text-theme-accent transition-colors">Terms</a>
          <a href="#" className="technical-label hover:text-theme-accent transition-colors">Vertical Intelligence Guide</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
