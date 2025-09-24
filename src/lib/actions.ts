

'use server';

import { z } from 'zod';
import { suggestIssueDescription } from '@/ai/flows/ai-suggest-issue-description';
import { categorizeIssue } from '@/ai/flows/ai-categorize-issue';
import { revalidatePath } from 'next/cache';
import { issues as initialIssues } from './data';
import type { Issue, IssueCategory, IssueImage, IssueStatus } from './types';

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
    localIssues: z.string().optional(),
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
            localIssues: formData.get('localIssues'),
        });

        const userCategory = validatedData.category as IssueCategory;
        const now = new Date().toISOString();

        const newIssue: Issue = {
            id: `IS-${Math.floor(10000 + Math.random() * 90000)}`,
            title: validatedData.description.substring(0, 50) + (validatedData.description.length > 50 ? '...' : ''),
            description: validatedData.description,
            imageUrl: validatedData.photoDataUri,
            imageHint: userCategory.toLowerCase(),
            images: [{ url: validatedData.photoDataUri, caption: 'Before' }],
            location: {
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
                address: validatedData.address || `Lat: ${validatedData.latitude.toFixed(5)}, Lon: ${validatedData.longitude.toFixed(5)}`,
            },
            status: 'Reported',
            category: userCategory,
            priority: 'Medium', // Default priority
            reportedAt: now,
            department: 'Pending Assignment', // Default department
            updates: [
                { timestamp: now, status: 'Reported', description: 'Issue submitted by citizen.' },
            ],
        };
        
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
        
        let allIssues: Issue[] = [...initialIssues];
        if (validatedData.localIssues) {
             const localIssuesParsed: Issue[] = JSON.parse(validatedData.localIssues);
             const issueMap = new Map(allIssues.map(i => [i.id, i]));
             localIssuesParsed.forEach(i => issueMap.set(i.id, i));
             allIssues = Array.from(issueMap.values());
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
            const beforeImageIndex = issueToUpdate.images.findIndex(i => i.caption.toLowerCase().includes('before'));
            if (beforeImageIndex !== -1) {
                issueToUpdate.images[beforeImageIndex].url = validatedData.photoDataUri;
            } else {
                 issueToUpdate.images.push({ url: validatedData.photoDataUri, caption: 'Before' });
            }
        }
        
        issueToUpdate.updates.push({
            timestamp: new Date().toISOString(),
            status: 'Reported',
            description: 'Issue details updated by citizen.'
        });

        allIssues[issueIndex] = issueToUpdate;

        return { success: true, issue: issueToUpdate };

    } catch (error) {
        console.error("Update Issue Action Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during update.';
        return { success: false, error: errorMessage };
    }
}

const UpdateIssueDetailsSchema = z.object({
  issueId: z.string(),
  status: z.custom<IssueStatus>().optional().nullable(),
  department: z.string().optional().nullable(),
  afterPhotoDataUri: z.string().optional().nullable(),
  localIssues: z.string().optional(),
  comments: z.string().optional().nullable(),
});


