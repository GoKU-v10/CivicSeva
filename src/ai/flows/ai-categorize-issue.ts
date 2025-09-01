'use server';

/**
 * @fileOverview This file contains the AI categorization flow for reported issues.
 *
 * - categorizeIssue - A function that takes issue details and returns a categorized issue with a suggested department.
 * - CategorizeIssueInput - The input type for the categorizeIssue function.
 * - CategorizeIssueOutput - The return type for the categorizeIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeIssueInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The user-provided description of the issue.'),
  location: z
    .object({
      latitude: z.number().describe('The latitude of the issue location.'),
      longitude: z.number().describe('The longitude of the issue location.'),
    })
    .describe('The GPS coordinates of the issue.'),
});
export type CategorizeIssueInput = z.infer<typeof CategorizeIssueInputSchema>;

const CategorizeIssueOutputSchema = z.object({
  category: z.string().describe('The AI-determined category of the issue.'),
  suggestedDepartment: z
    .string()
    .describe(
      'The municipal department to which the issue should be routed based on the category.'
    ),
  confidence: z
    .number()
    .describe(
      'A number between 0 and 1 which represents the confidence that the AI has in its categorization.'
    ),
});
export type CategorizeIssueOutput = z.infer<typeof CategorizeIssueOutputSchema>;

export async function categorizeIssue(input: CategorizeIssueInput): Promise<CategorizeIssueOutput> {
  return categorizeIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeIssuePrompt',
  input: {schema: CategorizeIssueInputSchema},
  output: {schema: CategorizeIssueOutputSchema},
  prompt: `You are an AI assistant specializing in categorizing civic issues for a municipal government. Based on the description, photo, and GPS location of the issue, determine the most appropriate category and suggest the relevant department to handle it.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}
Location: Latitude: {{{location.latitude}}}, Longitude: {{{location.longitude}}}

Consider common issue categories such as potholes, graffiti, damaged street signs, water leaks, etc., and departments like Public Works, Sanitation, Transportation, etc.

Please categorize the issue and suggest a department. Also, provide a confidence score (0-1) for your categorization.

Output in the following format:
Category: <issue category>
Suggested Department: <municipal department>
Confidence: <confidence score>`,
});

const categorizeIssueFlow = ai.defineFlow(
  {
    name: 'categorizeIssueFlow',
    inputSchema: CategorizeIssueInputSchema,
    outputSchema: CategorizeIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
