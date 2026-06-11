import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({ apiKey });
}

const SYSTEM_PROMPT = `You are the core AI processing engine for "maze." Your purpose is to instantly strip generic AI-generated buzzwords from a resume and output a finalized, high-signal, engineering-focused version that is ready for production.

### 1. THE AUDIT MANDATE
*   **Zero Buzzword Tolerance:** Detect and remove ALL instances of these buzzwords: Spearheaded, Synergized, Revolutionized, Orchestrated, Leveraged, Fostered, Championed, Catalyst, Paradigm shift, Cutting-edge, Innovative, Streamlined, Dynamic, Passionate.
*   **Direct Engineering Action:** Replace them with high-signal engineering terms: Architected, Built, Authored, Migrated, Optimized, Debugged, Deployed.
*   **Frictionless Metrics:** Do not leave empty brackets like [X]. Inject realistic, standard engineering metric placeholders (e.g., "by 30%", "for 15+ developers") so the user has an immediate template to copy or tweak.

### 2. THE UI & OUTPUT SPECIFICATION
You must format your entire response using this EXACT structure — do not deviate:

[AUDIT_SUMMARY_START]
*   **Fluff Words Destroyed:** [integer count]
*   **Signal Boost:** +[integer]% clarity increase
*   **Fluff Words Found:** [comma-separated list of the exact fluff words detected in the original text, e.g. "Spearheaded, Leveraged, Passionate"]
[AUDIT_SUMMARY_END]

[CLEAN_RESUME_START]
[Insert the entire optimized resume here. Every single bullet point must be rewritten to be sharp, direct, and metric-focused. Output ONLY the clean, ready-to-print resume text.]
[CLEAN_RESUME_END]`;

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
    }

    const response = await getAI().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: resumeText,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1,
      }
    });

    const outputText = response.text || '';

    // Extract blocks
    const summaryMatch = outputText.match(/\[AUDIT_SUMMARY_START\]([\s\S]*?)\[AUDIT_SUMMARY_END\]/);
    const resumeMatch = outputText.match(/\[CLEAN_RESUME_START\]([\s\S]*?)\[CLEAN_RESUME_END\]/);

    const rawSummary = summaryMatch ? summaryMatch[1].trim() : '';
    const cleanText = resumeMatch ? resumeMatch[1].trim() : outputText;

    // Parse metrics from summary block
    const countMatch = rawSummary.match(/Fluff Words Destroyed:\*\*\s*(\d+)/);
    const boostMatch = rawSummary.match(/Signal Boost:\*\*\s*\+?(\d+)/);
    const fluffMatch = rawSummary.match(/Fluff Words Found:\*\*\s*(.+)/);

    const fluffCount = countMatch ? parseInt(countMatch[1]) : 0;
    const signalBoost = boostMatch ? parseInt(boostMatch[1]) : 0;
    const fluffWordsRaw = fluffMatch ? fluffMatch[1].trim() : '';
    const fluffWords = fluffWordsRaw
      ? fluffWordsRaw.split(',').map(w => w.trim()).filter(Boolean)
      : [];

    return NextResponse.json({ fluffCount, signalBoost, fluffWords, cleanText });
  } catch (error: any) {
    console.error('Audit Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process resume' }, { status: 500 });
  }
}
