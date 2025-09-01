import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import type { Issue } from '@/lib/types';
import { IssueStatusBadge } from './issue-status-badge';

interface IssueCardProps {
  issue: Issue;
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3]">
          <Image
            src={issue.imageUrl}
            alt={issue.title}
            fill
            className="object-cover"
            data-ai-hint={issue.imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="secondary">{issue.category}</Badge>
            <IssueStatusBadge status={issue.status} />
        </div>
        <h3 className="text-lg font-semibold leading-tight mb-2">{issue.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {issue.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 flex flex-col items-start gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="size-4" />
          <span>{issue.location.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="size-4" />
          <span>Reported on {new Date(issue.reportedAt).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
