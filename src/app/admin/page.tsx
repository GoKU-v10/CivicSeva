
'use client';

import { AdminDashboard } from "@/app/admin/components/admin-dashboard";
import { issues as initialIssues } from "@/lib/data";
import type { Issue } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Users } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LOCAL_STORAGE_KEY = 'civicseva_issues';

export default function AdminPage() {
    const [allIssues, setAllIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const updateIssueState = (updatedIssue: Issue) => {
        setAllIssues(prevIssues => {
            const newIssues = prevIssues.map(issue => 
                issue.id === updatedIssue.id ? updatedIssue : issue
            );
            // Persist the entire updated list to localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newIssues));
            return newIssues;
        });
    };

    const removeIssueFromState = (issueId: string) => {
        setAllIssues(prevIssues => {
            const newIssues = prevIssues.filter(i => i.id !== issueId);
            // Persist the entire updated list to localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newIssues));
            return newIssues;
        });
    }
    
    // Wrap the AdminDashboard in a component that receives the update function
    const DashboardWithUpdates = useCallback(() => {
        return <AdminDashboard issues={allIssues} onUpdateIssue={updateIssueState} onDeleteIssue={removeIssueFromState} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allIssues]);


    useEffect(() => {
        // This effect runs on the client-side
        const storedIssuesJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
        const storedIssues: Issue[] = storedIssuesJSON ? JSON.parse(storedIssuesJSON) : [];
        
        // Combine and remove duplicates, preferring stored (newer) issues
        const issueMap = new Map<string, Issue>();

        // Add initial issues first
        initialIssues.forEach(issue => issueMap.set(issue.id, issue));

        // Overwrite with stored issues, which are more up-to-date
        storedIssues.forEach(issue => issueMap.set(issue.id, issue));
        
        const uniqueIssues = Array.from(issueMap.values());
        
        setAllIssues(uniqueIssues);
        setIsLoading(false);
    }, []);

    const newIssuesToday = allIssues.filter(i => new Date(i.reportedAt).toDateString() === new Date().toDateString()).length;
    const pendingAssignments = allIssues.filter(i => i.department === 'Pending Assignment').length;
    
    // Dummy data for avg resolution time
    const avgResolutionTime = "5.2 Days";

    if (isLoading) {
        return (
             <div className="space-y-6">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card><CardHeader><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
                 </div>
                 <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="transition-all hover:scale-105 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Today's New Issues
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{newIssuesToday}</div>
                        <p className="text-xs text-muted-foreground">
                        New reports filed today
                        </p>
                    </CardContent>
                </Card>
                 <Card className="transition-all hover:scale-105 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Pending Assignment
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingAssignments}</div>
                        <p className="text-xs text-muted-foreground">
                        Issues awaiting department assignment
                        </p>
                    </CardContent>
                </Card>
                <Card className="transition-all hover:scale-105 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgResolutionTime}</div>
                        <p className="text-xs text-muted-foreground">
                        Based on last month's data
                        </p>
                    </CardContent>
                </Card>
            </div>
            <AdminDashboard issues={allIssues} onUpdateIssue={updateIssueState} onDeleteIssue={removeIssueFromState} />
        </div>
    );
}
