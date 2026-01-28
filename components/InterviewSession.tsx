
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { InterviewConfig } from '../types';
import { createBlob, decode, decodeAudioData } from '../services/audioService';
import Visualizer from './Visualizer';

interface InterviewSessionProps {
  config: InterviewConfig;
  onEnd: (transcript: string[]) => void;
}

// Removed unused themeName prop from component definition and props interface
const InterviewSession: React.FC<InterviewSessionProps> = ({ config, onEnd }) => {
  const [isReady, setIsReady] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const currentTranscriptionRef = useRef<string>('');
  const userInputTranscriptionRef = useRef<string>('');

  useEffect(() => {
    const initSession = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        if (inCtx.state === 'suspended') await inCtx.resume();
        if (outCtx.state === 'suspended') await outCtx.resume();

        audioContextRef.current = inCtx;
        outputAudioContextRef.current = outCtx;

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              const source = inCtx.createMediaStreamSource(stream);
              scriptProcessorRef.current = inCtx.createScriptProcessor(4096, 1, 1);
              
              scriptProcessorRef.current.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                const volume = inputData.reduce((acc, val) => acc + Math.abs(val), 0) / inputData.length;
                setIsUserSpeaking(volume > 0.01);
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              source.connect(scriptProcessorRef.current);
              scriptProcessorRef.current.connect(inCtx.destination);
              setIsReady(true);
            },
            onmessage: async (message: LiveServerMessage) => {
              if (message.serverContent?.outputTranscription) {
                currentTranscriptionRef.current += message.serverContent.outputTranscription.text;
              }
              if (message.serverContent?.inputTranscription) {
                userInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
              }

              const parts = message.serverContent?.modelTurn?.parts;
              if (parts && outputAudioContextRef.current) {
                for (const part of parts) {
                  if (part.inlineData?.data) {
                    const base64Audio = part.inlineData.data;
                    if (outputAudioContextRef.current.state === 'suspended') await outputAudioContextRef.current.resume();
                    setIsModelSpeaking(true);
                    const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                    const now = outputAudioContextRef.current.currentTime;
                    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
                    const source = outputAudioContextRef.current.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputAudioContextRef.current.destination);
                    source.onended = () => sourcesRef.current.delete(source);
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    sourcesRef.current.add(source);
                  }
                }
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsModelSpeaking(false);
              }

              if (message.serverContent?.turnComplete) {
                const userText = userInputTranscriptionRef.current.trim();
                const modelText = currentTranscriptionRef.current.trim();
                setTranscript(prev => {
                  const updated = [...prev];
                  if (userText) updated.push(`You: ${userText}`);
                  if (modelText) {
                    updated.push(`${config.persona.name}: ${modelText}`);
                    setCurrentQuestionIndex(idx => idx + 1);
                  }
                  return updated;
                });
                userInputTranscriptionRef.current = '';
                currentTranscriptionRef.current = '';
                setIsModelSpeaking(false);
              }
            },
            onerror: (e) => console.error('Voice Engine Error:', e),
            onclose: () => console.log('Session Terminated'),
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { 
                prebuiltVoiceConfig: { voiceName: config.persona.voiceName }
              },
            },
            systemInstruction: `CRITICAL OPERATIONAL DIRECTIVE:
            Interviewer: ${config.persona.name}
            Focus Lens: ${config.persona.focus}
            Vertical Umbrella: ${config.inference.umbrella}
            Core Methodology: ${config.inference.methodology}
            
            ROLE SPECIFIC BEHAVIOR:
            ${config.inference.generatedSystemInstruction}
            
            SESSION RULES:
            - Conduct session for exactly ${config.questionCount} questions.
            - Greet the user and ask the first question immediately.`,
            outputAudioTranscription: {},
            inputAudioTranscription: {},
          },
        });
        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error('Failed to init session:', err);
      }
    };
    initSession();
    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    };
  }, [config]);

  const progress = Math.min((currentQuestionIndex / config.questionCount) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-4xl px-4 relative bg-theme-bg">
      <div className="fixed top-0 left-0 w-full h-1 bg-theme-border/20 z-50">
        <div className="h-full bg-theme-accent transition-all duration-700 ease-in-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full z-10">
        <div className="theme-card p-12 flex flex-col items-center justify-center min-h-[400px] shadow-sm">
          {/* Removed unused themeName prop from Visualizer call */}
          <Visualizer isActive={isReady} isModelSpeaking={isModelSpeaking} />
          <div className="mt-12 text-center w-full">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${isModelSpeaking ? 'bg-theme-accent animate-pulse' : 'opacity-20 bg-theme-text'}`} />
              <span className="technical-label">Voice Engine: {isModelSpeaking ? 'Active' : 'Standby'}</span>
            </div>
            <div className="px-4 py-2 bg-theme-text/5 rounded-full inline-block border border-theme-border/50">
               <span className="technical-label opacity-40">Classification: </span>
               <span className="text-[10px] font-black text-theme-text uppercase">{config.inference.umbrella}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="theme-card p-8 border-l-4 border-l-theme-accent bg-theme-card">
            <span className="technical-label text-theme-accent block mb-2">Interviewer Lens</span>
            <h2 className="text-2xl font-black font-theme-heading text-theme-text uppercase tracking-tight">{config.persona.name}</h2>
            <p className="text-theme-text/40 text-[10px] font-bold mt-1 uppercase tracking-widest">{config.persona.focus} // {config.inference.methodology}</p>
          </div>

          <div className="theme-card p-8 grid grid-cols-2 gap-4 bg-theme-card">
            <div>
              <span className="technical-label block mb-1">Depth Units</span>
              <span className="text-xs font-black text-theme-text uppercase tracking-tighter">{Math.min(currentQuestionIndex + 1, config.questionCount)} / {config.questionCount}</span>
            </div>
            <div>
              <span className="technical-label block mb-1">Target Role</span>
              <span className="text-xs font-black text-theme-text uppercase tracking-tighter truncate max-w-[150px]">{config.jobTitle}</span>
            </div>
          </div>

          <button 
            onClick={() => onEnd(transcript)}
            className="w-full bg-theme-card text-theme-text border border-theme-border font-black py-5 uppercase tracking-widest hover:bg-theme-accent hover:text-white transition-all rounded-theme shadow-lg"
          >
            End Interview
          </button>
        </div>
      </div>

      {!isReady && (
        <div className="fixed inset-0 bg-theme-bg flex items-center justify-center z-[100]">
            <div className="text-center p-12 theme-card border-theme-accent/20 bg-theme-card shadow-2xl">
                <div className="w-12 h-12 border-4 border-theme-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-black font-theme-heading text-theme-text uppercase tracking-tighter mb-2">Syncing Engine</h3>
                <p className="technical-label">Deploying Vertical Intelligence Protocols...</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
