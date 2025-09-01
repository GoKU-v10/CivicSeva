import { CitizenDashboard } from "@/components/citizen-dashboard";
import { issues } from "@/lib/data";

export default function MyIssuesPage() {
    // In a real application, you would fetch only the issues reported by the logged-in user.
    const userIssues = issues; 

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Reported Issues</h1>
            <CitizenDashboard initialIssues={userIssues} />
        </div>
    );
}
