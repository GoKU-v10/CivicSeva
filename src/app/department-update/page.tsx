
import { DepartmentUpdateForm } from '@/components/department-update-form';
import { ShieldCheck } from 'lucide-react';

export default function DepartmentUpdatePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
                <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Department Status Update</h1>
            <p className="text-muted-foreground">Update civic issue status - No login required.</p>
        </div>
        <DepartmentUpdateForm />
      </div>
    </div>
  );
}
