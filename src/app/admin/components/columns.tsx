
"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Issue, IssuePriority } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { IssueStatusBadge } from "@/components/issue-status-badge"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { format } from "date-fns"
import { ArrowDown, ArrowRight, ArrowUp, Circle, CircleHelp, CircleCheck, CircleX } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState, useEffect } from "react"

export const priorities: {
  label: string
  value: IssuePriority
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    label: "Low",
    value: "Low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "Medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "High",
    icon: ArrowUp,
  },
]

const FormattedDate = ({ dateString }: { dateString: string }) => {
    const [formattedDate, setFormattedDate] = useState("");
    useEffect(() => {
        // This code runs only on the client, after hydration
        if (dateString) {
          try {
            setFormattedDate(format(new Date(dateString), 'MM/dd/yyyy'));
          } catch (e) {
            console.error("Invalid date format for", dateString);
            setFormattedDate("Invalid Date");
          }
        }
    }, [dateString]);
    return <span>{formattedDate || "..."}</span>;
}


export const columns: ColumnDef<Issue>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
    },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issue ID" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
        return <Badge variant="secondary">{row.original.category}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
  },
  {
    accessorKey: "reportedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reported" />
    ),
    cell: ({ row }) => {
        return <FormattedDate dateString={row.original.reportedAt} />
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
        return <IssueStatusBadge status={row.original.status} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (p) => p.value === row.original.priority
      )

      if (!priority) {
        return null
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: (cell) => <DataTableRowActions cell={cell} />,
  },
]
