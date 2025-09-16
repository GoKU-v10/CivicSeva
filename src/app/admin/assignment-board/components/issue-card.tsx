
'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { priorities } from "../../components/columns";
import type { Issue } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";

interface IssueCardProps {
    issue: Issue;
}

export function IssueCard({ issue }: IssueCardProps) {
    const priority = priorities.find(p => p.value === issue.priority);

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
        <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
            <CardHeader className="p-0">
                 <div className="relative aspect-video">
                    <Image 
                        src={issue.imageUrl} 
                        alt={issue.title}
                        fill
                        className="object-cover rounded-t-lg"
                        data-ai-hint={issue.imageHint}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-3">
                <Badge variant="secondary" className="mb-2">{issue.category}</Badge>
                <h4 className="font-semibold text-sm leading-tight">{issue.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                    {issue.location.address} <br />
                    ({issue.location.latitude.toFixed(5)}, {issue.location.longitude.toFixed(5)})
                </p>
                <div className="flex justify-between items-center mt-2">
                    {priority && (
                         <div className="flex items-center text-xs">
                            <priority.icon className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span>{priority.label} Priority</span>
                        </div>
                    )}
                    <span className="text-xs text-muted-foreground">{reportedAt || '...'}</span>
                </div>
            </CardContent>
        </Card>
    )
}
