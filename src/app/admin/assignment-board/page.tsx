
import { AssignmentBoard } from "./components/assignment-board";
import { issues } from "@/lib/data";

export default function AssignmentBoardPage() {
    // For demonstration, we'll filter issues that need assignment.
    const unassignedIssues = issues.filter(issue => issue.department === 'Pending Assignment');
    const publicWorksIssues = issues.filter(issue => issue.department === 'Public Works');
    const sanitationIssues = issues.filter(issue => issue.department === 'Sanitation');
    const transportIssues = issues.filter(issue => issue.department === 'Transportation');


    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Issue Assignment Board</h1>
                <p className="text-muted-foreground">Drag and drop issues to assign them to the correct department.</p>
            </div>
            <AssignmentBoard 
                unassigned={unassignedIssues}
                publicWorks={publicWorksIssues}
                sanitation={sanitationIssues}
                transportation={transportIssues}
            />
        </div>
    )
}
