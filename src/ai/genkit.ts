import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
  })],
  model: 'googleai/gemini-2.5-flash',
});

// Validate API key configuration
if (!process.env.GOOGLE_GENAI_API_KEY) {
  console.warn('⚠️  GOOGLE_GENAI_API_KEY not found. AI features will not work.');
  console.warn('📝 Please add your Google AI API key to environment variables.');
  console.warn('   - Local: Add to .env.local file');
  console.warn('   - Production: Add to deployment platform environment variables');
}
