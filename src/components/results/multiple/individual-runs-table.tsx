import type { MultipleRunResult } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Download, FileSpreadsheet, FileJson } from "lucide-react";
import { json2csv } from "json-2-csv";

interface IndividualRunsTableProps {
  runs: MultipleRunResult["runs"];
  algorithmName: string;
}

export function IndividualRunsTable({
  runs,
  algorithmName,
}: IndividualRunsTableProps) {
  // Flatten runs data for cleaner CSV export
  const flattenRuns = () => {
    return runs.map((run) => ({
      runNumber: run.runNumber,
      fitnessScore: run.fitnessMaximization,
      executionTime: run.executionTimeMs,
      memoryUsage: run.memoryBytes || 0,
    }));
  };

  // Export individual runs
  const exportRuns = (format: "csv" | "json") => {
    const flattened = flattenRuns();
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === "csv") {
      content = json2csv(flattened, {
        excelBOM: true,
      });
      mimeType = "text/csv";
      filename = `${algorithmName}-multiple-runs.csv`;
    } else {
      content = JSON.stringify(flattened, null, 2);
      mimeType = "application/json";
      filename = `${algorithmName}-multiple-runs.json`;
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
        <h3 className="text-lg font-semibold">Individual Run Details</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => exportRuns("csv")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportRuns("json")}>
              <FileJson className="mr-2 h-4 w-4" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="h-[400px] rounded-md border p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Run #</TableHead>
              <TableHead className="text-right">Fitness Score</TableHead>
              <TableHead className="text-right">Execution Time (ms)</TableHead>
              <TableHead className="text-right">Memory Usage (bytes)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow key={run.runNumber}>
                <TableCell className="font-medium">{run.runNumber}</TableCell>
                <TableCell className="text-right">
                  {run.fitnessMaximization.toFixed(6)}
                </TableCell>
                <TableCell className="text-right">
                  {run.executionTimeMs.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {run.memoryBytes?.toLocaleString() || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
