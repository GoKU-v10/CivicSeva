
'use client'
import type { Issue } from "@/lib/types";
import { BoardColumn } from "./board-column";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


interface AssignmentBoardProps {
    unassigned: Issue[];
    publicWorks: Issue[];
    sanitation: Issue[];
    transportation: Issue[];
    onAssignDepartment: (issueId: string, department: string) => Promise<void>;
}

export function AssignmentBoard({ unassigned, publicWorks, sanitation, transportation, onAssignDepartment }: AssignmentBoardProps) {
    const { toast } = useToast();
    const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, issueId: string) => {
        setDraggedIssueId(issueId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, department: string) => {
        e.preventDefault();
        if (draggedIssueId && department !== "Unassigned") {
            try {
                await onAssignDepartment(draggedIssueId, department);
                toast({
                    title: "Issue Assigned",
                    description: `Successfully assigned issue to ${department}.`,
                });
            } catch (error) {
                 toast({
                    variant: "destructive",
                    title: "Assignment Failed",
                    description: "Could not assign the issue. Please try again.",
                });
            }
            setDraggedIssueId(null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // This is necessary to allow for dropping
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            <BoardColumn title="Unassigned" issues={unassigned} onDrop={handleDrop} onDragOver={handleDragOver} onDragStart={handleDragStart} />
            <BoardColumn title="Public Works" issues={publicWorks} onDrop={handleDrop} onDragOver={handleDragOver} onDragStart={handleDragStart} />
            <BoardColumn title="Sanitation" issues={sanitation} onDrop={handleDrop} onDragOver={handleDragOver} onDragStart={handleDragStart} />
            <BoardColumn title="Transportation" issues={transportation} onDrop={handleDrop} onDragOver={handleDragOver} onDragStart={handleDragStart} />
        </div>
    )
}
