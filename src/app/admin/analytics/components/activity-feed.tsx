
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle2, Wrench, CircleAlert, Building } from 'lucide-react';
import React from 'react';
import { Separator } from '@/components/ui/separator';

const activities = [
    {
        icon: <CircleAlert className="text-red-500" />,
        title: "New Issue Reported",
        description: "A new 'Pothole' was reported on Main St.",
        time: "2m ago",
    },
    {
        icon: <Building className="text-blue-500" />,
        title: "Issue Assigned",
        description: "Issue IS-86772 was assigned to Transportation.",
        time: "15m ago",
    },
    {
        icon: <Wrench className="text-yellow-500" />,
        title: "Status Update",
        description: "Issue IS-11404 is now In Progress.",
        time: "1h ago",
    },
    {
        icon: <CheckCircle2 className="text-green-500" />,
        title: "Issue Resolved",
        description: "Issue IS-18069 ('Graffiti') has been marked as resolved.",
        time: "3h ago",
    }
];

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Bell />
            Live Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-start gap-4 p-2 -m-2 rounded-lg transition-colors hover:bg-muted/50">
                         <div className="size-8 flex items-center justify-center rounded-full bg-muted">
                            {activity.icon}
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold text-sm">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap pt-1">
                            {activity.time}
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
