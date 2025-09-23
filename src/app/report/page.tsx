
import { ReportIssueForm } from '@/components/report-issue-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ReportIssuePage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="mb-4">
            <Button asChild variant="ghost">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>
        <ReportIssueForm />
    </div>
  );
}
