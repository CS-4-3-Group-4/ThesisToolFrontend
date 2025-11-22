import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Clock, MemoryStick, Info, TrendingUp, Download } from "lucide-react";
import { AllocationTable } from "./allocations-table";
import { FlowsTable } from "./flows-table";
import type {
  AlgorithmMode,
  Allocation,
  Flow,
  SingleRunResult,
  ValidationReportSingle,
} from "@/types";
import { ValidationTableSingle } from "./validation-single-table";

interface SingleRunResultProps {
  result: SingleRunResult;
  allocations: Allocation[];
  flows: Flow[];
  validationReportSingle: ValidationReportSingle;
  algorithmMode: AlgorithmMode;
  iterations: Array<{ iteration: number; fitness: number }>;
}

export function SingleRunResult({
  result,
  allocations,
  flows,
  validationReportSingle,
  algorithmMode,
  iterations,
}: SingleRunResultProps) {
  const algorithmName = algorithmMode === "original" ? "FA" : "EFA";
  const algorithmFullName =
    algorithmMode === "original"
      ? "Firefly Algorithm (FA)"
      : "Extended Firefly Algorithm (EFA)";

  // Convert bytes to MB for display
  const memoryMB = (result.memoryBytes / 1024 / 1024).toFixed(2);
  const memoryKB = (result.memoryBytes / 1024).toFixed(2);

  // Convert ms to seconds for display
  const executionSeconds = (result.executionTimeMs / 1000).toFixed(3);

  // Flatten allocations for cleaner CSV export (removes nested personnel object)
  const flattenAllocations = () => {
    return allocations.map((alloc) => ({
      id: alloc.id,
      name: alloc.name,
      SAR: alloc.personnel.SAR,
      EMS: alloc.personnel.EMS,
      total: alloc.total,
    }));
  };

  // Export complete run data as JSON
  const exportCompleteData = () => {
    const completeData = {
      algorithm: algorithmName,
      result: {
        fitnessMaximization: result.fitnessMaximization,
        fitnessMinimization: result.fitnessMinimization,
        executionTimeMs: result.executionTimeMs,
        memoryBytes: result.memoryBytes,
      },
      iterations: iterations,
      allocations: flattenAllocations(),
      flows: flows,
    };

    const content = JSON.stringify(completeData, null, 2);
    const filename = `${algorithmName}-complete-run-${Date.now()}.json`;
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
            <CardTitle>{algorithmFullName} - Single Run Results</CardTitle>
            <CardDescription>
              Performance metrics and resource allocation
            </CardDescription>
          </div>
          <Button variant="default" onClick={exportCompleteData}>
            <Download className="mr-2 h-4 w-4" />
            Export Complete Data
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Fitness Maximization */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Fitness
                </CardDescription>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-semibold">Fitness Values:</p>
                        <p className="text-sm">
                          Maximization: {result.fitnessMaximization.toFixed(6)}
                        </p>
                        <p className="text-sm">
                          Minimization: {result.fitnessMinimization.toFixed(6)}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.fitnessMaximization.toFixed(6)}
              </div>
            </CardContent>
          </Card>

          {/* Execution Time */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Execution Time
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
                          {result.executionTimeMs.toFixed(2)} ms
                        </p>
                        <p className="text-sm">{executionSeconds} seconds</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.executionTimeMs.toFixed(2)}
              </div>
              <p className="text-muted-foreground text-xs">ms</p>
            </CardContent>
          </Card>

          {/* Memory Usage */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4" />
                  Memory Usage
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
                          {result.memoryBytes.toLocaleString()} bytes
                        </p>
                        <p className="text-sm">{memoryKB} KB</p>
                        <p className="text-sm">{memoryMB} MB</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.memoryBytes.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs">bytes</p>
            </CardContent>
          </Card>
        </div>

        <AllocationTable
          allocations={allocations}
          algorithmName={algorithmName}
        />

        <FlowsTable flows={flows} algorithmName={algorithmName} />

        <ValidationTableSingle
          validationReportSingle={validationReportSingle}
          algorithmName={algorithmName}
        />
      </CardContent>
    </Card>
  );
}
