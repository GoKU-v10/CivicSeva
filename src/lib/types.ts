export type IssueStatus = 'Reported' | 'In Progress' | 'Resolved';

export type IssueCategory =
  | 'Pothole'
  | 'Graffiti'
  | 'Streetlight Outage'
  | 'Waste Management'
  | 'Damaged Sign'
  | 'Water Leak'
  | 'Other';

export interface Issue {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: IssueStatus;
  category: IssueCategory;
  reportedAt: string;
  resolvedAt?: string;
  department: string;
  confidence?: number;
}
