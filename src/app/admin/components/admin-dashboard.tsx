

import type { Issue } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface AdminDashboardProps {
    issues: Issue[];
    onUpdateIssue: (issue: Issue) => void;
    onDeleteIssue: (issueId: string) => void;
}

export function AdminDashboard({ issues, onUpdateIssue, onDeleteIssue }: AdminDashboardProps) {
    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={issues} onUpdateIssue={onUpdateIssue} onDeleteIssue={onDeleteIssue} />
        </div>
    )
}
