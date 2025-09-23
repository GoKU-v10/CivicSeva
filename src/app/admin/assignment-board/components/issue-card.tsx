
'use client'

import { Card, CardContent } from "@/components/ui/card";
import { priorities } from "../../components/columns";
import type { Issue } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { MapPin } from "lucide-react";

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
            <CardContent className="p-2">
                <div className="flex gap-3">
                    <div className="relative aspect-square w-16 h-16 shrink-0">
                        <Image 
                            src={issue.imageUrl} 
                            alt={issue.title}
                            fill
                            className="object-cover rounded-md"
                            data-ai-hint={issue.imageHint}
                        />
                    </div>
                    <div className="flex-grow space-y-1 overflow-hidden">
                        <div className="flex justify-between items-start gap-1">
                            <Badge variant="secondary" className="truncate">{issue.category}</Badge>
                            {priority && (
                                <div className="flex items-center text-xs shrink-0">
                                    <priority.icon className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="font-semibold">{priority.label}</span>
                                </div>
                            )}
                        </div>
                        <h4 className="font-semibold text-sm leading-tight hover:underline truncate">
                            <Link href={`/admin/issue/${issue.id}`}>
                                {issue.title}
                            </Link>
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3 shrink-0" />
                            <span className="truncate">{issue.location.address.split(',')[0]}</span>
                        </div>
                         <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span className="font-mono">{issue.id.substring(0, 6)}</span>
                            <span>{reportedAt || '...'}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
