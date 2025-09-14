
'use client';
import { useState, useMemo, useEffect } from 'react';
import type { Issue, IssueStatus, IssueCategory, IssuePriority } from '@/lib/types';
import { IssueCard } from './issue-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { List, LayoutGrid, Calendar as CalendarIcon, X, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { IssueListItem } from './issue-list-item';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
const allPriorities: IssuePriority[] = ['Low', 'Medium', 'High'];

type SortOption = 'reportedAt-desc' | 'reportedAt-asc' | 'priority-desc' | 'priority-asc' | 'status-asc' | 'status-desc';

export function CitizenDashboard({ initialIssues }: CitizenDashboardProps) {
  const [issues, setIssues] = useState(initialIssues);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortOption, setSortOption] = useState<SortOption>('reportedAt-desc');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setIssues(initialIssues);
  }, [initialIssues]);

  const filteredAndSortedIssues = useMemo(() => {
    let filtered = issues
      .filter((issue) =>
        statusFilter === 'all' ? true : issue.status === statusFilter
      )
      .filter((issue) =>
        categoryFilter === 'all' ? true : issue.category === categoryFilter
      )
      .filter((issue) =>
        priorityFilter === 'all' ? true : issue.priority === priorityFilter
      )
      .filter((issue) => {
        if (!dateRange?.from) return true;
        const issueDate = new Date(issue.reportedAt);
        const fromDate = dateRange.from;
        const toDate = dateRange.to || dateRange.from;
        return issueDate >= fromDate && issueDate <= toDate;
      })
      .filter((issue) =>
        issue.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const [sortBy, order] = sortOption.split('-');

      filtered.sort((a, b) => {
          let valA, valB;
          
          if(sortBy === 'reportedAt') {
              valA = new Date(a.reportedAt).getTime();
              valB = new Date(b.reportedAt).getTime();
          } else if (sortBy === 'priority') {
              const priorityOrder: Record<IssuePriority, number> = { 'Low': 1, 'Medium': 2, 'High': 3 };
              valA = priorityOrder[a.priority || 'Low'];
              valB = priorityOrder[b.priority || 'Low'];
          } else { // status
              valA = a.status;
              valB = b.status;
          }

          if (valA < valB) return order === 'asc' ? -1 : 1;
          if (valA > valB) return order === 'asc' ? 1 : -1;
          return 0;
      });

    return filtered;
  }, [issues, searchTerm, statusFilter, categoryFilter, priorityFilter, dateRange, sortOption]);

  const activeIssues = useMemo(() => issues.filter(i => i.status !== 'Resolved'), [issues]);
  const resolvedIssues = useMemo(() => issues.filter(i => i.status === 'Resolved'), [issues]);
  const highPriorityIssues = useMemo(() => issues.filter(i => i.priority === 'High' && i.status !== 'Resolved'), [issues]);


  const clearDateFilter = () => {
    setDateRange(undefined);
  }

  const renderIssueList = (issueList: Issue[]) => {
      if (issueList.length === 0) {
           return (
            <div className="text-center py-12">
                <h3 className="text-xl font-medium">No issues found</h3>
                <p className="text-muted-foreground">There are no issues matching the current criteria.</p>
            </div>
           )
      }

      return view === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {issueList.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
            ))}
        </div>
        ) : (
            <div className="border rounded-lg">
                {issueList.map((issue) => (
                    <IssueListItem key={issue.id} issue={issue} />
                ))}
            </div>
        )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issues.length}</div>
            <p className="text-xs text-muted-foreground">Total reports submitted by you</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIssues.length}</div>
            <p className="text-xs text-muted-foreground">Currently open and in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Issues</CardTitle>
            <ShieldCheck className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{highPriorityIssues.length}</div>
            <p className="text-xs text-muted-foreground">High-priority active issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{resolvedIssues.length}</div>
            <p className="text-xs text-muted-foreground">Successfully fixed and closed</p>
          </CardContent>
        </Card>
      </div>

       <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Issues</TabsTrigger>
            <TabsTrigger value="attention" className="text-destructive">Needs Attention</TabsTrigger>
            <TabsTrigger value="resolved" className="text-green-600">Resolved</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm h-9"
            />
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

        <TabsContent value="all">
          {renderIssueList(filteredAndSortedIssues)}
        </TabsContent>
        <TabsContent value="attention">
          {renderIssueList(highPriorityIssues.filter(issue => issue.title.toLowerCase().includes(searchTerm.toLowerCase())))}
        </TabsContent>
        <TabsContent value="resolved">
          {renderIssueList(resolvedIssues.filter(issue => issue.title.toLowerCase().includes(searchTerm.toLowerCase())))}
        </TabsContent>
      </Tabs>

      {/* Kept filters for "all" tab, can be moved or duplicated if needed for others */}
      {/* <div className="flex flex-col gap-4"> ... </div> */}
      
    </div>
  );
}
