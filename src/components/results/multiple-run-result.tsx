import type { AlgorithmMode, MultipleRunResult } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrendingUp,
  Clock,
  MemoryStick,
  Info,
  Timer,
  Download,
  FileSpreadsheet,
  FileJson,
} from "lucide-react";
import { json2csv } from "json-2-csv";

interface MultipleRunResultProps {
  result: MultipleRunResult;
  algorithmMode: AlgorithmMode;
}

export function MultipleRunResult({
  result,
  algorithmMode,
}: MultipleRunResultProps) {
  const algorithmName = algorithmMode === "original" ? "FA" : "EFA";
  const algorithmFullName =
    algorithmMode === "original"
      ? "Firefly Algorithm (FA)"
      : "Extended Firefly Algorithm (EFA)";

  // Convert bytes to MB and KB
  const memoryAvgMB = (result.memory.average / 1024 / 1024).toFixed(2);
  const memoryAvgKB = (result.memory.average / 1024).toFixed(2);

  // Convert ms to seconds
  const executionAvgSeconds = (result.executionTime.average / 1000).toFixed(3);
  const totalDurationSeconds = (result.totalDurationMs / 1000).toFixed(2);

  // Flatten runs data for cleaner CSV export
  const flattenRuns = () => {
    return result.runs.map((run) => ({
      runNumber: run.runNumber,
      fitnessScore: run.fitnessMaximization,
      executionTime: run.executionTimeMs,
      memoryUsage: run.memoryBytes || 0,
    }));
  };

  // Export complete run data as JSON
  const exportCompleteData = () => {
    const completeData = {
      algorithm: algorithmName,
      result: result,
    };

    const content = JSON.stringify(completeData, null, 2);
    const filename = `${algorithmName}-multiple-runs-${Date.now()}.json`;
    downloadFile(content, filename, "application/json");
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{algorithmFullName} - Multiple Runs Results</CardTitle>
            <CardDescription>
              Statistical analysis of {result.totalRuns} runs
            </CardDescription>
          </div>
          <Button variant="default" onClick={exportCompleteData}>
            <Download className="mr-2 h-4 w-4" />
            Export Complete Data
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Avg Fitness Score */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Avg Fitness Score
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.fitnessMaximization.average.toFixed(6)}
              </div>
            </CardContent>
          </Card>

          {/* Avg Execution Time */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Avg Execution Time
                </CardDescription>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-semibold">Time Conversions:</p>
                        <p className="text-sm">
                          {result.executionTime.average.toFixed(2)} ms
                        </p>
                        <p className="text-sm">{executionAvgSeconds} seconds</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.executionTime.average.toFixed(2)}
              </div>
              <p className="text-muted-foreground text-xs">ms</p>
            </CardContent>
          </Card>

          {/* Avg Memory Usage */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4" />
                  Avg Memory Usage
                </CardDescription>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-semibold">Memory Conversions:</p>
                        <p className="text-sm">
                          {result.memory.average.toLocaleString()} bytes
                        </p>
                        <p className="text-sm">{memoryAvgKB} KB</p>
                        <p className="text-sm">{memoryAvgMB} MB</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.memory.average.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs">bytes</p>
            </CardContent>
          </Card>

          {/* Total Duration */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Total Duration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDurationSeconds}</div>
              <p className="text-muted-foreground text-xs">seconds</p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Statistics</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Fitness Score Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fitness Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Best</span>
                  <span className="font-semibold">
                    {result.fitnessMaximization.best.toFixed(6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Average</span>
                  <span className="font-semibold">
                    {result.fitnessMaximization.average.toFixed(6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Worst</span>
                  <span className="font-semibold">
                    {result.fitnessMaximization.worst.toFixed(6)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Execution Time Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Execution Time (ms)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Best</span>
                  <span className="font-semibold">
                    {result.executionTime.min.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Average</span>
                  <span className="font-semibold">
                    {result.executionTime.average.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Worst</span>
                  <span className="font-semibold">
                    {result.executionTime.max.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Memory Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Memory Usage (bytes)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Best</span>
                  <span className="font-semibold">
                    {result.memory.min.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Average</span>
                  <span className="font-semibold">
                    {result.memory.average.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Worst</span>
                  <span className="font-semibold">
                    {result.memory.max.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Individual Runs Table */}
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
                  <TableHead className="text-right">
                    Execution Time (ms)
                  </TableHead>
                  <TableHead className="text-right">
                    Memory Usage (bytes)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.runs.map((run) => (
                  <TableRow key={run.runNumber}>
                    <TableCell className="font-medium">
                      {run.runNumber}
                    </TableCell>
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
      </CardContent>
    </Card>
  );
}
