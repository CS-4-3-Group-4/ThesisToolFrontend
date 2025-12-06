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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileSpreadsheet,
  FileJson,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Info,
  TrendingUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { json2csv } from "json-2-csv";
import type { ValidationReportMultiple } from "@/types";
import { ChartLineBarangayTrends } from "@/components/charts/chart-line-barangay-trends";

interface ValidationBarangayTableProps {
  validationReportMultiple: ValidationReportMultiple;
  algorithmName: string;
}

type SortField =
  | "barangayName"
  | "meanPopulationCloseness"
  | "meanSarCloseness"
  | "meanEmsCloseness"
  | "cvPopulationCloseness"
  | "cvSarCloseness"
  | "cvEmsCloseness";

type SortDirection = "asc" | "desc" | null;

export function ValidationBarangayTable({
  validationReportMultiple,
  algorithmName,
}: ValidationBarangayTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
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

  // Sort per-barangay stats
  const sortedStats = [...validationReportMultiple.perBarangayStats].sort(
    (a, b) => {
      if (!sortField || !sortDirection) return 0;

      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    },
  );

  // Get sort icon
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

  // Export data
  const exportValidation = (format: "csv" | "json") => {
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === "csv") {
      content = json2csv(sortedStats, { excelBOM: true });
      mimeType = "text/csv";
      filename = `${algorithmName}-per-barangay-stats.csv`;
    } else {
      content = JSON.stringify({ perBarangayStats: sortedStats }, null, 2);
      mimeType = "application/json";
      filename = `${algorithmName}-per-barangay-stats.json`;
    }

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

  const getCVBadgeVariant = (cv: number) => {
    if (cv <= 0.1) return "default";
    if (cv <= 0.2) return "secondary";
    return "destructive";
  };

  const getCVLabel = (cv: number) => {
    if (cv <= 0.1) return "Excellent";
    if (cv <= 0.2) return "Good";
    return "Variable";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <CardTitle>Per-Barangay Statistics</CardTitle>
              <CardDescription>
                Detailed metrics for each barangay across all runs
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <div className="space-y-2">
                    <p className="font-semibold">Understanding the metrics:</p>
                    <p className="text-xs">
                      <strong>Mean:</strong> Average value across all runs
                    </p>
                    <p className="text-xs">
                      <strong>Std Dev:</strong> Standard deviation (variability)
                    </p>
                    <p className="text-xs">
                      <strong>CV:</strong> Coefficient of Variation = Std Dev /
                      Mean (normalized consistency measure)
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportValidation("csv")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportValidation("json")}>
                <FileJson className="mr-2 h-4 w-4" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <ScrollArea className="h-[600px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-background sticky left-0 z-10 w-[200px]">
                    <button
                      className="hover:text-foreground flex items-center whitespace-nowrap"
                      onClick={() => handleSort("barangayName")}
                    >
                      Barangay
                      {getSortIcon("barangayName")}
                    </button>
                  </TableHead>

                  {/* Trend column */}
                  <TableHead className="bg-background sticky left-[200px] z-10 w-[60px] text-center">
                    Trend
                  </TableHead>

                  {/* Population Closeness */}
                  <TableHead colSpan={3} className="border-l text-center">
                    Population Closeness
                  </TableHead>

                  {/* SAR Closeness */}
                  <TableHead colSpan={3} className="border-l text-center">
                    SAR Closeness
                  </TableHead>

                  {/* EMS Closeness */}
                  <TableHead colSpan={3} className="border-l text-center">
                    EMS Closeness
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="bg-background sticky left-0 z-10"></TableHead>
                  <TableHead className="bg-background sticky left-[200px] z-10"></TableHead>

                  {/* Population subheaders */}
                  <TableHead className="text-right">
                    <button
                      className="hover:text-foreground ml-auto flex items-center text-xs whitespace-nowrap"
                      onClick={() => handleSort("meanPopulationCloseness")}
                    >
                      Mean
                      {getSortIcon("meanPopulationCloseness")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right text-xs">Std Dev</TableHead>
                  <TableHead className="text-center">
                    <button
                      className="hover:text-foreground mx-auto flex items-center text-xs whitespace-nowrap"
                      onClick={() => handleSort("cvPopulationCloseness")}
                    >
                      CV
                      {getSortIcon("cvPopulationCloseness")}
                    </button>
                  </TableHead>

                  {/* SAR subheaders */}
                  <TableHead className="border-l text-right">
                    <button
                      className="hover:text-foreground ml-auto flex items-center text-xs whitespace-nowrap"
                      onClick={() => handleSort("meanSarCloseness")}
                    >
                      Mean
                      {getSortIcon("meanSarCloseness")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right text-xs">Std Dev</TableHead>
                  <TableHead className="text-center">
                    <button
                      className="hover:text-foreground mx-auto flex items-center text-xs whitespace-nowrap"
                      onClick={() => handleSort("cvSarCloseness")}
                    >
                      CV
                      {getSortIcon("cvSarCloseness")}
                    </button>
                  </TableHead>

                  {/* EMS subheaders */}
                  <TableHead className="border-l text-right">
                    <button
                      className="hover:text-foreground ml-auto flex items-center text-xs whitespace-nowrap"
                      onClick={() => handleSort("meanEmsCloseness")}
                    >
                      Mean
                      {getSortIcon("meanEmsCloseness")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right text-xs">Std Dev</TableHead>
                  <TableHead className="text-center">
                    <button
                      className="hover:text-foreground mx-auto flex items-center text-xs whitespace-nowrap"
                      onClick={() => handleSort("cvEmsCloseness")}
                    >
                      CV
                      {getSortIcon("cvEmsCloseness")}
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStats.map((stat) => (
                  <TableRow key={stat.barangayId}>
                    <TableCell className="bg-background sticky left-0 z-10 font-medium">
                      {stat.barangayName}
                    </TableCell>

                    {/* Trend button */}
                    <TableCell className="bg-background sticky left-[200px] z-10 text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] !max-w-[75vw] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Barangay Trends: {stat.barangayName}
                            </DialogTitle>
                            <DialogDescription>
                              View how this barangay's validation metrics
                              changed across all{" "}
                              {validationReportMultiple.individualRuns.length}{" "}
                              runs
                            </DialogDescription>
                          </DialogHeader>
                          <ChartLineBarangayTrends
                            barangayName={stat.barangayName}
                            barangayId={stat.barangayId}
                            individualRuns={
                              validationReportMultiple.individualRuns
                            }
                          />
                        </DialogContent>
                      </Dialog>
                    </TableCell>

                    {/* Population Closeness */}
                    <TableCell className="text-right">
                      {stat.meanPopulationCloseness.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right text-xs">
                      {stat.stdPopulationCloseness.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={getCVBadgeVariant(stat.cvPopulationCloseness)}
                      >
                        {getCVLabel(stat.cvPopulationCloseness)}
                      </Badge>
                      <div className="text-muted-foreground mt-1 text-xs">
                        {(stat.cvPopulationCloseness * 100).toFixed(1)}%
                      </div>
                    </TableCell>

                    {/* SAR Closeness */}
                    <TableCell className="border-l text-right">
                      {stat.meanSarCloseness.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right text-xs">
                      {stat.stdSarCloseness.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getCVBadgeVariant(stat.cvSarCloseness)}>
                        {getCVLabel(stat.cvSarCloseness)}
                      </Badge>
                      <div className="text-muted-foreground mt-1 text-xs">
                        {(stat.cvSarCloseness * 100).toFixed(1)}%
                      </div>
                    </TableCell>

                    {/* EMS Closeness */}
                    <TableCell className="border-l text-right">
                      {stat.meanEmsCloseness.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right text-xs">
                      {stat.stdEmsCloseness.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getCVBadgeVariant(stat.cvEmsCloseness)}>
                        {getCVLabel(stat.cvEmsCloseness)}
                      </Badge>
                      <div className="text-muted-foreground mt-1 text-xs">
                        {(stat.cvEmsCloseness * 100).toFixed(1)}%
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="bg-muted/50 text-muted-foreground mt-4 rounded-md px-4 py-3 text-xs">
          <strong>CV Legend:</strong> Excellent (≤10%), Good (≤20%), Variable
          (&gt;20%) | Lower CV = More consistent allocations across runs
        </div>
      </CardContent>
    </Card>
  );
}
