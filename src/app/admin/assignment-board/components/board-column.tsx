
'use client'

import type { Issue } from "@/lib/types";
import { IssueCard } from "./issue-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface BoardColumnProps {
    title: string;
    issues: Issue[];
}

export function BoardColumn({ title, issues }: BoardColumnProps) {
    return (
        <div className="flex flex-col bg-muted/50 rounded-lg">
            <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                    {title}
                    <Badge variant="secondary" className="text-sm">{issues.length}</Badge>
                </h3>
            </div>
            {/* This scroll area makes each column independently scrollable */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {issues.map(issue => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))}
                     {issues.length === 0 && (
                        <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg">
                            <p className="text-sm text-muted-foreground">No issues here.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
