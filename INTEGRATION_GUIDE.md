# Frontend-Backend Integration Guide

This guide explains how to integrate the CivicSeva Next.js frontend with the Spring Boot backend to create a full-stack application.

## Backend Setup

1. **Start the Backend Server**
   ```bash
   cd civicseva-backend
   ./start.sh
   # OR manually:
   # mvn spring-boot:run
   ```

2. **Verify Backend is Running**
   - Backend will start on: `http://localhost:8080`
   - API endpoints available at: `http://localhost:8080/api`
   - H2 Database console: `http://localhost:8080/api/h2-console`

## Frontend Integration

### Step 1: Update Frontend API Configuration

Create a new file `src/lib/api.ts` in your frontend:

```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = {
  // Issues
  getIssues: async () => {
    const response = await fetch(`${API_BASE_URL}/issues`);
    if (!response.ok) throw new Error('Failed to fetch issues');
    return response.json();
  },

  getIssueById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`);
    if (!response.ok) throw new Error('Failed to fetch issue');
    return response.json();
  },

  createIssue: async (issueData: any) => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueData)
    });
    if (!response.ok) throw new Error('Failed to create issue');
    return response.json();
  },

  updateIssue: async (id: string, issueData: any) => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueData)
    });
    if (!response.ok) throw new Error('Failed to update issue');
    return response.json();
  },

  updateIssueStatus: async (id: string, status: string, comments?: string, afterPhotoUrl?: string) => {
    const params = new URLSearchParams({ status });
    if (comments) params.append('comments', comments);
    if (afterPhotoUrl) params.append('afterPhotoUrl', afterPhotoUrl);
    
    const response = await fetch(`${API_BASE_URL}/issues/${id}/status?${params}`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to update issue status');
    return response.json();
  },

  getIssuesNearby: async (latitude: number, longitude: number, radiusKm: number = 5) => {
    const response = await fetch(
      `${API_BASE_URL}/issues/nearby?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`
    );
    if (!response.ok) throw new Error('Failed to fetch nearby issues');
    return response.json();
  },

  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/issues/statistics`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  }
};
```

### Step 2: Update Your Actions File

Replace the existing `src/lib/actions.ts` with backend integration:

```typescript
'use server';

import { z } from 'zod';
import { api } from './api';
import type { Issue, IssueCategory, IssueStatus } from './types';

const CreateIssueSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    imageUrl: z.string().optional(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    category: z.string(),
    address: z.string(),
    priority: z.string().optional(),
    department: z.string().optional(),
});

export async function createIssueAction(formData: FormData) {
    try {
        const validatedData = CreateIssueSchema.parse({
            title: formData.get('title') || formData.get('description')?.toString().substring(0, 50),
            description: formData.get('description'),
            imageUrl: formData.get('photoDataUri'),
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude'),
            category: formData.get('category'),
            address: formData.get('address'),
            priority: 'Medium',
            department: 'Pending Assignment'
        });

        const response = await api.createIssue(validatedData);
        return response;

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}

export async function updateIssueAction(formData: FormData) {
    try {
        const issueId = formData.get('issueId') as string;
        const validatedData = CreateIssueSchema.parse({
            title: formData.get('title') || formData.get('description')?.toString().substring(0, 50),
            description: formData.get('description'),
            imageUrl: formData.get('photoDataUri'),
            latitude: 0, // You might want to handle this differently
            longitude: 0,
            category: formData.get('category') || 'Other',
            address: 'Updated via form'
        });

        const response = await api.updateIssue(issueId, validatedData);
        return response;

    } catch (error) {
        console.error("Update Issue Action Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during update.';
        return { success: false, error: errorMessage };
    }
}

export async function updateIssueDetailsAction(formData: FormData) {
    try {
        const issueId = formData.get('issueId') as string;
        const status = formData.get('status') as string;
        const comments = formData.get('comments') as string;
        const afterPhotoUrl = formData.get('afterPhotoDataUri') as string;

        const response = await api.updateIssueStatus(issueId, status, comments, afterPhotoUrl);
        return response;

    } catch (error) {
        console.error("Update Issue Details Action Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}

// Helper function to fetch all issues
export async function getIssuesAction() {
    try {
        const issues = await api.getIssues();
        return { success: true, issues };
    } catch (error) {
        console.error("Get Issues Action Error:", error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch issues' };
    }
}
```

### Step 3: Update Environment Variables

Add to your `.env.local` file in the frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Step 4: Update Data Fetching Components

Update components that fetch data to use the backend:

```typescript
// Example: Update your dashboard page
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const issuesData = await api.getIssues();
        setIssues(issuesData);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Your dashboard content */}
      {issues.map(issue => (
        <div key={issue.id}>{issue.title}</div>
      ))}
    </div>
  );
}
```

## Running the Full Stack

1. **Start Backend**
   ```bash
   cd civicseva-backend
   ./start.sh
   ```

2. **Start Frontend** (in a new terminal)
   ```bash
   cd .. # go back to main project directory
   npm run dev
   ```

3. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080/api`
   - Database Console: `http://localhost:8080/api/h2-console`

## API Testing

You can test the API endpoints using curl:

```bash
# Get all issues
curl http://localhost:8080/api/issues

# Get specific issue
curl http://localhost:8080/api/issues/IS-1

# Create new issue
curl -X POST http://localhost:8080/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Issue",
    "description": "This is a test issue from API",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "Test Address",
    "category": "Pothole"
  }'

# Get statistics
curl http://localhost:8080/api/issues/statistics
```

## Troubleshooting

### CORS Issues
- Make sure the backend CORS configuration includes your frontend URL
- Check that requests are going to the correct API URL

### Database Issues
- H2 database is in-memory and resets on restart
- Check H2 console for data verification
- Sample data is loaded automatically on startup

### Port Conflicts
- Backend runs on port 8080 by default
- Frontend runs on port 3000 by default
- Change ports in configuration if needed

### API Response Format
- Backend responses are wrapped in a consistent format:
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": { ... }
  }
  ```

## Next Steps

1. **Add Authentication**: Implement JWT-based authentication
2. **File Upload**: Add proper file upload handling for images
3. **Real Database**: Configure MySQL or PostgreSQL for production
4. **Error Handling**: Improve error handling and user feedback
5. **Testing**: Add comprehensive tests for both frontend and backend
6. **Deployment**: Set up production deployment configuration
