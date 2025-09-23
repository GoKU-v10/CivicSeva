
'use client'

import type { Issue } from "@/lib/types";
import { IssueCard } from "./issue-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface BoardColumnProps {
    title: string;
    issues: Issue[];
    onDrop: (e: React.DragEvent<HTMLDivElement>, title: string) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, issueId: string) => void;
}

export function BoardColumn({ title, issues, onDrop, onDragOver, onDragStart }: BoardColumnProps) {
    return (
        <div 
            className="flex flex-col bg-muted/50 rounded-lg"
            onDrop={(e) => onDrop(e, title)}
            onDragOver={onDragOver}
        >
            <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                    {title}
                    <Badge variant="secondary" className="text-sm">{issues.length}</Badge>
                </h3>
            </div>
            <ScrollArea className="flex-1 p-2">
                <div className="space-y-2">
                    {issues.map((issue, index) => (
                        <div key={issue.id} draggable onDragStart={(e) => onDragStart(e, issue.id)}>
                            <IssueCard issue={issue} />
                        </div>
                    ))}
                     {issues.length === 0 && (
                        <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg m-2">
                            <p className="text-sm text-muted-foreground">Drop issues here.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
