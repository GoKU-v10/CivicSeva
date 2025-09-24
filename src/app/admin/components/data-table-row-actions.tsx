

"use client"

import { MoreHorizontal, Wrench, CheckCircle2, CircleAlert, Building, Trash2, Eye, Loader2 } from "lucide-react"
import { CellContext } from "@tanstack/react-table"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useToast } from "@/hooks/use-toast"
import type { Issue, IssueStatus } from "@/lib/types"
import { updateIssueDetailsAction, deleteIssueAction } from "@/lib/actions"
import { useState } from "react"

interface DataTableRowActionsProps<TData> {
  cell: CellContext<TData, unknown>
}

const departments = ["Public Works", "Sanitation", "Transportation", "Parks & Recreation", "Water Dept."];

export function DataTableRowActions<TData extends Issue>({
  cell,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const row = cell.row;
  const issue = row.original as Issue;
  const onUpdateIssue = (cell.table.options.meta as any)?.onUpdateIssue;
  const onDeleteIssue = (cell.table.options.meta as any)?.onDeleteIssue;


  const handleUpdate = async (updateData: {status?: IssueStatus, department?: string}) => {
    if (!onUpdateIssue) {
        console.error("onUpdateIssue function is not available.");
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "A configuration error prevented the update.",
        });
        return;
    }

    setIsUpdating(true);
    const formData = new FormData();
    formData.append('issueId', issue.id);
    if(updateData.status) formData.append('status', updateData.status);
    if(updateData.department) formData.append('department', updateData.department);
    
    // Pass localStorage to server action
    const localIssues = localStorage.getItem('civicseva_issues');
    if (localIssues) {
      formData.append('localIssues', localIssues);
    } else {
      formData.append('localIssues', JSON.stringify((cell.table.options.meta as any)?.issues || []));
    }

    const result = await updateIssueDetailsAction(formData);

    if (result.success && result.issue) {
        onUpdateIssue(result.issue);
        toast({
            title: "Success!",
            description: `Issue #${issue.id.substring(0,6)} has been updated.`,
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

  const handleDelete = async () => {
    if (!onDeleteIssue) {
        console.error("onDeleteIssue function is not available.");
        toast({ variant: "destructive", title: "Delete Failed", description: "Configuration error." });
        return;
    }
    
    try {
        setIsDeleting(true);
        
        const formData = new FormData();
        formData.append('issueId', issue.id);
        
        // Call the server action
        const result = await deleteIssueAction(formData);

        if (result.success) {
            // Update the UI by calling the parent component's onDeleteIssue
            onDeleteIssue(issue.id);
            
            // Show success message
            toast({
                variant: 'default',
                title: "Success",
                description: `Issue #${issue.id.substring(0,6)} has been deleted.`,
            });
        } else {
            throw new Error(result.error || 'Failed to delete issue');
        }
    } catch (error) {
        console.error('Error deleting issue:', error);
        toast({
            variant: "destructive",
            title: "Delete Failed",
            description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    } finally {
        setIsDeleting(false);
    }
  }
  
  const handleResolveClick = () => {
    const hasAfterPhoto = issue.images.some(img => img.caption.toLowerCase().includes('after'));
    if (!hasAfterPhoto) {
        toast({
            variant: "destructive",
            title: "Cannot Resolve Issue",
            description: "Please upload an 'After' photo from the issue detail page before marking it as resolved.",
        });
        return;
    }
    handleUpdate({ status: 'Resolved' });
  };


  return (
    <AlertDialog>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            disabled={isUpdating || isDeleting}
            >
            {(isUpdating || isDeleting) ? <Loader2 className="animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
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
                        <DropdownMenuItem onClick={handleResolveClick}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Resolved
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
                 <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Issue
                </DropdownMenuItem>
            </AlertDialogTrigger>
        </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the issue
                <span className="font-bold"> #{issue.id.substring(0,6)}</span>.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Yes, delete issue
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

  )
}
