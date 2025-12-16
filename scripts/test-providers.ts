/**
 * Multi-Provider LLM Comparison Test
 * Tests Anthropic, OpenAI, xAI (Grok), and Google Gemini for business brainlift grading
 */

import { config } from 'dotenv';
config(); // Load .env file

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Test prompt - a simplified grading task
const TEST_SECTION = `
**Business Overview**
- **One-Liner Memo:** StudySync AI helps students study 2x faster with AI-powered personalized questions.
- **30-Second Elevator Pitch:** Students waste 60% of study time on material they already know. We fix that with AI targeting weak spots. 23 paying users at $15/month, 847 waitlist.

**Strategic Overview**
- **What Are You Selling:** AI study assistant creating personalized practice from uploaded notes
- **Who Pays And Why:** High school students (14-18) and parents spending $2000+/year on tutoring
- **Problem/Solution:** Generic study materials don't adapt. Our AI identifies weak spots.
- **Business Model:** $20/month subscription, premium packs $29 each
- **Business-Founder Fit:** Built MVP, scored 5s on 4 APs while cutting study time 40%
`;

const GRADING_PROMPT = `You are an expert entrepreneurship mentor grading a teen founder's business plan section.

Grade this "Business Vision & Strategy" section on a scale of 0-10:
- Thoroughness (0-5): Depth and completeness
- Viability (0-5): Proof of real business potential

Apply YC principles:
- Is this a "painkiller" or "vitamin"?
- Is there evidence of real demand?
- Is the founder-market fit clear?

SECTION TO GRADE:
${TEST_SECTION}

Respond in JSON format:
{
  "thoroughnessScore": <0-5>,
  "viabilityScore": <0-5>,
  "totalScore": <0-10>,
  "analysis": "<2-3 sentence assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "ycPrinciples": {
    "painkillerOrVitamin": "<painkiller|vitamin|mixed>",
    "demandEvidence": "<strong|moderate|weak>",
    "founderMarketFit": "<strong|moderate|weak>"
  }
}`;

interface ProviderResult {
  provider: string;
  model: string;
  success: boolean;
  latencyMs: number;
  response?: string;
  parsed?: Record<string, unknown>;
  error?: string;
}

