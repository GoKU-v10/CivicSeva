// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview An AI agent to suggest an issue description based on image and location data.
 *
 * - suggestIssueDescription - A function that handles the issue description suggestion process.
 * - SuggestIssueDescriptionInput - The input type for the suggestIssueDescription function.
 * - SuggestIssueDescriptionOutput - The return type for the suggestIssueDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIssueDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  locationData: z.string().describe('The GPS location data of the issue.'),
});
export type SuggestIssueDescriptionInput = z.infer<typeof SuggestIssueDescriptionInputSchema>;

const SuggestIssueDescriptionOutputSchema = z.object({
  suggestedDescription: z
    .string()
    .describe('A suggested description of the issue based on the image and location data.'),
});
export type SuggestIssueDescriptionOutput = z.infer<typeof SuggestIssueDescriptionOutputSchema>;

export async function suggestIssueDescription(
  input: SuggestIssueDescriptionInput
): Promise<SuggestIssueDescriptionOutput> {
  return suggestIssueDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIssueDescriptionPrompt',
  input: {schema: SuggestIssueDescriptionInputSchema},
  output: {schema: SuggestIssueDescriptionOutputSchema},
  prompt: `You are an AI assistant designed to help citizens quickly report issues to their local government.

  Based on the provided image and location data, suggest a concise and informative description of the issue.

  Here is the location data: {{{locationData}}}

  Here is the issue photo: {{media url=photoDataUri}}

  Please provide a description of the issue. Focus on the key details visible in the image and relevant to the location.
  The description should be no more than 2 sentences long.
  Do not include any introductory or concluding phrases like "Based on the image..." or "In conclusion...".  Just output the description.
  Do not include any personally identifiable information in the suggested description.
  `,
});

const suggestIssueDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestIssueDescriptionFlow',
    inputSchema: SuggestIssueDescriptionInputSchema,
    outputSchema: SuggestIssueDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
