
"use client"

import { MoreHorizontal, Wrench, CheckCircle2, CircleAlert, Building, Trash2, Eye } from "lucide-react"
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
import type { Issue } from "@/lib/types"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

const departments = ["Public Works", "Sanitation", "Transportation", "Parks & Recreation", "Water Dept."];

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast()
  
  // In a real app, these would trigger server actions to update the database
  const updateStatus = (status: string) => {
    toast({
      title: "Status Updated",
      description: `Issue #${(row.original as any).id} marked as ${status}.`,
    })
  }

  const assignDepartment = (department: string) => {
     toast({
      title: "Department Assigned",
      description: `Issue #${(row.original as any).id} assigned to ${department}.`,
    })
  }

  const deleteIssue = () => {
    // In a real app, this would also need to update localStorage on the client
    toast({
      variant: 'destructive',
      title: "Issue Deleted",
      description: `Issue #${(row.original as any).id} has been deleted.`,
    })
  }

  const issue = row.original as Issue;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
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
                 <DropdownMenuItem key={dept} onClick={() => assignDepartment(dept)}>
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
                    <DropdownMenuItem onClick={() => updateStatus('Reported')}>
                        <CircleAlert className="mr-2 h-4 w-4" />
                        Reported
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus('In Progress')}>
                        <Wrench className="mr-2 h-4 w-4" />
                        In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus('Resolved')}>
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
