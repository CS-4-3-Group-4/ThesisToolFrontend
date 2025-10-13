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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Clock,
  MemoryStick,
  Info,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileJson,
} from "lucide-react";
import { json2csv } from "json-2-csv";
import type { AlgorithmMode, Allocation, Flow, SingleRunResult } from "@/types";

interface SingleRunResultProps {
  result: SingleRunResult;
  allocations: Allocation[];
  flows: Flow[];
  algorithmMode: AlgorithmMode;
  iterations: Array<{ iteration: number; fitness: number }>;
}

export function SingleRunResult({
  result,
  allocations,
  flows,
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

        {/* Allocations Table */}
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
                    <TableHead>Barangay</TableHead>
                    <TableHead className="text-right">SAR</TableHead>
                    <TableHead className="text-right">EMS</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map((alloc) => (
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
          </div>
          <div className="bg-muted/50 border-t px-4 py-3">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Total Personnel</span>
              <div className="flex gap-8">
                <span>
                  SAR:{" "}
                  {allocations.reduce(
                    (sum, alloc) => sum + alloc.personnel.SAR,
                    0,
                  )}
                </span>
                <span>
                  EMS:{" "}
                  {allocations.reduce(
                    (sum, alloc) => sum + alloc.personnel.EMS,
                    0,
                  )}
                </span>
                <span className="text-primary">
                  Total:{" "}
                  {allocations.reduce((sum, alloc) => sum + alloc.total, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Flows */}
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
                        variant={
                          flow.classId === "SAR" ? "default" : "secondary"
                        }
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
      </CardContent>
    </Card>
  );
}
