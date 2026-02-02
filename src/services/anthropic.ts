import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;

export function initializeAnthropic(apiKey: string): Anthropic {
  anthropicClient = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // For local demo only - NOT for production
  });
  return anthropicClient;
}

export function getAnthropic(): Anthropic {
  if (!anthropicClient) {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }
    anthropicClient = initializeAnthropic(apiKey);
  }
  return anthropicClient;
}
