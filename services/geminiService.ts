
import { GoogleGenAI, Type } from "@google/genai";
import { Seniority, Persona, FeedbackReport, InferenceResult } from '../types';
import { VERTICAL_KNOWLEDGE } from '../constants';

export async function inferPersona(jobTitle: string, seniority: Seniority, availablePersonas: Persona[], companyUrl?: string): Promise<{ persona: Persona, inference: InferenceResult }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Role: You are the "Verbal" Intelligence Director.
Goal: Implement THE VERTICAL INTERVIEW ENGINE architecture to classify the role and cast the interviewer.

INPUTS:
Job Title: ${jobTitle}
Seniority: ${seniority}
Company: ${companyUrl || 'Not specified'}

ARCHITECTURE RULES:
1. BOX 1 (CLASSIFICATION): Categorize the role into one of: Technical & Systems, Human & Social, Commercial & Growth, Strategic & Governance, Operational & Tactical.
2. BOX 2 (METHODOLOGY): Assign the corresponding Framework: First Principles, STAR/Behavioral, Revenue Diagnostic, Case Study, or Stress-Simulation.
3. BOX 3 (PERSONA): Select the specific Interviewer from the library based on their lens:
   - Sarah: Alignment/EQ (Human & Social)
   - Claire: Forensic/Logic (Technical & Systems)
   - James: ROI/Economics (Commercial & Growth)
   - David: Resilience/Skeptic (Operational & Tactical)
   - Thomas: Strategy/Scale (Strategic & Governance)

Persona Library: ${JSON.stringify(availablePersonas.map(p => ({ id: p.id, name: p.name, focus: p.focus })))}

Return a JSON object containing the classification details and the comprehensive system instruction for the Voice AI. Ensure the instruction explicitly tells the AI which Methodology to use.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest', 
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          umbrella: { type: Type.STRING },
          methodology: { type: Type.STRING },
          selectedPersona: { type: Type.STRING },
          industryInference: { type: Type.STRING },
          pressureScore: { type: Type.NUMBER },
          focusPillars: { type: Type.ARRAY, items: { type: Type.STRING } },
          generatedSystemInstruction: { type: Type.STRING, description: "The full operational prompt for the Voice AI interviewer." }
        },
        required: ["umbrella", "methodology", "selectedPersona", "industryInference", "pressureScore", "focusPillars", "generatedSystemInstruction"]
      }
    }
  });

  const inference: InferenceResult = JSON.parse(response.text);
  const persona = availablePersonas.find(p => p.name === inference.selectedPersona) || availablePersonas[0];
  
  return { persona, inference };
}

export async function generateFeedback(transcript: string[], jobTitle: string, persona: Persona): Promise<FeedbackReport> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const userLines = transcript.filter(line => line.startsWith('You:'));
  const hasUserSpoken = userLines.length > 0;
  const totalWords = userLines.join(' ').split(/\s+/).length;

  if (!hasUserSpoken || totalWords < 5) {
    return {
      overallScore: 0,
      summary: "NO SIGNAL DETECTED. The session was terminated without significant candidate input.",
      axes: [
        { axis: "Composure", score: 0, explanation: "Failure to engage." },
        { axis: "Clarity", score: 0, explanation: "No verbal data." },
        { axis: "Empathy", score: 0, explanation: "No social interaction." },
        { axis: "Rule Adherence", score: 0, explanation: "Protocol violated." },
        { axis: "Accountability", score: 0, explanation: "Zero ownership." }
      ],
      tips: ["Ensure mic is active.", "Answer questions directly.", "Follow protocols."],
      transcript: transcript
    };
  }

  const prompt = `Perform a high-stakes audit of this transcript for the role of ${jobTitle}.
  The interviewer was ${persona.name} using the Vertical Interview Engine protocols.
  
  Transcript:
  ${transcript.join('\n')}
  
  ${VERTICAL_KNOWLEDGE}
  
  Evaluate against industry-standard benchmarks for ${jobTitle}. Use the 5 axes: Composure, Clarity, Empathy, Rule Adherence, Accountability.`;

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          axes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                axis: { type: Type.STRING },
                score: { type: Type.NUMBER },
                explanation: { type: Type.STRING }
              },
              required: ['axis', 'score', 'explanation']
            }
          },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['overallScore', 'summary', 'axes', 'tips']
      }
    }
  });

  const data = JSON.parse(response.text);
  return { ...data, transcript };
}
