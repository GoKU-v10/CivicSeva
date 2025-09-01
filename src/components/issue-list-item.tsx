import type { Issue } from '@/lib/types';
import { IssueStatusBadge } from './issue-status-badge';
import { Badge } from './ui/badge';
import { MapPin, Calendar, Dot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IssueListItemProps {
    issue: Issue;
}

export function IssueListItem({ issue }: IssueListItemProps) {
    return (
        <div className="flex items-start gap-4 p-4 hover:bg-muted/50 border-b last:border-b-0">
            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{issue.category}</Badge>
                    <IssueStatusBadge status={issue.status} />
                </div>
                <h3 className="font-semibold text-base">{issue.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{issue.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        <span>{issue.location.address}</span>
                    </div>
                     <Dot />
                     <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>Reported {formatDistanceToNow(new Date(issue.reportedAt), { addSuffix: true })}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
