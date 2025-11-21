import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  FileSpreadsheet,
  FileJson,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { json2csv } from "json-2-csv";
import type { Allocation } from "@/types";

interface AllocationTableProps {
  allocations: Allocation[];
  algorithmName: string;
}

type SortField = "name" | "SAR" | "EMS" | "total";
type SortDirection = "asc" | "desc" | null;

export function AllocationTable({
  allocations,
  algorithmName,
}: AllocationTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort allocations
  const sortedAllocations = [...allocations].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aVal: string | number;
    let bVal: string | number;

    if (sortField === "name") {
      aVal = a.name;
      bVal = b.name;
    } else if (sortField === "SAR") {
      aVal = a.personnel.SAR;
      bVal = b.personnel.SAR;
    } else if (sortField === "EMS") {
      aVal = a.personnel.EMS;
      bVal = b.personnel.EMS;
    } else {
      aVal = a.total;
      bVal = b.total;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  // Get sort icon for column
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // Flatten allocations for cleaner CSV export (removes nested personnel object)
  const flattenAllocations = () => {
    return sortedAllocations.map((alloc) => ({
      id: alloc.id,
      name: alloc.name,
      SAR: alloc.personnel.SAR,
      EMS: alloc.personnel.EMS,
      total: alloc.total,
    }));
  };

  // Export allocations
  const exportAllocations = (format: "csv" | "json") => {
    const flattened = flattenAllocations();
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === "csv") {
      content = json2csv(flattened, {
        excelBOM: true,
      });
      mimeType = "text/csv";
      filename = `${algorithmName}-allocations.csv`;
    } else {
      content = JSON.stringify(flattened, null, 2);
      mimeType = "application/json";
      filename = `${algorithmName}-allocations.json`;
    }

    downloadFile(content, filename, mimeType);
  };

  // Helper function to download file
  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string,
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalSAR = allocations.reduce(
    (sum, alloc) => sum + alloc.personnel.SAR,
    0,
  );
  const totalEMS = allocations.reduce(
    (sum, alloc) => sum + alloc.personnel.EMS,
    0,
  );
  const totalPersonnel = allocations.reduce(
    (sum, alloc) => sum + alloc.total,
    0,
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Resource Allocations by Barangay
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => exportAllocations("csv")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportAllocations("json")}>
              <FileJson className="mr-2 h-4 w-4" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    className="hover:text-foreground flex items-center"
                    onClick={() => handleSort("name")}
                  >
                    Barangay
                    {getSortIcon("name")}
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    className="hover:text-foreground ml-auto flex items-center"
                    onClick={() => handleSort("SAR")}
                  >
                    SAR
                    {getSortIcon("SAR")}
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    className="hover:text-foreground ml-auto flex items-center"
                    onClick={() => handleSort("EMS")}
                  >
                    EMS
                    {getSortIcon("EMS")}
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    className="hover:text-foreground ml-auto flex items-center"
                    onClick={() => handleSort("total")}
                  >
                    Total
                    {getSortIcon("total")}
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAllocations.map((alloc) => (
                <TableRow key={alloc.id}>
                  <TableCell className="font-medium">{alloc.name}</TableCell>
                  <TableCell className="text-right">
                    {alloc.personnel.SAR}
                  </TableCell>
                  <TableCell className="text-right">
                    {alloc.personnel.EMS}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {alloc.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div className="bg-muted/50 border-t px-4 py-3">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Total Personnel</span>
          <div className="flex gap-8">
            <span>SAR: {totalSAR}</span>
            <span>EMS: {totalEMS}</span>
            <span className="text-primary">Total: {totalPersonnel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
