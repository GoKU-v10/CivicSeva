
'use client';

import { AssignmentBoard } from "./components/assignment-board";
import { issues as initialIssues } from "@/lib/data";
import type { Issue } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { updateIssueDetailsAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";


const LOCAL_STORAGE_KEY = 'civicseva_issues';

export default function AssignmentBoardPage() {
    const [allIssues, setAllIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const handleIssueUpdate = (updatedIssue: Issue) => {
        setAllIssues(prevIssues => {
            const newIssues = prevIssues.map(issue => 
                issue.id === updatedIssue.id ? updatedIssue : issue
            );
            
            // Update localStorage with the entire new list of issues
            // We store all issues, not just deltas, to ensure consistency
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newIssues));
            
            return newIssues;
        });
    };

    const handleAssignDepartment = async (issueId: string, department: string) => {
        const formData = new FormData();
        formData.append('issueId', issueId);
        formData.append('department', department);
        
        // Pass the entire current state to the server action
        formData.append('localIssues', JSON.stringify(allIssues));

        const result = await updateIssueDetailsAction(formData);

        if (result.success && result.issue) {
            handleIssueUpdate(result.issue);
            toast({
                title: "Department Assigned",
                description: `Issue #${issueId} assigned to ${department}.`,
            });
        } else {
            toast({
                variant: 'destructive',
                title: "Assignment Failed",
                description: result.error,
            });
        }
    };


     useEffect(() => {
        // This effect runs on the client-side
        const storedIssues: Issue[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        
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


    // For demonstration, we'll filter issues that need assignment.
    const unassignedIssues = allIssues.filter(issue => issue.department === 'Pending Assignment');
    const publicWorksIssues = allIssues.filter(issue => issue.department === 'Public Works');
    const sanitationIssues = allIssues.filter(issue => issue.department === 'Sanitation');
    const transportIssues = allIssues.filter(issue => issue.department === 'Transportation');

    if (isLoading) {
        return (
             <div>
                <div className="mb-6">
                    <Skeleton className="h-8 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
                    <Skeleton className="h-full w-full" />
                    <Skeleton className="h-full w-full" />
                    <Skeleton className="h-full w-full" />
                    <Skeleton className="h-full w-full" />
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Issue Assignment Board</h1>
                <p className="text-muted-foreground">Drag and drop issues to assign them to the correct department.</p>
            </div>
            <AssignmentBoard 
                unassigned={unassignedIssues}
                publicWorks={publicWorksIssues}
                sanitation={sanitationIssues}
                transportation={transportIssues}
                onAssignDepartment={handleAssignDepartment}
            />
        </div>
    )
}
