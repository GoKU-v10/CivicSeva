import { Badge } from '@/components/ui/badge';
import type { IssueStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CircleAlert, Wrench, CheckCircle2 } from 'lucide-react';
import React from 'react';

interface IssueStatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

const statusConfig = {
  Reported: {
    icon: <CircleAlert className="size-3" />,
    color: 'bg-red-500 hover:bg-red-500',
  },
  'In Progress': {
    icon: <Wrench className="size-3" />,
    color: 'bg-yellow-500 hover:bg-yellow-500',
  },
  Resolved: {
    icon: <CheckCircle2 className="size-3" />,
    color: 'bg-green-500 hover:bg-green-500',
  },
};

export function IssueStatusBadge({ status, className }: IssueStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge className={cn('flex items-center gap-1.5 text-white', config.color, className)}>
      {config.icon}
      <span className="leading-none">{status}</span>
    </Badge>
  );
}
