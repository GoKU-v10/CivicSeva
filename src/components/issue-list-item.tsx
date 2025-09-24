
'use client';
import type { Issue } from '@/lib/types';
import { IssueStatusBadge } from './issue-status-badge';
import { Badge } from './ui/badge';
import { MapPin, Calendar, Dot, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface IssueListItemProps {
    issue: Issue;
}

export function IssueListItem({ issue }: IssueListItemProps) {
    const [reportedAt, setReportedAt] = useState('');

    useEffect(() => {
        // This code runs only on the client, after hydration
        try {
            setReportedAt(formatDistanceToNow(new Date(issue.reportedAt), { addSuffix: true }));
        } catch (e) {
            setReportedAt('Invalid date');
        }
    }, [issue.reportedAt]);


    return (
        <div className="flex items-center gap-4 p-4 hover:bg-muted/50 border-b last:border-b-0">
            <div className="flex-grow">
                 <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-muted-foreground font-mono">{issue.id}</p>
                    <Dot />
                    <Badge variant="secondary">{issue.category}</Badge>
                </div>
                <h3 className="font-semibold text-base">{issue.title}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        <span>{issue.location.address}</span>
                    </div>
                     <Dot />
                     <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>{reportedAt ? `Reported ${reportedAt}`: 'Loading date...'}</span>
                    </div>
                </div>
            </div>
             <div className="flex flex-col items-end gap-2">
                <IssueStatusBadge status={issue.status} />
                <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/my-issues/${issue.id}`}>
                        View Details <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
