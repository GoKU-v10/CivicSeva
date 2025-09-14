
'use client';
import { useState, useMemo, useEffect } from 'react';
import type { Issue, IssueStatus, IssueCategory, IssuePriority } from '@/lib/types';
import {
  List,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IssueCarousel } from './issue-carousel';

interface CitizenDashboardProps {
  initialIssues: Issue[];
}

export function CitizenDashboard({ initialIssues }: CitizenDashboardProps) {
  const [issues, setIssues] = useState(initialIssues);

  useEffect(() => {
    setIssues(initialIssues);
  }, [initialIssues]);

  const activeIssues = useMemo(() => issues.filter(i => i.status !== 'Resolved'), [issues]);
  const resolvedIssues = useMemo(() => issues.filter(i => i.status === 'Resolved'), [issues]);
  const highPriorityIssues = useMemo(() => issues.filter(i => i.priority === 'High' && i.status !== 'Resolved'), [issues]);

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
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Issues ({issues.length})</TabsTrigger>
          <TabsTrigger value="attention">Needs Attention ({highPriorityIssues.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedIssues.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <IssueCarousel issues={issues} title="All Reported Issues" />
        </TabsContent>
        <TabsContent value="attention">
           <IssueCarousel issues={highPriorityIssues} title="Issues Needing Attention" emptyMessage="No high-priority issues." />
        </TabsContent>
        <TabsContent value="resolved">
          <IssueCarousel issues={resolvedIssues} title="Resolved Issues" emptyMessage="No issues have been resolved yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