async function testAnthropic(): Promise<ProviderResult> {
  const start = Date.now();
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: GRADING_PROMPT }],
    });
    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return {
      provider: 'Anthropic',
      model: 'claude-sonnet-4-20250514',
      success: true,
      latencyMs: Date.now() - start,
      response: text,
      parsed: jsonMatch ? JSON.parse(jsonMatch[0]) : undefined,
    };
  } catch (error) {
    return {
      provider: 'Anthropic',
      model: 'claude-sonnet-4-20250514',
      success: false,
      latencyMs: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function testOpenAI(): Promise<ProviderResult> {
  const start = Date.now();
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1024,
      messages: [{ role: 'user', content: GRADING_PROMPT }],
    });
    const text = completion.choices[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return {
      provider: 'OpenAI',
      model: 'gpt-4o',
      success: true,
      latencyMs: Date.now() - start,
      response: text,
      parsed: jsonMatch ? JSON.parse(jsonMatch[0]) : undefined,
    };
  } catch (error) {
    return {
      provider: 'OpenAI',
      model: 'gpt-4o',
      success: false,
      latencyMs: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function testXAI(): Promise<ProviderResult> {
  const start = Date.now();
  try {
    // xAI uses OpenAI-compatible API
    const client = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    });
    const completion = await client.chat.completions.create({
      model: 'grok-3', // Latest model as of Dec 2025
      max_tokens: 1024,
      messages: [{ role: 'user', content: GRADING_PROMPT }],
    });
    const text = completion.choices[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return {
      provider: 'xAI',
      model: 'grok-3',
      success: true,
      latencyMs: Date.now() - start,
      response: text,
      parsed: jsonMatch ? JSON.parse(jsonMatch[0]) : undefined,
    };
  } catch (error) {
    return {
      provider: 'xAI',
      model: 'grok-3',
      success: false,
      latencyMs: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function testGemini(modelName: string): Promise<ProviderResult> {
  const start = Date.now();
  try {
    // Gemini uses REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: GRADING_PROMPT }] }],
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || JSON.stringify(data));
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return {
      provider: 'Google Gemini',
      model: modelName,
      success: true,
      latencyMs: Date.now() - start,
      response: text,
      parsed: jsonMatch ? JSON.parse(jsonMatch[0]) : undefined,
    };
  } catch (error) {
    return {
      provider: 'Google Gemini',
      model: modelName,
      success: false,
      latencyMs: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function evaluateResponse(result: ProviderResult): {
  jsonCompliance: number;
  ycAlignment: number;
  feedbackQuality: number;
  overall: number;
} {
  if (!result.success || !result.parsed) {
    return { jsonCompliance: 0, ycAlignment: 0, feedbackQuality: 0, overall: 0 };
  }

  const p = result.parsed;
  
  // JSON Compliance (0-100): Did it follow the schema?
  let jsonCompliance = 0;
  if (typeof p.thoroughnessScore === 'number') jsonCompliance += 15;
  if (typeof p.viabilityScore === 'number') jsonCompliance += 15;
  if (typeof p.totalScore === 'number') jsonCompliance += 10;
  if (typeof p.analysis === 'string' && p.analysis.length > 20) jsonCompliance += 15;
  if (Array.isArray(p.strengths) && p.strengths.length >= 2) jsonCompliance += 15;
  if (Array.isArray(p.improvements) && p.improvements.length >= 2) jsonCompliance += 15;
  if (p.ycPrinciples && typeof p.ycPrinciples === 'object') jsonCompliance += 15;

  // YC Alignment (0-100): Did it apply YC principles?
  let ycAlignment = 0;
  const yc = p.ycPrinciples as Record<string, string> | undefined;
  if (yc) {
    if (['painkiller', 'vitamin', 'mixed'].includes(yc.painkillerOrVitamin)) ycAlignment += 35;
    if (['strong', 'moderate', 'weak'].includes(yc.demandEvidence)) ycAlignment += 35;
    if (['strong', 'moderate', 'weak'].includes(yc.founderMarketFit)) ycAlignment += 30;
  }

  // Feedback Quality (0-100): Are improvements actionable?
  let feedbackQuality = 0;
  const improvements = p.improvements as string[] | undefined;
  if (improvements) {
    for (const imp of improvements) {
      if (typeof imp === 'string' && imp.length > 30) feedbackQuality += 25;
    }
  }
  const strengths = p.strengths as string[] | undefined;
  if (strengths) {
    for (const str of strengths) {
      if (typeof str === 'string' && str.length > 20) feedbackQuality += 25;
    }
  }
  feedbackQuality = Math.min(100, feedbackQuality);

  const overall = Math.round((jsonCompliance + ycAlignment + feedbackQuality) / 3);

  return { jsonCompliance, ycAlignment, feedbackQuality, overall };
}

async function main() {
  console.log('🧪 Multi-Provider LLM Comparison Test');
  console.log('=====================================\n');
  console.log('Testing each provider with a business brainlift grading task...\n');

  const results: ProviderResult[] = [];

  // Test all providers in parallel
  console.log('⏳ Running tests in parallel...\n');
  const [anthropic, openai, xai, gemini2Flash, gemini25Pro, gemini3Pro] = await Promise.all([
    testAnthropic(),
    testOpenAI(),
    testXAI(),
    testGemini('gemini-2.0-flash-exp'),
    testGemini('gemini-2.5-pro'), // Gemini 2.5 Pro
    testGemini('gemini-3-pro-preview'), // Gemini 3 Pro - Released Nov 2025
  ]);

  results.push(anthropic, openai, xai, gemini2Flash, gemini25Pro, gemini3Pro);

  // Display results
  console.log('📊 RESULTS\n');
  console.log('─'.repeat(80));

  for (const result of results) {
    const evaluation = evaluateResponse(result);
    
    console.log(`\n${result.success ? '✅' : '❌'} ${result.provider} (${result.model})`);
    console.log(`   Latency: ${result.latencyMs}ms`);
    
    if (result.success && result.parsed) {
      const p = result.parsed;
      console.log(`   Scores: Thoroughness ${p.thoroughnessScore}/5, Viability ${p.viabilityScore}/5, Total ${p.totalScore}/10`);
      console.log(`   Analysis: ${p.analysis}`);
      
      const yc = p.ycPrinciples as Record<string, string>;
      if (yc) {
        console.log(`   YC Principles: ${yc.painkillerOrVitamin} | Demand: ${yc.demandEvidence} | Fit: ${yc.founderMarketFit}`);
      }
      
      console.log(`\n   Strengths:`);
      (p.strengths as string[])?.forEach((s, i) => console.log(`      ${i+1}. ${s}`));
      
      console.log(`\n   Improvements:`);
      (p.improvements as string[])?.forEach((s, i) => console.log(`      ${i+1}. ${s}`));
      
      console.log(`\n   📈 Evaluation Scores:`);
      console.log(`      JSON Compliance: ${evaluation.jsonCompliance}/100`);
      console.log(`      YC Alignment: ${evaluation.ycAlignment}/100`);
      console.log(`      Feedback Quality: ${evaluation.feedbackQuality}/100`);
      console.log(`      OVERALL: ${evaluation.overall}/100`);
    } else if (result.success && !result.parsed) {
      console.log(`   ⚠️ Failed to parse JSON from response`);
      console.log(`   Raw response (first 500 chars): ${result.response?.substring(0, 500)}...`);
    } else if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    console.log('─'.repeat(80));
  }

  // Summary comparison
  console.log('\n📋 SUMMARY COMPARISON\n');
  console.log('Provider          | Model                  | Status | Latency | Overall Score');
  console.log('─'.repeat(80));
  
  const sorted = results
    .map(r => ({ ...r, evaluation: evaluateResponse(r) }))
    .sort((a, b) => b.evaluation.overall - a.evaluation.overall);

  for (const r of sorted) {
    const status = r.success ? '✅' : '❌';
    const latency = `${r.latencyMs}ms`.padEnd(8);
    const score = r.success ? `${r.evaluation.overall}/100` : 'N/A';
    console.log(`${r.provider.padEnd(17)} | ${r.model.padEnd(22)} | ${status}     | ${latency} | ${score}`);
  }

  console.log('\n🏆 RECOMMENDATION FOR BUSINESS BRAINLIFT GRADING:');
  const best = sorted.find(r => r.success);
  if (best) {
    console.log(`   Best performer: ${best.provider} (${best.model})`);
    console.log(`   - Overall Score: ${best.evaluation.overall}/100`);
    console.log(`   - Latency: ${best.latencyMs}ms`);
  }
}

main().catch(console.error);

