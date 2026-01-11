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
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileSpreadsheet,
  FileJson,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { json2csv } from "json-2-csv";
import type { Flow } from "@/types";

interface MultipleFlowsDisplayProps {
  flows: Flow[][];
  algorithmName: string;
}

export function MultipleFlowsDisplay({
  flows,
  algorithmName,
}: MultipleFlowsDisplayProps) {
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

  const exportAllFlows = (format: "csv" | "json") => {
    const allData = flows.flatMap((runFlows, runIdx) =>
      runFlows.map((flow) => ({
        run: runIdx + 1,
        classId: flow.classId,
        className: flow.className,
        fromId: flow.fromId,
        fromName: flow.fromName,
        toId: flow.toId,
        toName: flow.toName,
        amount: flow.amount,
      })),
    );

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === "csv") {
      content = json2csv(allData, { excelBOM: true });
      mimeType = "text/csv";
      filename = `${algorithmName}-all-flows.csv`;
    } else {
      content = JSON.stringify(allData, null, 2);
      mimeType = "application/json";
      filename = `${algorithmName}-all-flows.json`;
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
            <CardTitle>Resource Flows - All Scenarios</CardTitle>
            <CardDescription>
              Flows across {flows.length} scenarios
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
              <DropdownMenuItem onClick={() => exportAllFlows("csv")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportAllFlows("json")}>
                <FileJson className="mr-2 h-4 w-4" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {flows.map((runFlows, runIdx) => {
          const totalSAR = runFlows
            .filter((f) => f.classId === "SAR")
            .reduce((sum, f) => sum + f.amount, 0);
          const totalEMS = runFlows
            .filter((f) => f.classId === "EMS")
            .reduce((sum, f) => sum + f.amount, 0);

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
                      <Badge variant="outline">{runFlows.length} flows</Badge>
                      <span>SAR: {totalSAR}</span>
                      <span>EMS: {totalEMS}</span>
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
                        {runFlows.map((flow, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <Badge
                                variant={
                                  flow.classId === "SAR"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {flow.classId}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {flow.fromName}
                            </TableCell>
                            <TableCell className="text-sm">
                              {flow.toName}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {flow.amount}
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
