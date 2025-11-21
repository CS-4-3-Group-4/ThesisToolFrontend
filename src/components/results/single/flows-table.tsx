import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import type { Flow } from "@/types";

interface FlowsTableProps {
  flows: Flow[];
  algorithmName: string;
}

type SortField = "classId" | "fromName" | "toName" | "amount";
type SortDirection = "asc" | "desc" | null;

export function FlowsTable({ flows, algorithmName }: FlowsTableProps) {
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

  // Sort flows
  const sortedFlows = [...flows].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    const aVal: string | number = a[sortField];
    const bVal: string | number = b[sortField];

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

  // Export flows
  const exportFlows = (format: "csv" | "json") => {
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === "csv") {
      content = json2csv(sortedFlows, {
        excelBOM: true,
      });
      mimeType = "text/csv";
      filename = `${algorithmName}-flows.csv`;
    } else {
      content = JSON.stringify(sortedFlows, null, 2);
      mimeType = "application/json";
      filename = `${algorithmName}-flows.json`;
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

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Resource Flows</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => exportFlows("csv")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportFlows("json")}>
              <FileJson className="mr-2 h-4 w-4" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="h-[400px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  className="hover:text-foreground flex items-center"
                  onClick={() => handleSort("classId")}
                >
                  Type
                  {getSortIcon("classId")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="hover:text-foreground flex items-center"
                  onClick={() => handleSort("fromName")}
                >
                  From
                  {getSortIcon("fromName")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="hover:text-foreground flex items-center"
                  onClick={() => handleSort("toName")}
                >
                  To
                  {getSortIcon("toName")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  className="hover:text-foreground ml-auto flex items-center"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                  {getSortIcon("amount")}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFlows.map((flow, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Badge
                    variant={flow.classId === "SAR" ? "default" : "secondary"}
                  >
                    {flow.classId}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{flow.fromName}</TableCell>
                <TableCell className="text-sm">{flow.toName}</TableCell>
                <TableCell className="text-right font-semibold">
                  {flow.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
