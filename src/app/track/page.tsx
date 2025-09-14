
'use client';
import { CitizenDashboard } from "@/components/citizen-dashboard";
import { issues as initialIssuesData } from "@/lib/data";
import { Issue } from "@/lib/types";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = 'civicseva_issues';
const ISSUES_TO_DELETE = ['IS-11404', 'IS-17905', 'IS-86772', 'IS-18069'];

export default function TrackIssuesPage() {
    const [issues, setIssues] = useState<Issue[]>(() => {
        // Load initial state from data file
        return [...initialIssuesData];
    });

    useEffect(() => {
        // This effect runs once on the client-side after the component mounts
        let storedIssues: Issue[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        
        // --- FIX: Explicitly remove specified issues from local storage ---
        const initialCount = storedIssues.length;
        storedIssues = storedIssues.filter(issue => !ISSUES_TO_DELETE.includes(issue.id));
        if (storedIssues.length < initialCount) {
             localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedIssues));
        }
        // --- END FIX ---

        const newIssueJSON = sessionStorage.getItem('newly_submitted_issue');
        
        let allIssues = [...storedIssues, ...initialIssuesData];
        let newIssueFound = false;

        if (newIssueJSON) {
            try {
                const newIssue: Issue = JSON.parse(newIssueJSON);
                // Ensure the new issue isn't already in our list
                if (!allIssues.some(issue => issue.id === newIssue.id)) {
                    allIssues.unshift(newIssue);
                    storedIssues.unshift(newIssue);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedIssues));
                    newIssueFound = true;
                }
                sessionStorage.removeItem('newly_submitted_issue');
            } catch (error) {
                console.error("Failed to parse newly submitted issue from sessionStorage", error);
            }
        }
        
        // Remove duplicates, preferring the ones from localStorage/sessionStorage
        const uniqueIssues = allIssues.filter((issue, index, self) =>
            index === self.findIndex((t) => (
                t.id === issue.id
            ))
        );
        
        setIssues(uniqueIssues);

    // The empty dependency array ensures this runs only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // This effect runs when a new issue is submitted via the form
    useEffect(() => {
        const newIssueJSON = sessionStorage.getItem('newly_submitted_issue');
        if (newIssueJSON) {
            try {
                const newIssue: Issue = JSON.parse(newIssueJSON);
                
                setIssues(prevIssues => {
                    // Prevent adding duplicates
                    if (prevIssues.some(p => p.id === newIssue.id)) {
                        return prevIssues;
                    }
                    const updatedIssues = [newIssue, ...prevIssues];
                    
                    // Also update localStorage with the new issue
                    const storedIssues: Issue[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
                    if (!storedIssues.some(s => s.id === newIssue.id)) {
                       storedIssues.unshift(newIssue);
                       localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedIssues));
                    }

                    return updatedIssues;
                });

                sessionStorage.removeItem('newly_submitted_issue');
            } catch (error) {
                console.error("Failed to parse newly submitted issue from sessionStorage", error);
            }
        }
    }, [issues]);


    return (
        <div>
            <CitizenDashboard initialIssues={issues} />
        </div>
    );
}
