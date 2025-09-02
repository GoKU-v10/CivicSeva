
import type { Issue } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface AdminDashboardProps {
    issues: Issue[];
}

export function AdminDashboard({ issues }: AdminDashboardProps) {
    return (
        <div className="container mx-auto py-2">
            <DataTable columns={columns} data={issues} />
        </div>
    )
}
