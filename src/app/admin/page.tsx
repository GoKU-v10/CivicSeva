
import { AdminDashboard } from "@/app/admin/components/admin-dashboard";
import { issues } from "@/lib/data";

export default function AdminPage() {
    return (
        <AdminDashboard issues={issues} />
    );
}
