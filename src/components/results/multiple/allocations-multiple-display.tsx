import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { json2csv } from "json-2-csv";
import type { Allocation } from "@/types";

interface MultipleAllocationsDisplayProps {
  allocations: Allocation[][];
  algorithmName: string;
}

export function MultipleAllocationsDisplay({
  allocations,
  algorithmName,
}: MultipleAllocationsDisplayProps) {
  const [expandedRuns, setExpandedRuns] = useState<Set<number>>(new Set([0]));

  const toggleRun = (runIndex: number) => {
    const newExpanded = new Set(expandedRuns);
    if (newExpanded.has(runIndex)) {
      newExpanded.delete(runIndex);
    } else {
      newExpanded.add(runIndex);
    }
    setExpandedRuns(newExpanded);
  };

  const exportAllAllocations = (format: "csv" | "json") => {
    const allData = allocations.flatMap((runAllocs, runIdx) =>
      runAllocs.map((alloc) => ({
        run: runIdx + 1,
        id: alloc.id,
        name: alloc.name,
        SAR: alloc.personnel.SAR,
        EMS: alloc.personnel.EMS,
        total: alloc.total,
      })),
    );

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === "csv") {
      content = json2csv(allData, { excelBOM: true });
      mimeType = "text/csv";
      filename = `${algorithmName}-all-allocations.csv`;
    } else {
      content = JSON.stringify(allData, null, 2);
      mimeType = "application/json";
      filename = `${algorithmName}-all-allocations.json`;
    }

    downloadFile(content, filename, mimeType);
  };

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Resource Allocations - All Scenarios</CardTitle>
            <CardDescription>
              Allocations across {allocations.length} scenarios
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportAllAllocations("csv")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportAllAllocations("json")}>
                <FileJson className="mr-2 h-4 w-4" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {allocations.map((runAllocs, runIdx) => {
          const totalSAR = runAllocs.reduce(
            (sum, a) => sum + a.personnel.SAR,
            0,
          );
          const totalEMS = runAllocs.reduce(
            (sum, a) => sum + a.personnel.EMS,
            0,
          );
          const totalPersonnel = runAllocs.reduce((sum, a) => sum + a.total, 0);

          return (
            <Card key={runIdx}>
              <CardHeader
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleRun(runIdx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CardTitle className="text-base">
                      Scenario {runIdx + 1}
                    </CardTitle>
                    <div className="text-muted-foreground flex gap-4 text-sm">
                      <span>SAR: {totalSAR}</span>
                      <span>EMS: {totalEMS}</span>
                      <span className="text-foreground font-semibold">
                        Total: {totalPersonnel}
                      </span>
                    </div>
                  </div>
                  {expandedRuns.has(runIdx) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>
              </CardHeader>
              {expandedRuns.has(runIdx) && (
                <CardContent>
                  <ScrollArea className="h-[300px] rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Barangay</TableHead>
                          <TableHead className="text-right">SAR</TableHead>
                          <TableHead className="text-right">EMS</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {runAllocs.map((alloc) => (
                          <TableRow key={alloc.id}>
                            <TableCell className="font-medium">
                              {alloc.name}
                            </TableCell>
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
                </CardContent>
              )}
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
