
'use server';

import { z } from 'zod';
import { suggestIssueDescription } from '@/ai/flows/ai-suggest-issue-description';
import { categorizeIssue } from '@/ai/flows/ai-categorize-issue';
import { revalidatePath } from 'next/cache';
import { issues } from './data';
import type { Issue, IssueCategory } from './types';

const SuggestDescriptionSchema = z.object({
  photoDataUri: z.string(),
  locationData: z.string(),
});

export async function suggestDescriptionAction(formData: FormData) {
  try {
    const validatedData = SuggestDescriptionSchema.parse({
      photoDataUri: formData.get('photoDataUri'),
      locationData: formData.get('locationData'),
    });

    const result = await suggestIssueDescription(validatedData);
    return { success: true, description: result.suggestedDescription };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

const CreateIssueSchema = z.object({
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    photoDataUri: z.string().min(1, 'Please upload a photo.'),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    category: z.string(),
    address: z.string(),
});


export async function createIssueAction(formData: FormData) {
    try {
        const validatedData = CreateIssueSchema.parse({
            description: formData.get('description'),
            photoDataUri: formData.get('photoDataUri'),
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude'),
            category: formData.get('category'),
            address: formData.get('address'),
        });

        // For the prototype, we'll use the user-selected category.
        // In a real app, you might use the AI categorization as a suggestion
        // or for backend routing.
        const userCategory = validatedData.category as IssueCategory;

        const newIssue: Issue = {
            id: `IS-${Math.floor(10000 + Math.random() * 90000)}`,
            title: validatedData.description.substring(0, 50) + (validatedData.description.length > 50 ? '...' : ''),
            description: validatedData.description,
            imageUrl: validatedData.photoDataUri,
            imageHint: userCategory.toLowerCase(),
            images: [{ url: validatedData.photoDataUri, caption: 'User submitted photo' }],
            location: {
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
                address: validatedData.address || 'Address not provided',
            },
            status: 'Reported',
            category: userCategory,
            priority: 'Medium', // Default priority
            reportedAt: new Date().toISOString(),
            department: 'Pending Assignment', // Default department
            updates: [
                { timestamp: new Date().toISOString(), status: 'Reported', description: 'Issue submitted by citizen.' },
            ],
        };

        // In a real app, you would save this to a database.
        // For this demo, we'll prepend it to our in-memory array.
        issues.unshift(newIssue);
        
        // No need to revalidate since we are managing state on the client for now
        // revalidatePath('/track');

        return { success: true, message: 'Issue reported successfully!', issue: newIssue };

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}
