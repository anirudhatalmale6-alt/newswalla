import { env } from '../config/env';
import { getSetting } from './settings.service';

interface AIGenerateOptions {
  topic: string;
  platform?: string;
  tone?: string;
  maxLength?: number;
}

function getAnthropicKey(): string | null {
  return env.ANTHROPIC_API_KEY || getSetting('anthropic_api_key') || null;
}

function getOpenAIKey(): string | null {
  return env.OPENAI_API_KEY || getSetting('openai_api_key') || null;
}

export async function generateCaption(options: AIGenerateOptions): Promise<string> {
  if (getAnthropicKey()) {
    return generateWithClaude(options, 'caption');
  }
  if (getOpenAIKey()) {
    return generateWithOpenAI(options, 'caption');
  }
  throw Object.assign(new Error('No AI API key configured'), { status: 503 });
}

export async function generateHashtags(content: string, platform?: string): Promise<string[]> {
  const prompt = `Generate 10-15 relevant hashtags for this social media post${platform ? ` on ${platform}` : ''}. Return only the hashtags, one per line, with the # symbol.\n\nPost: ${content}`;

  let response: string;
  if (getAnthropicKey()) {
    response = await callClaude(prompt);
  } else if (getOpenAIKey()) {
    response = await callOpenAI(prompt);
  } else {
    throw Object.assign(new Error('No AI API key configured'), { status: 503 });
  }

  return response
    .split('\n')
    .map(h => h.trim())
    .filter(h => h.startsWith('#'))
    .slice(0, 15);
}

export async function rewriteContent(content: string, style: string): Promise<string> {
  const prompt = `Rewrite this social media post in a ${style} tone. Keep the core message but make it more engaging. Return only the rewritten text.\n\nOriginal: ${content}`;

  if (getAnthropicKey()) return callClaude(prompt);
  if (getOpenAIKey()) return callOpenAI(prompt);
  throw Object.assign(new Error('No AI API key configured'), { status: 503 });
}

async function generateWithClaude(options: AIGenerateOptions, type: string): Promise<string> {
  const prompt = buildPrompt(options, type);
  return callClaude(prompt);
}

async function generateWithOpenAI(options: AIGenerateOptions, type: string): Promise<string> {
  const prompt = buildPrompt(options, type);
  return callOpenAI(prompt);
}

function buildPrompt(options: AIGenerateOptions, type: string): string {
  const platformNote = options.platform ? ` for ${options.platform}` : '';
  const toneNote = options.tone ? ` in a ${options.tone} tone` : '';
  const lengthNote = options.maxLength ? ` Keep it under ${options.maxLength} characters.` : '';

  return `Write a compelling social media ${type}${platformNote}${toneNote} about: ${options.topic}.${lengthNote} Return only the post text, no quotes or explanations.`;
}

async function callClaude(prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': getAnthropicKey()!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data: any = await response.json();
  return data.content?.[0]?.text || '';
}

async function callOpenAI(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getOpenAIKey()}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    }),
  });
  const data: any = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
