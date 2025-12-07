import type {
  AlgorithmMode,
  MultipleRunResult,
  ValidationReportMultiple,
} from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Clock,
  MemoryStick,
  Info,
  Timer,
  Download,
} from "lucide-react";
import { IndividualRunsTable } from "./individual-runs-table";
import { ValidationTableMultiple } from "./validation-multiple-table";
// import { ValidationBarangayTable } from "./validation-barangay-table";

interface MultipleRunResultProps {
  result: MultipleRunResult;
  algorithmMode: AlgorithmMode;
  validationReportMultiple: ValidationReportMultiple;
}

export function MultipleRunResult({
  result,
  algorithmMode,
  validationReportMultiple,
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
        <IndividualRunsTable runs={result.runs} algorithmName={algorithmName} />

        <div className="space-y-6 pt-6">
          <h3 className="text-lg font-semibold">Validation Analysis</h3>

          {/* Table 1: Overall Statistics */}
          <ValidationTableMultiple
            validationReportMultiple={validationReportMultiple}
          />

          {/* Table 2: Per-Barangay Statistics */}
          {/* <ValidationBarangayTable
            validationReportMultiple={validationReportMultiple}
            algorithmName={algorithmName}
          /> */}
        </div>
      </CardContent>
    </Card>
  );
}
