export type IssueStatus = 'Reported' | 'In Progress' | 'Resolved';
export type IssuePriority = 'Low' | 'Medium' | 'High';

export type IssueCategory =
  | 'Pothole'
  | 'Graffiti'
  | 'Streetlight Outage'
  | 'Waste Management'
  | 'Damaged Sign'
  | 'Water Leak'
  | 'Other';

export interface IssueUpdate {
  timestamp: string;
  status: IssueStatus;
  description: string;
}

export interface IssueImage {
    url: string;
    caption: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  images: IssueImage[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: IssueStatus;
  category: IssueCategory;
  priority?: IssuePriority;
  reportedAt: string;
  resolvedAt?: string;
  department: string;
  confidence?: number;
  updates: IssueUpdate[];
  eta?: string;
}
