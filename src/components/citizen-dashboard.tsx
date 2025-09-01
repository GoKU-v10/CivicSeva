
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
import { List, LayoutGrid, Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { IssueListItem } from './issue-list-item';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

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

  const clearDateFilter = () => {
    setDateRange(undefined);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
          <Input
            placeholder="Search by Issue ID or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[140px]">
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
                <SelectTrigger className="w-full md:w-[140px]">
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
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              {dateRange && (
                 <Button variant="ghost" size="icon" onClick={clearDateFilter} className="h-9 w-9">
                    <X className="h-4 w-4" />
                 </Button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reportedAt-desc">Date (Newest)</SelectItem>
                  <SelectItem value="reportedAt-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="priority-desc">Priority (High to Low)</SelectItem>
                  <SelectItem value="priority-asc">Priority (Low to High)</SelectItem>
                   <SelectItem value="status-asc">Status (A-Z)</SelectItem>
                   <SelectItem value="status-desc">Status (Z-A)</SelectItem>
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
      </div>
      {filteredAndSortedIssues.length > 0 ? (
        view === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
            ))}
            </div>
        ) : (
            <div className="border rounded-lg">
                {filteredAndSortedIssues.map((issue) => (
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
