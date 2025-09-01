import { AppShell } from '@/components/app-shell';
import { ReportIssueForm } from '@/components/report-issue-form';

export default function ReportIssuePage() {
  return (
    <AppShell>
        <div className="max-w-2xl mx-auto">
            <ReportIssueForm />
        </div>
    </AppShell>
  );
}
