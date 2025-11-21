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
import { Download, FileSpreadsheet, FileJson } from "lucide-react";
import { json2csv } from "json-2-csv";
import type { Flow } from "@/types";

interface FlowsTableProps {
  flows: Flow[];
  algorithmName: string;
}

export function FlowsTable({ flows, algorithmName }: FlowsTableProps) {
  // Export flows
  const exportFlows = (format: "csv" | "json") => {
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === "csv") {
      content = json2csv(flows, {
        excelBOM: true,
      });
      mimeType = "text/csv";
      filename = `${algorithmName}-flows.csv`;
    } else {
      content = JSON.stringify(flows, null, 2);
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
              <TableHead>Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flows.map((flow, idx) => (
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
