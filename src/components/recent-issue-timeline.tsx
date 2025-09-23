
'use client';

import type { Issue, IssueUpdate } from "@/lib/types";
import { format } from "date-fns";
import { CheckCircle, CircleAlert, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";


const statusIcons = {
    Reported: CircleAlert,
    'In Progress': Wrench,
    Resolved: CheckCircle,
};

const statusColors = {
    Reported: "text-red-500",
    'In Progress': "text-yellow-500",
    Resolved: "text-green-500",
}

function TimelineNode({ item, isFirst, isLast }: { item: IssueUpdate, isFirst: boolean, isLast: boolean }) {
    const Icon = statusIcons[item.status] || CheckCircle;
    const color = statusColors[item.status] || "text-muted-foreground";
    const [formattedTimestamp, setFormattedTimestamp] = useState('');

    useEffect(() => {
        setFormattedTimestamp(format(new Date(item.timestamp), "PPP p"));
    }, [item.timestamp]);


    return (
        <div className="flex gap-4">
             {/* Vertical line and Icon */}
            <div className="flex flex-col items-center">
                 {/* Top part of the line */}
                <div className={cn("w-px h-4", isFirst ? 'bg-transparent' : 'bg-border')}></div>
                <div className={cn("size-10 rounded-full flex items-center justify-center bg-muted/50 border", isLast && "shadow-lg shadow-primary/20 border-primary")}>
                    <Icon className={cn("size-5", color)} />
                </div>
                 {/* Bottom part of the line */}
                <div className={cn("w-px flex-1", isLast ? 'bg-transparent' : 'bg-border')}></div>
            </div>
            
            {/* Content */}
            <div className={cn("pb-8 -mt-1", isLast ? 'font-bold' : '')}>
                <p className="text-sm">{item.status}</p>
                <p className={cn("text-xs", isLast ? 'text-foreground' : 'text-muted-foreground')}>{item.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{formattedTimestamp || '...'}</p>
            </div>
        </div>
    )
}

export function RecentIssueTimeline({ issue }: { issue: Issue }) {
    const [latestStatus, setLatestStatus] = useState<IssueUpdate | null>(null);
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        if (issue) {
            const status = issue.updates[issue.updates.length - 1];
            setLatestStatus(status);
            setFormattedDate(format(new Date(status.timestamp), 'PP'));
        }
    }, [issue]);

    if (!latestStatus) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>{issue.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Loading timeline...</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{issue.title}</CardTitle>
                <CardDescription>
                    Status: <span className={cn("font-semibold", statusColors[latestStatus.status])}>{latestStatus.status}</span> as of {formattedDate}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-0">
                    {issue.updates.map((update, index) => (
                        <TimelineNode 
                            key={index} 
                            item={update} 
                            isFirst={index === 0}
                            isLast={index === issue.updates.length - 1} 
                        />
                    ))}
                </div>
                 <Button asChild className="w-full mt-4">
                    <Link href={`/dashboard/my-issues/${issue.id}`}>
                        View Full Details
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