export async function updateIssueDetailsAction(formData: FormData) {
  try {
    const rawData = {
      issueId: formData.get('issueId'),
      status: formData.get('status'),
      department: formData.get('department'),
      afterPhotoDataUri: formData.get('afterPhotoDataUri'),
      localIssues: formData.get('localIssues'),
      comments: formData.get('comments'),
    };
    
    const validatedData = UpdateIssueDetailsSchema.parse(rawData);

    const { issueId, status, department, afterPhotoDataUri, localIssues: localIssuesJSON, comments } = validatedData;
    
    let allIssues: Issue[] = [...initialIssues];
    if (localIssuesJSON) {
        try {
            const parsedLocalIssues = JSON.parse(localIssuesJSON) as Issue[];
            const issueMap = new Map<string, Issue>();
            
            allIssues.forEach(issue => issueMap.set(issue.id, issue));
            parsedLocalIssues.forEach(issue => issueMap.set(issue.id, issue));

            allIssues = Array.from(issueMap.values());

        } catch (e) {
            console.error("Failed to parse localIssues JSON:", e);
        }
    }

    const issueIndex = allIssues.findIndex((i) => i.id === issueId);
    if (issueIndex === -1) {
      throw new Error(`Issue not found: ${issueId}`);
    }

    const issueToUpdate = { ...allIssues[issueIndex] };
    let updateDescription = '';
    let statusUpdated = false;

    if (department && department !== issueToUpdate.department) {
        issueToUpdate.department = department;
        updateDescription = `Assigned to ${department}.`;
    }

    if (status && status !== issueToUpdate.status) {
        issueToUpdate.status = status;
        if (updateDescription) {
            updateDescription += ` Status updated to ${status}.`
        } else {
            updateDescription = `Status updated to ${status}.`;
        }

        if (status === 'Resolved') {
            issueToUpdate.resolvedAt = new Date().toISOString();
        }
        statusUpdated = true;
    }

     if (afterPhotoDataUri) {
        const afterPhoto: IssueImage = { url: afterPhotoDataUri, caption: 'After' };
        const afterImageIndex = issueToUpdate.images.findIndex(img => img.caption.toLowerCase() === 'after');
        if (afterImageIndex > -1) {
            issueToUpdate.images[afterImageIndex] = afterPhoto;
        } else {
            issueToUpdate.images.push(afterPhoto);
        }
        if (updateDescription) {
            updateDescription += ` Added 'After' photo.`
        } else {
            updateDescription = `Added 'After' photo.`
        }
    }

    if (comments) {
        if(updateDescription) {
            updateDescription += ` Comment: "${comments}"`
        } else {
            updateDescription = `Comment added: "${comments}"`
        }
    }
    
    if(!updateDescription) {
        return { success: true, issue: issueToUpdate };
    }

    issueToUpdate.updates = [...issueToUpdate.updates, {
        timestamp: new Date().toISOString(),
        status: statusUpdated ? status! : issueToUpdate.status,
        description: updateDescription,
    }];
    
    return { success: true, issue: issueToUpdate };

  } catch (error) {
    console.error('Update Issue Details Action Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

const DeleteIssueSchema = z.object({
  issueId: z.string(),
  localIssues: z.string().optional(),
});

export async function deleteIssueAction(formData: FormData) {
    try {
        const issueId = formData.get('issueId') as string;
        
        if (!issueId) {
            throw new Error('Issue ID is required');
        }
        
        // Just return success - the actual deletion is handled by the client-side state update
        // The AdminPage component will handle updating its own state and localStorage
        return { success: true, deletedIssueId: issueId };

    } catch (error) {
        console.error('Delete Issue Action Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}

const DeleteAfterPhotoSchema = z.object({
  issueId: z.string(),
  localIssues: z.string().optional(),
});

export async function deleteAfterPhotoAction(formData: FormData) {
  try {
    const validatedData = DeleteAfterPhotoSchema.parse({
      issueId: formData.get('issueId'),
      localIssues: formData.get('localIssues'),
    });

    const { issueId, localIssues: localIssuesJSON } = validatedData;

    let allIssues: Issue[] = [...initialIssues];
    if (localIssuesJSON) {
      try {
        const parsedLocalIssues = JSON.parse(localIssuesJSON) as Issue[];
        const issueMap = new Map<string, Issue>();
        allIssues.forEach(issue => issueMap.set(issue.id, issue));
        parsedLocalIssues.forEach(issue => issueMap.set(issue.id, issue));
        allIssues = Array.from(issueMap.values());
      } catch (e) {
        console.error("Failed to parse localIssues for photo deletion:", e);
      }
    }

    const issueIndex = allIssues.findIndex((i) => i.id === issueId);
    if (issueIndex === -1) {
      throw new Error(`Issue not found: ${issueId}`);
    }

    const issueToUpdate = { ...allIssues[issueIndex] };
    const afterImageIndex = issueToUpdate.images.findIndex(img => img.caption.toLowerCase() === 'after');

    if (afterImageIndex === -1) {
      throw new Error("'After' photo not found for this issue.");
    }

    issueToUpdate.images.splice(afterImageIndex, 1);

    issueToUpdate.updates = [...issueToUpdate.updates, {
        timestamp: new Date().toISOString(),
        status: issueToUpdate.status,
        description: "Administrator removed the 'After' photo.",
    }];

    return { success: true, issue: issueToUpdate };

  } catch (error) {
    console.error('Delete After Photo Action Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
