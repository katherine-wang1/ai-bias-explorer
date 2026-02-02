import { getAnthropic } from './anthropic';
import { ANSWERER_SYSTEM_PROMPT, CRITIC_SYSTEM_PROMPT } from './prompt-templates';
import { StructuredCritique, BiasSegment } from '../types';

const MODEL = 'claude-sonnet-4-5-20250929';

/**
 * LLM #1: The Answerer
 * Provides a typical AI response to the user's question
 */
export async function callAnswererLLM(question: string): Promise<string> {
  try {
    const anthropic = getAnthropic();

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      temperature: 0.7,
      system: ANSWERER_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: question
        }
      ]
    });

    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    return textContent.text;
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error('Invalid API key. Please check your Anthropic API key.');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    } else if (error.status === 400) {
      throw new Error('Invalid request. Please try a different question.');
    } else {
      throw new Error(`API error: ${error.message || 'Unknown error occurred'}`);
    }
  }
}

/**
 * Finds the start and end indices of a text segment within the original response
 */
function findTextIndices(originalResponse: string, segmentText: string): { start: number; end: number } {
  // Try exact match first
  let start = originalResponse.indexOf(segmentText);

  if (start !== -1) {
    return { start, end: start + segmentText.length };
  }

  // Try fuzzy match with normalized whitespace
  const normalizedResponse = originalResponse.replace(/\s+/g, ' ');
  const normalizedSegment = segmentText.replace(/\s+/g, ' ');
  start = normalizedResponse.indexOf(normalizedSegment);

  if (start !== -1) {
    // Map back to original indices (approximate)
    return { start, end: start + normalizedSegment.length };
  }

  // Fallback: try first few words
  const firstWords = segmentText.split(/\s+/).slice(0, 5).join(' ');
  start = originalResponse.indexOf(firstWords);

  if (start !== -1) {
    return { start, end: start + segmentText.length };
  }

  // If all fails, return -1 to indicate not found
  return { start: -1, end: -1 };
}

/**
 * Parses the structured critique JSON from the LLM response
 */
function parseStructuredCritique(jsonText: string, originalResponse: string): StructuredCritique {
  try {
    // Extract JSON from markdown code blocks if present
    let cleanedJson = jsonText.trim();
    const jsonMatch = cleanedJson.match(/```json\s*\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      cleanedJson = jsonMatch[1];
    } else if (cleanedJson.startsWith('```') && cleanedJson.endsWith('```')) {
      cleanedJson = cleanedJson.slice(3, -3).trim();
    }

    const parsed = JSON.parse(cleanedJson);

    // Validate structure
    if (!parsed.segments || !Array.isArray(parsed.segments)) {
      throw new Error('Invalid structure: missing segments array');
    }

    // Process segments and find text indices
    const segments: BiasSegment[] = parsed.segments.map((seg: any, index: number) => {
      const { start, end } = findTextIndices(originalResponse, seg.text);

      return {
        id: `segment-${index}`,
        text: seg.text,
        issueType: seg.issueType,
        severity: seg.severity,
        shortLabel: seg.shortLabel,
        detailedAnalysis: seg.detailedAnalysis,
        startIndex: start,
        endIndex: end
      };
    });

    return {
      segments,
      overallSummary: parsed.overallSummary || '',
      positiveAspects: parsed.positiveAspects || ''
    };
  } catch (error: any) {
    console.error('Failed to parse structured critique:', error);
    // Return empty structure on parse failure
    return {
      segments: [],
      overallSummary: 'Failed to parse critique response',
      positiveAspects: ''
    };
  }
}

/**
 * Formats a structured critique as text for backward compatibility
 */
export function formatCritiqueAsText(critique: StructuredCritique): string {
  let text = '';

  if (critique.segments.length > 0) {
    text += '## Identified Issues\n\n';
    critique.segments.forEach((segment, index) => {
      text += `**${index + 1}. ${segment.shortLabel}** (${segment.severity} severity)\n`;
      text += `> "${segment.text}"\n\n`;
      text += `${segment.detailedAnalysis}\n\n`;
    });
  }

  if (critique.overallSummary) {
    text += '## Overall Summary\n\n';
    text += `${critique.overallSummary}\n\n`;
  }

  if (critique.positiveAspects) {
    text += '## Positive Aspects\n\n';
    text += `${critique.positiveAspects}\n\n`;
  }

  return text;
}

/**
 * LLM #2: The Critic
 * Analyzes the original question and answer for biases and missing perspectives
 * Returns structured critique with specific segments
 */
export async function callCriticLLM(question: string, answer: string): Promise<StructuredCritique> {
  try {
    const anthropic = getAnthropic();

    const criticalPrompt = `Original Question: "${question}"

AI Assistant's Response:
"""
${answer}
"""

Please provide your critical analysis in JSON format as specified.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      temperature: 0.3,
      system: CRITIC_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: criticalPrompt
        }
      ]
    });

    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    return parseStructuredCritique(textContent.text, answer);
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error('Invalid API key. Please check your Anthropic API key.');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    } else if (error.status === 400) {
      throw new Error('Invalid request. Please try a different question.');
    } else {
      throw new Error(`API error: ${error.message || 'Unknown error occurred'}`);
    }
  }
}
