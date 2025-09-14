
import type { Issue } from './types';

export const issues: Issue[] = [
  {
    id: 'IS-1',
    title: 'Large pothole on main street',
    description: 'A large and dangerous pothole has formed on the corner of Main St and 1st Ave, causing issues for traffic.',
    imageUrl: 'https://i.pinimg.com/736x/d0/3f/c2/d03fc2fe363172d449e218a84b557508.jpg',
    imageHint: 'pothole road',
    images: [
      { url: 'https://i.pinimg.com/736x/d0/3f/c2/d03fc2fe363172d449e218a84b557508.jpg', caption: 'Before' },
      { url: 'https://i.pinimg.com/736x/d0/3f/c2/d03fc2fe363172d449e218a84b557508.jpg', caption: 'Work in progress' },
      { url: 'https://i.pinimg.com/736x/03/90/18/0390186b460f48858349282218084a44.jpg', caption: 'After' },
    ],
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'Main St & 1st Ave, New York, NY',
    },
    status: 'In Progress',
    category: 'Pothole',
    priority: 'High',
    reportedAt: '2024-07-20T10:00:00Z',
    department: 'Public Works',
    confidence: 0.95,
    updates: [
      { timestamp: '2024-07-20T10:00:00Z', status: 'Reported', description: 'Issue submitted by citizen.' },
      { timestamp: '2024-07-20T11:30:00Z', status: 'In Progress', description: 'Assigned to Public Works. A team has been dispatched.' },
    ],
    eta: '2024-07-23T17:00:00Z',
  },
  {
    id: 'IS-4',
    title: 'Overflowing trash can',
    description: 'Public trash can on 5th Avenue is overflowing, leading to litter on the sidewalk.',
    imageUrl: 'https://i.pinimg.com/1200x/07/4e/1a/074e1afeeae49ddb39969fbdba4bd8af.jpg',
    imageHint: 'trash can',
    images: [
       { url: 'https://i.pinimg.com/1200x/07/4e/1a/074e1afeeae49ddb39969fbdba4bd8af.jpg', caption: 'Before' },
       { url: 'https://i.pinimg.com/564x/4b/c0/8b/4bc08b53213a7a9e9e1b268e2782e4f0.jpg', caption: 'After' },
    ],
    location: {
      latitude: 40.7739,
      longitude: -73.965,
      address: '5th Avenue, New York, NY',
    },
    status: 'Resolved',
    category: 'Waste Management',
    priority: 'Low',
    reportedAt: '2024-07-21T09:00:00Z',
    resolvedAt: '2024-07-21T15:00:00Z',
    department: 'Sanitation',
    confidence: 0.92,
     updates: [
       { timestamp: '2024-07-21T09:00:00Z', status: 'Reported', description: 'Issue submitted by citizen.' },
       { timestamp: '2024-07-21T15:00:00Z', status: 'Resolved', description: 'Trash has been collected.' },
    ],
  },
    {
    id: 'IS-5',
    title: 'Damaged Stop Sign',
    description: 'A stop sign at the corner of Liberty St and Nassau St is bent and difficult to see.',
    imageUrl: 'https://i.pinimg.com/736x/29/70/4c/29704cd0075d0cc865bcda8f3dc3a075.jpg',
    imageHint: 'street sign',
    images: [
      { url: 'https://i.pinimg.com/736x/29/70/4c/29704cd0075d0cc865bcda8f3dc3a075.jpg', caption: 'Before' },
      { url: 'https://i.pinimg.com/1200x/29/22/6a/29226adc9367dbb940c6b3d2296efd7f.jpg', caption: 'After' },
    ],
    location: {
      latitude: 40.7088,
      longitude: -74.009,
      address: 'Liberty St & Nassau St, New York, NY',
    },
    status: 'Resolved',
    category: 'Damaged Sign',
    priority: 'High',
    reportedAt: '2024-07-18T08:45:00Z',
    resolvedAt: '2024-07-19T14:00:00Z',
    department: 'Transportation',
    confidence: 0.96,
     updates: [
       { timestamp: '2024-07-18T08:45:00Z', status: 'Reported', description: 'Issue submitted by citizen.' },
       { timestamp: '2024-07-18T10:00:00Z', status: 'In Progress', description: 'Repair crew has been dispatched for replacement.' },
       { timestamp: '2024-07-19T14:00:00Z', status: 'Resolved', description: 'Sign has been replaced.' },
    ],
    eta: '2024-07-19T17:00:00Z',
  },
];
