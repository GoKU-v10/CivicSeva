
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
        // For this demo, we'll prepend it to our in-memory array so the details page works on redirect.
        issues.unshift(newIssue);
        
        return { success: true, message: 'Issue reported successfully!', issue: newIssue };

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}


const UpdateIssueSchema = z.object({
    issueId: z.string(),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    photoDataUri: z.string().optional(),
    // We pass the stringified issues from localStorage to the server action
    localIssues: z.string().optional(), 
});

export async function updateIssueAction(formData: FormData) {
    try {
        const validatedData = UpdateIssueSchema.parse({
            issueId: formData.get('issueId'),
            description: formData.get('description'),
            photoDataUri: formData.get('photoDataUri'),
            localIssues: formData.get('localIssues'),
        });
        
        const allIssues = [...issues];
        if (validatedData.localIssues) {
            const parsedLocalIssues = JSON.parse(validatedData.localIssues) as Issue[];
            // Add local issues, avoiding duplicates
            parsedLocalIssues.forEach(localIssue => {
                if (!allIssues.some(i => i.id === localIssue.id)) {
                    allIssues.push(localIssue);
                }
            });
        }

        const issueIndex = allIssues.findIndex(i => i.id === validatedData.issueId);
        
        if(issueIndex === -1) {
            throw new Error("Issue not found");
        }
        
        const issueToUpdate = allIssues[issueIndex];

        if(issueToUpdate.status !== 'Reported') {
            throw new Error("Can only edit issues with 'Reported' status.");
        }

        issueToUpdate.description = validatedData.description;
        issueToUpdate.title = validatedData.description.substring(0, 50) + (validatedData.description.length > 50 ? '...' : '');

        if(validatedData.photoDataUri) {
            issueToUpdate.imageUrl = validatedData.photoDataUri;
            issueToUpdate.images = [{ url: validatedData.photoDataUri, caption: 'Updated user photo' }];
        }
        
        // Add an update to the timeline
        issueToUpdate.updates.push({
            timestamp: new Date().toISOString(),
            status: 'Reported',
            description: 'Issue details updated by citizen.'
        });

        // This only updates the in-memory array for the current request.
        // The client-side logic will handle updating localStorage.
        allIssues[issueIndex] = issueToUpdate;

        return { success: true, issue: issueToUpdate };

    } catch (error) {
        console.error("Update Issue Action Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during update.';
        return { success: false, error: errorMessage };
    }
}
