// components/shared/DataTable.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => string | number | React.ReactNode);
  render?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
  error?: string;
  emptyMessage?: string | React.ReactNode;
  skeletonCount?: number;
};

export function DataTable<T extends { _id?: string }>({
  columns,
  data,
  isLoading,
  error,
  emptyMessage = "No data found",
  skeletonCount = 5,
}: DataTableProps<T>) {
  return (
  <div className="space-y-4">
  {error && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-medium">
      {error}
    </div>
  )}

  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead 
              key={String(col.accessor)} 
              className={`${col.headerClassName || "text-left"} text-black font-semibold`}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          [...Array(skeletonCount)].map((_, i) => (
            <TableRow key={`skeleton-${i}`}>
              {columns.map((col, colIdx) => (
                <TableCell key={`skeleton-col-${colIdx}`} className="text-black">
                  <Skeleton className="h-4 w-[100px] bg-gray-300" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell 
              colSpan={columns.length} 
              className="text-center py-8 text-black font-medium"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, rowIdx) => (
            <TableRow key={row._id || rowIdx}>
              {columns.map((col) => (
                <TableCell 
                  key={`${row._id || rowIdx}-${String(col.accessor)}`}
                  className={`${col.className || ""} text-black font-normal`}
                >
                  {col.render 
                    ? col.render(row)
                    : typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor as keyof T] as React.ReactNode) ?? "-"}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </Card>
</div>
  );
}

// Example usage with actions dropdown:
export function ActionsDropdown<T>({
  items,
}: {
  items: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
    className?: string;
    destructive?: boolean;
  }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.href ? (
              <Link href={item.href} passHref legacyBehavior>
                <DropdownMenuItem 
                  className={item.className}
                  onClick={item.onClick}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </DropdownMenuItem>
              </Link>
            ) : (
              <DropdownMenuItem
                className={item.destructive ? "text-red-600 focus:text-red-600" : item.className}
                onClick={item.onClick}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </DropdownMenuItem>
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}