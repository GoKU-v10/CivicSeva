
'use client'
import type { Issue } from "@/lib/types";
import { BoardColumn } from "./board-column";

interface AssignmentBoardProps {
    unassigned: Issue[];
    publicWorks: Issue[];
    sanitation: Issue[];
    transportation: Issue[];
}

export function AssignmentBoard({ unassigned, publicWorks, sanitation, transportation }: AssignmentBoardProps) {
    // In a real app, this would be wrapped in a Drag-and-Drop context provider
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            <BoardColumn title="Unassigned" issues={unassigned} />
            <BoardColumn title="Public Works" issues={publicWorks} />
            <BoardColumn title="Sanitation" issues={sanitation} />
            <BoardColumn title="Transportation" issues={transportation} />
        </div>
    )
}
