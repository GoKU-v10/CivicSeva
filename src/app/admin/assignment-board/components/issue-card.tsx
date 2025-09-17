
'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { priorities } from "../../components/columns";
import type { Issue } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import Link from 'next/link';

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
        <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-card">
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
            <CardContent className="p-3 space-y-2">
                <div className="flex justify-between items-start">
                    <Badge variant="secondary">{issue.category}</Badge>
                    {priority && (
                         <div className="flex items-center text-xs">
                            <priority.icon className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-semibold">{priority.label}</span>
                        </div>
                    )}
                </div>
                <h4 className="font-semibold text-sm leading-tight hover:underline">
                    <Link href={`/admin/issue/${issue.id}`}>
                        {issue.title}
                    </Link>
                </h4>
                <p className="text-xs text-muted-foreground">
                    ID: {issue.id.substring(0, 6)}
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{issue.location.address.split(',')[0]}</span>
                    <span>{reportedAt || '...'}</span>
                </div>
            </CardContent>
        </Card>
    )
}
