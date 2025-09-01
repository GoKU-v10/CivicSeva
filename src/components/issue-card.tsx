
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import type { Issue } from '@/lib/types';
import { IssueStatusBadge } from './issue-status-badge';
import Image from 'next/image';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

interface IssueCardProps {
  issue: Issue;
}

export function IssueCard({ issue }: IssueCardProps) {
  const progress = issue.status === 'Resolved' ? 100 : issue.status === 'In Progress' ? 50 : 10;

  return (
    <Card className="flex flex-col overflow-hidden group">
        <CardHeader className="relative p-0 h-40">
            <Image 
                src={issue.imageUrl} 
                alt={issue.title} 
                fill 
                className="object-cover"
                data-ai-hint={issue.imageHint}
            />
            <div className="absolute top-2 right-2">
                <IssueStatusBadge status={issue.status} />
            </div>
            <div className="absolute bottom-2 left-2">
                 <Badge variant="secondary">{issue.category}</Badge>
            </div>
        </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-xs text-muted-foreground font-mono">{issue.id}</p>
        <h3 className="text-base font-semibold leading-tight mt-1">{issue.title}</h3>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
             <div className="flex items-center gap-2">
                <MapPin className="size-3" />
                <span>{issue.location.address}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="size-3" />
                <span>Reported on {format(new Date(issue.reportedAt), "PPP")}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex-col items-start gap-3">
        <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Progress</p>
            <Progress value={progress} className="h-2" />
        </div>
        <Button asChild className="w-full" variant="outline">
            <Link href={`/dashboard/my-issues/${issue.id}`}>
                View Details <ArrowRight className="ml-2" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
