

"use client"

import { MoreHorizontal, Wrench, CheckCircle2, CircleAlert, Building, Trash2, Eye, Loader2 } from "lucide-react"
import { Row } from "@tanstack/react-table"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { Issue, IssueStatus } from "@/lib/types"
import { updateIssueDetailsAction } from "@/lib/actions"
import { useState } from "react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onUpdateIssue: (issue: Issue) => void;
}

const departments = ["Public Works", "Sanitation", "Transportation", "Parks & Recreation", "Water Dept."];

export function DataTableRowActions<TData extends {id: string}>({
  row,
  onUpdateIssue
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const issue = row.original as Issue;
  
  const handleUpdate = async (updateData: {status?: IssueStatus, department?: string}) => {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append('issueId', issue.id);
    if(updateData.status) formData.append('status', updateData.status);
    if(updateData.department) formData.append('department', updateData.department);
    
    // Pass localStorage to server action
    const localIssues = localStorage.getItem('civicseva_issues');
    if (localIssues) {
      formData.append('localIssues', localIssues);
    }

    const result = await updateIssueDetailsAction(formData);

    if (result.success && result.issue) {
        onUpdateIssue(result.issue);
        toast({
            title: "Success!",
            description: `Issue #${issue.id} has been updated.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: result.error,
        });
    }
    setIsUpdating(false);
  }

  const deleteIssue = () => {
    // This would also require a server action and state update
    toast({
      variant: 'destructive',
      title: "Issue Deleted",
      description: `Issue #${(row.original as any).id} has been deleted.`,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          disabled={isUpdating}
        >
          {isUpdating ? <Loader2 className="animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem asChild>
          <Link href={`/admin/issue/${issue.id}`}>
             <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Building className="mr-2 h-4 w-4" />
            Assign Department
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {departments.map((dept) => (
                 <DropdownMenuItem key={dept} onClick={() => handleUpdate({ department: dept })}>
                    {dept}
                 </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
           <DropdownMenuSubTrigger>
            <Wrench className="mr-2 h-4 w-4" />
             Update Status
           </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => handleUpdate({ status: 'Reported' })}>
                        <CircleAlert className="mr-2 h-4 w-4" />
                        Reported
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdate({ status: 'In Progress' })}>
                        <Wrench className="mr-2 h-4 w-4" />
                        In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdate({ status: 'Resolved' })}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Resolved
                    </DropdownMenuItem>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={deleteIssue}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Issue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
