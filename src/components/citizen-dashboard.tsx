'use client';
import { useState, useMemo } from 'react';
import type { Issue, IssueStatus, IssueCategory } from '@/lib/types';
import { IssueCard } from './issue-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { List, LayoutGrid } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { IssueListItem } from './issue-list-item';

interface CitizenDashboardProps {
  initialIssues: Issue[];
}

const allStatuses: IssueStatus[] = ['Reported', 'In Progress', 'Resolved'];
const allCategories: IssueCategory[] = [
  'Pothole',
  'Graffiti',
  'Streetlight Outage',
  'Waste Management',
  'Damaged Sign',
  'Water Leak',
  'Other'
];

export function CitizenDashboard({ initialIssues }: CitizenDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filteredIssues = useMemo(() => {
    return initialIssues
      .filter((issue) =>
        statusFilter === 'all' ? true : issue.status === statusFilter
      )
      .filter((issue) =>
        categoryFilter === 'all' ? true : issue.category === categoryFilter
      )
      .filter((issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [initialIssues, searchTerm, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <Input
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {allStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <div className="flex items-center rounded-md bg-muted p-1">
              <Button
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('grid')}
                className="h-8 w-8"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('list')}
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
        </div>
      </div>
      {filteredIssues.length > 0 ? (
        view === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
            ))}
            </div>
        ) : (
            <div className="border rounded-lg">
                {filteredIssues.map((issue) => (
                    <IssueListItem key={issue.id} issue={issue} />
                ))}
            </div>
        )
      ) : (
        <div className="text-center py-12">
            <h3 className="text-xl font-medium">No issues found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
