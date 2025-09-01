import { AppShell } from '@/components/app-shell';
import { CitizenDashboard } from '@/components/citizen-dashboard';
import { issues } from '@/lib/data';
import type { Issue } from '@/lib/types';

export default function HomePage() {
  const reportedIssues: Issue[] = issues;

  return (
    <AppShell>
      <CitizenDashboard initialIssues={reportedIssues} />
    </AppShell>
  );
}
