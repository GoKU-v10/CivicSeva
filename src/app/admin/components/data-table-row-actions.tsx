
"use client"

import { MoreHorizontal, Wrench, CheckCircle2, CircleAlert } from "lucide-react"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast()
  
  // In a real app, these would trigger server actions to update the database
  const markAs = (status: string) => {
    toast({
      title: "Status Updated",
      description: `Issue #${(row.original as any).id} marked as ${status}.`,
    })
  }

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
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => markAs('Reported')}>
            <CircleAlert className="mr-2 h-4 w-4" />
            Mark as Reported
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => markAs('In Progress')}>
            <Wrench className="mr-2 h-4 w-4" />
            Mark as In Progress
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => markAs('Resolved')}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark as Resolved
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
