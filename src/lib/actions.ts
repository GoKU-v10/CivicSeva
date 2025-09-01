'use server';

import { z } from 'zod';
import { suggestIssueDescription } from '@/ai/flows/ai-suggest-issue-description';
import { categorizeIssue } from '@/ai/flows/ai-categorize-issue';
import { revalidatePath } from 'next/cache';

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
});


export async function createIssueAction(formData: FormData) {
    try {
        const validatedData = CreateIssueSchema.parse({
            description: formData.get('description'),
            photoDataUri: formData.get('photoDataUri'),
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude'),
        });

        const categorization = await categorizeIssue({
            description: validatedData.description,
            photoDataUri: validatedData.photoDataUri,
            location: {
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
            },
        });

        // In a real app, you would save this to a database.
        // For this demo, we'll just log it.
        console.log('New issue created and categorized:', {
            ...validatedData,
            ...categorization,
        });

        revalidatePath('/');
        revalidatePath('/dashboard/my-issues');
        revalidatePath('/admin');
        
        return { success: true, message: 'Issue reported successfully!' };

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}
