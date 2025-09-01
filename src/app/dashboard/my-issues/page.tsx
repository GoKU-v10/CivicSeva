
import { CitizenDashboard } from "@/components/citizen-dashboard";
import { issues } from "@/lib/data";

export default function MyIssuesPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Reported Issues</h1>
            <CitizenDashboard initialIssues={issues} />
        </div>
    );
}
