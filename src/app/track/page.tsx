
'use client';
import { CitizenDashboard } from "@/components/citizen-dashboard";
import { issues as initialIssuesData } from "@/lib/data";
import { Issue } from "@/lib/types";
import { useEffect, useState } from "react";

export default function TrackIssuesPage() {
    const [issues, setIssues] = useState(initialIssuesData);

    useEffect(() => {
        // This effect runs on the client-side after the component mounts
        const newIssueJSON = sessionStorage.getItem('newly_submitted_issue');
        if (newIssueJSON) {
            try {
                const newIssue: Issue = JSON.parse(newIssueJSON);
                // Add the new issue to the top of the list
                setIssues(prevIssues => [newIssue, ...prevIssues]);
                // Clean up sessionStorage
                sessionStorage.removeItem('newly_submitted_issue');
            } catch (error) {
                console.error("Failed to parse newly submitted issue from sessionStorage", error);
            }
        }
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Issues</h1>
            <CitizenDashboard initialIssues={issues} />
        </div>
    );
}
