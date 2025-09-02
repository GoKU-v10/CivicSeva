
import { AdminDashboard } from "@/app/admin/components/admin-dashboard";
import { issues } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Users } from "lucide-react";

export default function AdminPage() {
    const newIssuesToday = issues.filter(i => new Date(i.reportedAt).toDateString() === new Date().toDateString()).length;
    const pendingAssignments = issues.filter(i => i.department === 'Pending Assignment').length;
    
    // Dummy data for avg resolution time
    const avgResolutionTime = "4.2 Days";

    return (
        <div className="space-y-6">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
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
                 <Card>
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
                <Card>
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
            <AdminDashboard issues={issues} />
        </div>
    );
}
