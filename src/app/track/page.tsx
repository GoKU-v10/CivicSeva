
import { CitizenDashboard } from "@/components/citizen-dashboard";
import { issues } from "@/lib/data";

export default function TrackIssuesPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Track Issues</h1>
            <CitizenDashboard initialIssues={issues} />
        </div>
    );
}
