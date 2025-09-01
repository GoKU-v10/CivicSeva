import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { issues } from "@/lib/data";

export default function AdminPage() {
    return (
        <AdminDashboard issues={issues} />
    );
}
