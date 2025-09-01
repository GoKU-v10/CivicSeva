import { AppShell } from "@/components/app-shell";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { issues } from "@/lib/data";

export default function AdminPage() {
    return (
        <AppShell>
            <AdminDashboard issues={issues} />
        </AppShell>
    );
}
