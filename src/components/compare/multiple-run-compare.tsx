import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UploadIcon,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { type ObjectiveData, type MultipleRunResult } from "@/types";
import {
  ChartLineCompareFitnessRun,
  ChartLineCompareExecutionTimeRun,
  ChartLineCompareMemoryUsageRun,
} from "../charts/chart-line-compare-runs";
import { json2csv } from "json-2-csv";

export interface MultipleRunFile {
  algorithm: string;
  result: MultipleRunResult;
}

// Validation functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateMultipleRunFile = (data: any): data is MultipleRunFile => {
  if (!data || typeof data !== "object") return false;

  const hasRequiredTopLevel = typeof data.algorithm === "string" && data.result;

  const hasResultFields =
    data.result &&
    typeof data.result.totalRuns === "number" &&
    typeof data.result.successfulRuns === "number" &&
    Array.isArray(data.result.runs) &&
    data.result.fitnessMaximization &&
    data.result.executionTime &&
    data.result.memory;

  return hasRequiredTopLevel && hasResultFields;
};

// Multiple Run Comparison Component
export function MultipleRunCompare() {
  const [FAMultipleFile, setFAMultipleFile] = useState<MultipleRunFile | null>(
    null,
  );
  const [EFAMultipleFile, setEFAMultipleFile] =
    useState<MultipleRunFile | null>(null);
  const [faObjectives, setFaObjectives] = useState<ObjectiveData | null>(null);
  const [efaObjectives, setEfaObjectives] = useState<ObjectiveData | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle objectives file drop
  const handleObjectivesFileDrop = async (
    files: File[],
    setFile: (data: ObjectiveData) => void,
  ) => {
    const file = files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (
        !json.objective1 ||
        !json.objective2 ||
        !json.objective3 ||
        !json.objective4 ||
        !json.objective5
      ) {
        setErrorMessage(
          "Invalid objectives file. Must contain all 5 objectives.",
        );
        return;
      }

      setErrorMessage(null);
      setFile(json);
    } catch (error) {
      console.error("Invalid JSON file", error);
      setErrorMessage("Invalid JSON file format.");
    }
  };

  // Export objectives comparison CSV
  const exportObjectivesCSV = () => {
    if (!faObjectives || !efaObjectives) return;

    const numRuns = Math.max(
      faObjectives.objective1.finalVals.length,
      efaObjectives.objective1.finalVals.length,
    );

    const headers = [
      "Run",
      "Objective1_FA",
      "Objective1_EFA",
      "Objective2_FA",
      "Objective2_EFA",
      "Objective3_FA",
      "Objective3_EFA",
      "Objective4_FA",
      "Objective4_EFA",
      "Objective5_FA",
      "Objective5_EFA",
    ];

    const formatValue = (val: number | "" | null | undefined) => {
      if (val === "" || val === null || val === undefined) return "";
      return Number(val).toFixed(6);
    };

    const rows = [];
    for (let i = 0; i < numRuns; i++) {
      rows.push([
        i + 1,
        formatValue(faObjectives.objective1.finalVals[i]),
        formatValue(efaObjectives.objective1.finalVals[i]),
        formatValue(faObjectives.objective2.finalVals[i]),
        formatValue(efaObjectives.objective2.finalVals[i]),
        formatValue(faObjectives.objective3.finalVals[i]),
        formatValue(efaObjectives.objective3.finalVals[i]),
        formatValue(faObjectives.objective4.finalVals[i]),
        formatValue(efaObjectives.objective4.finalVals[i]),
        formatValue(faObjectives.objective5.finalVals[i]),
        formatValue(efaObjectives.objective5.finalVals[i]),
      ]);
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FA-vs-EFA-objectives-comparison-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const objectiveHeaderBgMap = {
    objective1: {
      fa: "bg-blue-100 dark:bg-blue-900/50",
      efa: "bg-blue-200 dark:bg-blue-800/60",
    },
    objective2: {
      fa: "bg-purple-100 dark:bg-purple-900/50",
      efa: "bg-purple-200 dark:bg-purple-800/60",
    },
    objective3: {
      fa: "bg-orange-100 dark:bg-orange-900/50",
      efa: "bg-orange-200 dark:bg-orange-800/60",
    },
    objective4: {
      fa: "bg-teal-100 dark:bg-teal-900/50",
      efa: "bg-teal-200 dark:bg-teal-800/60",
    },
    objective5: {
      fa: "bg-pink-100 dark:bg-pink-900/50",
      efa: "bg-pink-200 dark:bg-pink-800/60",
    },
  };

  const objectiveBgMap: { [key: string]: { fa: string; efa: string } } = {
    objective1: {
      fa: "bg-blue-50 dark:bg-blue-950/30",
      efa: "bg-blue-100 dark:bg-blue-900/40",
    },
    objective2: {
      fa: "bg-purple-50 dark:bg-purple-950/30",
      efa: "bg-purple-100 dark:bg-purple-900/40",
    },
    objective3: {
      fa: "bg-orange-50 dark:bg-orange-950/30",
      efa: "bg-orange-100 dark:bg-orange-900/40",
    },
    objective4: {
      fa: "bg-teal-50 dark:bg-teal-950/30",
      efa: "bg-teal-100 dark:bg-teal-900/40",
    },
    objective5: {
      fa: "bg-pink-50 dark:bg-pink-950/30",
      efa: "bg-pink-100 dark:bg-pink-900/40",
    },
  };

  const handleMultipleFileDrop = async (
    files: File[],
    setFile: (data: MultipleRunFile) => void,
  ) => {
    const file = files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!validateMultipleRunFile(json)) {
        setErrorMessage(
          "Invalid multiple run file structure. Please upload a valid algorithm result JSON.",
        );
        return;
      }

      setErrorMessage(null);
      setFile(json);
    } catch (error) {
      console.error("Invalid JSON file", error);
      setErrorMessage(
        "Invalid JSON file format. Please upload a valid JSON. Make sure that this is a multiple runs result file.",
      );
    }
  };

  const handleResetMultiple = () => {
    setFAMultipleFile(null);
    setEFAMultipleFile(null);
    setErrorMessage(null);
  };

  const bothMultipleUploaded = FAMultipleFile && EFAMultipleFile;

  // Export comparison data
  const exportComparisonData = (
    metric: "fitness" | "executionTime" | "memory",
  ) => {
    if (!FAMultipleFile || !EFAMultipleFile) return;

    const faRuns = FAMultipleFile.result.runs;
    const efaRuns = EFAMultipleFile.result.runs;
    const maxLength = Math.max(faRuns.length, efaRuns.length);

    let data: Array<{ [key: string]: number | string }> = [];
    let metricLabel = "";
    let faKey = "";
    let efaKey = "";

    switch (metric) {
      case "fitness":
        metricLabel = "Fitness Score";
        faKey = `FA (${metricLabel})`;
        efaKey = `EFA (${metricLabel})`;
        data = Array.from({ length: maxLength }, (_, i) => ({
          [faKey]: faRuns[i]?.fitnessMaximization.toFixed(6) || "",
          [efaKey]: efaRuns[i]?.fitnessMaximization.toFixed(6) || "",
        }));
        break;
      case "executionTime":
        metricLabel = "Execution Time (ms)";
        faKey = `FA (${metricLabel})`;
        efaKey = `EFA (${metricLabel})`;
        data = Array.from({ length: maxLength }, (_, i) => ({
          [faKey]: faRuns[i]?.executionTimeMs.toFixed(2) || "",
          [efaKey]: efaRuns[i]?.executionTimeMs.toFixed(2) || "",
        }));
        break;
      case "memory":
        metricLabel = "Memory Usage (bytes)";
        faKey = `FA (${metricLabel})`;
        efaKey = `EFA (${metricLabel})`;
        data = Array.from({ length: maxLength }, (_, i) => ({
          [faKey]: faRuns[i]?.memoryBytes?.toString() || "",
          [efaKey]: efaRuns[i]?.memoryBytes?.toString() || "",
        }));
        break;
    }

    const csvContent = json2csv(data, {
      excelBOM: true,
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FA-vs-EFA-${metric}-comparison.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Calculate percentage changes
  const calculatePercentageChange = (
    newValue: number,
    originalValue: number,
  ) => {
    if (originalValue === 0) return 0;
    return ((newValue - originalValue) / originalValue) * 100;
  };

  // Determine color based on metric type and change direction
  const getChangeColor = (
    percentChange: number,
    metric: "fitness" | "time" | "memory",
  ): string => {
    if (metric === "fitness") {
      // For fitness: positive change is good (green), negative is bad (red)
      return percentChange >= 0 ? "text-green-500" : "text-red-500";
    } else {
      // For time and memory: negative change is good (green), positive is bad (red)
      return percentChange <= 0 ? "text-green-500" : "text-red-500";
    }
  };

  let percentageChanges = null;
  if (bothMultipleUploaded) {
    const fitnessChange = calculatePercentageChange(
      EFAMultipleFile.result.fitnessMaximization.average,
      FAMultipleFile.result.fitnessMaximization.average,
    );
    const executionTimeChange = calculatePercentageChange(
      EFAMultipleFile.result.executionTime.average,
      FAMultipleFile.result.executionTime.average,
    );
    const memoryChange = calculatePercentageChange(
      EFAMultipleFile.result.memory.average,
      FAMultipleFile.result.memory.average,
    );

    percentageChanges = {
      fitness: fitnessChange,
      executionTime: executionTimeChange,
      memory: memoryChange,
    };
  }

  return (
    <div className="space-y-6">
      {(FAMultipleFile || EFAMultipleFile) && (
        <div className="mb-6 flex justify-center">
          <Button variant="destructive" onClick={handleResetMultiple}>
            Reset Multiple Run Files
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:border-primary border-2 border-dashed">
          <CardHeader>
            <CardTitle>Firefly Algorithm (FA)</CardTitle>
            <CardDescription>
              Upload the multiple runs result file for FA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dropzone
              accept={{ "application/json": [] }}
              maxFiles={1}
              maxSize={1024 * 1024 * 5}
              onDrop={(files) =>
                handleMultipleFileDrop(files, setFAMultipleFile)
              }
              src={
                FAMultipleFile ? [new File([], "FA-multiple.json")] : undefined
              }
            >
              {!FAMultipleFile ? (
                <DropzoneEmptyState>
                  <div className="flex flex-col items-center py-8">
                    <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                      <UploadIcon className="text-muted-foreground h-6 w-6" />
                    </div>
                    <p className="mt-4 text-sm font-medium">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-muted-foreground text-xs">
                      JSON file only (max 5MB)
                    </p>
                  </div>
                </DropzoneEmptyState>
              ) : (
                <DropzoneContent>
                  <div className="flex flex-col items-center py-8">
                    <CheckCircle2 className="mb-2 h-8 w-8 text-green-500" />
                    <p className="text-sm font-medium">FA File Loaded</p>
                    <p className="text-muted-foreground text-xs">
                      {FAMultipleFile.result.totalRuns} runs
                    </p>
                  </div>
                </DropzoneContent>
              )}
            </Dropzone>
          </CardContent>
        </Card>

        <Card className="hover:border-primary border-2 border-dashed">
          <CardHeader>
            <CardTitle>Extended Firefly Algorithm (EFA)</CardTitle>
            <CardDescription>
              Upload the multiple runs result file for EFA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dropzone
              accept={{ "application/json": [] }}
              maxFiles={1}
              maxSize={1024 * 1024 * 5}
              onDrop={(files) =>
                handleMultipleFileDrop(files, setEFAMultipleFile)
              }
              src={
                EFAMultipleFile
                  ? [new File([], "EFA-multiple.json")]
                  : undefined
              }
            >
              {!EFAMultipleFile ? (
                <DropzoneEmptyState>
                  <div className="flex flex-col items-center py-8">
                    <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                      <UploadIcon className="text-muted-foreground h-6 w-6" />
                    </div>
                    <p className="mt-4 text-sm font-medium">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-muted-foreground text-xs">
                      JSON file only (max 5MB)
                    </p>
                  </div>
                </DropzoneEmptyState>
              ) : (
                <DropzoneContent>
                  <div className="flex flex-col items-center py-8">
                    <CheckCircle2 className="mb-2 h-8 w-8 text-green-500" />
                    <p className="text-sm font-medium">EFA File Loaded</p>
                    <p className="text-muted-foreground text-xs">
                      {EFAMultipleFile.result.totalRuns} runs
                    </p>
                  </div>
                </DropzoneContent>
              )}
            </Dropzone>
          </CardContent>
        </Card>
      </div>

      {bothMultipleUploaded && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Algorithm Comparison — FA vs EFA (Multiple Runs)
              </h2>
              <p className="text-muted-foreground text-sm">
                Statistical comparison across multiple runs
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Comparison
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => exportComparisonData("fitness")}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export Fitness Score
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportComparisonData("executionTime")}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export Execution Time
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportComparisonData("memory")}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export Memory Usage
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Firefly Algorithm (FA)
                </CardTitle>
                <CardDescription>
                  Statistics from {FAMultipleFile.result.totalRuns} runs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold">Fitness Score</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best</span>
                      <span className="font-medium">
                        {FAMultipleFile.result.fitnessMaximization.best.toFixed(
                          6,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average</span>
                      <span className="font-medium">
                        {FAMultipleFile.result.fitnessMaximization.average.toFixed(
                          6,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Worst</span>
                      <span className="font-medium">
                        {FAMultipleFile.result.fitnessMaximization.worst.toFixed(
                          6,
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Execution Time (ms)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best</span>
                      <span className="font-medium">
                        {FAMultipleFile.result.executionTime.min.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average</span>
                      <span className="font-medium">
                        {FAMultipleFile.result.executionTime.average.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Worst</span>
                      <span className="font-medium">
                        {FAMultipleFile.result.executionTime.max.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Memory Usage (bytes)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best</span>
                      <span className="font-medium">
                        {FAMultipleFile.result.memory.min.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average</span>
                      <span className="font-medium">
                        {FAMultipleFile.result.memory.average.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Worst</span>
                      <span className="font-medium">
                        {FAMultipleFile.result.memory.max.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Extended Firefly Algorithm (EFA)
                </CardTitle>
                <CardDescription>
                  Statistics from {EFAMultipleFile.result.totalRuns} runs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold">Fitness Score</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best</span>
                      <span className="font-medium">
                        {EFAMultipleFile.result.fitnessMaximization.best.toFixed(
                          6,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average</span>
                      <span className="font-medium">
                        {EFAMultipleFile.result.fitnessMaximization.average.toFixed(
                          6,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Worst</span>
                      <span className="font-medium">
                        {EFAMultipleFile.result.fitnessMaximization.worst.toFixed(
                          6,
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Execution Time (ms)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best</span>
                      <span className="font-medium">
                        {EFAMultipleFile.result.executionTime.min.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average</span>
                      <span className="font-medium">
                        {EFAMultipleFile.result.executionTime.average.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Worst</span>
                      <span className="font-medium">
                        {EFAMultipleFile.result.executionTime.max.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Memory Usage (bytes)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best</span>
                      <span className="font-medium">
                        {EFAMultipleFile.result.memory.min.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average</span>
                      <span className="font-medium">
                        {EFAMultipleFile.result.memory.average.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Worst</span>
                      <span className="font-medium">
                        {EFAMultipleFile.result.memory.max.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {percentageChanges && (
            <Card className="mx-24">
              <CardHeader>
                <CardTitle className="text-base">
                  Percentage Change (EFA vs FA)
                </CardTitle>
                <CardDescription>
                  Percentage change in average metrics for EFA compared to FA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold">
                    Average Metrics Comparison
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Fitness Score
                      </span>
                      <span
                        className={`font-medium ${getChangeColor(percentageChanges.fitness, "fitness")}`}
                      >
                        {percentageChanges.fitness >= 0 ? "+" : ""}
                        {percentageChanges.fitness.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Execution Time
                      </span>
                      <span
                        className={`font-medium ${getChangeColor(percentageChanges.executionTime, "time")}`}
                      >
                        {percentageChanges.executionTime >= 0 ? "+" : ""}
                        {percentageChanges.executionTime.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Memory Usage
                      </span>
                      <span
                        className={`font-medium ${getChangeColor(percentageChanges.memory, "memory")}`}
                      >
                        {percentageChanges.memory >= 0 ? "+" : ""}
                        {percentageChanges.memory.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mx-24 space-y-6">
            <ChartLineCompareFitnessRun
              faData={FAMultipleFile.result}
              efaData={EFAMultipleFile.result}
            />
            <ChartLineCompareExecutionTimeRun
              faData={FAMultipleFile.result}
              efaData={EFAMultipleFile.result}
            />
            <ChartLineCompareMemoryUsageRun
              faData={FAMultipleFile.result}
              efaData={EFAMultipleFile.result}
            />
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-destructive/10 text-destructive flex items-center justify-center gap-2 rounded-md p-3 text-sm font-medium">
          <AlertTriangle className="h-4 w-4" />
          {errorMessage}
        </div>
      )}

      {/* Objectives Comparison Section */}
      {bothMultipleUploaded && (
        <div className="mx-24 mt-6 space-y-6 border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Objectives Comparison</h2>
              <p className="text-muted-foreground text-sm">
                Upload objectives JSON files to compare final values
              </p>
            </div>
            {faObjectives && efaObjectives && (
              <Button variant="outline" onClick={exportObjectivesCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export Objectives CSV
              </Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:border-primary border-2 border-dashed">
              <CardHeader>
                <CardTitle className="text-base">FA Objectives</CardTitle>
                <CardDescription>
                  Upload FA objectives JSON file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dropzone
                  accept={{ "application/json": [] }}
                  maxFiles={1}
                  maxSize={1024 * 1024 * 10}
                  onDrop={(files) =>
                    handleObjectivesFileDrop(files, setFaObjectives)
                  }
                  src={
                    faObjectives
                      ? [new File([], "FA-objectives.json")]
                      : undefined
                  }
                >
                  {!faObjectives ? (
                    <DropzoneEmptyState>
                      <div className="flex flex-col items-center py-4">
                        <UploadIcon className="text-muted-foreground mb-2 h-8 w-8" />
                        <p className="text-sm font-medium">
                          Upload FA Objectives
                        </p>
                      </div>
                    </DropzoneEmptyState>
                  ) : (
                    <DropzoneContent>
                      <div className="flex flex-col items-center py-4">
                        <CheckCircle2 className="mb-2 h-8 w-8 text-green-500" />
                        <p className="text-sm font-medium">
                          FA Objectives Loaded
                        </p>
                      </div>
                    </DropzoneContent>
                  )}
                </Dropzone>
              </CardContent>
            </Card>

            <Card className="hover:border-primary border-2 border-dashed">
              <CardHeader>
                <CardTitle className="text-base">EFA Objectives</CardTitle>
                <CardDescription>
                  Upload EFA objectives JSON file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dropzone
                  accept={{ "application/json": [] }}
                  maxFiles={1}
                  maxSize={1024 * 1024 * 10}
                  onDrop={(files) =>
                    handleObjectivesFileDrop(files, setEfaObjectives)
                  }
                  src={
                    efaObjectives
                      ? [new File([], "EFA-objectives.json")]
                      : undefined
                  }
                >
                  {!efaObjectives ? (
                    <DropzoneEmptyState>
                      <div className="flex flex-col items-center py-4">
                        <UploadIcon className="text-muted-foreground mb-2 h-8 w-8" />
                        <p className="text-sm font-medium">
                          Upload EFA Objectives
                        </p>
                      </div>
                    </DropzoneEmptyState>
                  ) : (
                    <DropzoneContent>
                      <div className="flex flex-col items-center py-4">
                        <CheckCircle2 className="mb-2 h-8 w-8 text-green-500" />
                        <p className="text-sm font-medium">
                          EFA Objectives Loaded
                        </p>
                      </div>
                    </DropzoneContent>
                  )}
                </Dropzone>
              </CardContent>
            </Card>
          </div>

          {faObjectives && efaObjectives && (
            <Card>
              <CardHeader>
                <CardTitle>Objectives Comparison Table</CardTitle>
                <CardDescription>
                  Final values for all objectives across all runs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="bg-background sticky left-0 p-2 text-left font-semibold">
                          Run
                        </th>

                        <th
                          className={`p-2 text-right ${objectiveHeaderBgMap.objective1.fa}`}
                        >
                          Obj1 FA
                        </th>
                        <th
                          className={`p-2 text-right ${objectiveHeaderBgMap.objective1.efa}`}
                        >
                          Obj1 EFA
                        </th>

                        <th
                          className={`p-2 text-right ${objectiveHeaderBgMap.objective2.fa}`}
                        >
                          Obj2 FA
                        </th>
                        <th
                          className={`p-2 text-right ${objectiveHeaderBgMap.objective2.efa}`}
                        >
                          Obj2 EFA
                        </th>

                        <th
                          className={`p-2 text-right ${objectiveHeaderBgMap.objective3.fa}`}
                        >
                          Obj3 FA
                        </th>
                        <th
                          className={`p-2 text-right ${objectiveHeaderBgMap.objective3.efa}`}
                        >
                          Obj3 EFA
                        </th>

                        <th
                          className={`p-2 text-right ${objectiveHeaderBgMap.objective4.fa}`}
                        >
                          Obj4 FA
                        </th>
                        <th
                          className={`p-2 text-right ${objectiveHeaderBgMap.objective4.efa}`}
                        >
                          Obj4 EFA
                        </th>

                        <th
                          className={`p-2 text-right ${objectiveHeaderBgMap.objective5.fa}`}
                        >
                          Obj5 FA
                        </th>
                        <th
                          className={`p-2 text-right ${objectiveHeaderBgMap.objective5.efa}`}
                        >
                          Obj5 EFA
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {Array.from({
                        length: Math.max(
                          faObjectives.objective1.finalVals.length,
                          efaObjectives.objective1.finalVals.length,
                        ),
                      }).map((_, idx) => (
                        <tr key={idx} className="hover:bg-muted/40 border-b">
                          <td className="bg-background sticky left-0 p-2 font-medium">
                            {idx + 1}
                          </td>

                          <td
                            className={`p-2 text-right font-mono ${objectiveBgMap.objective1.fa}`}
                          >
                            {faObjectives.objective1.finalVals[idx]?.toFixed(
                              6,
                            ) || "-"}
                          </td>
                          <td
                            className={`p-2 text-right font-mono ${objectiveBgMap.objective1.efa}`}
                          >
                            {efaObjectives.objective1.finalVals[idx]?.toFixed(
                              6,
                            ) || "-"}
                          </td>

                          <td
                            className={`p-2 text-right font-mono ${objectiveBgMap.objective2.fa}`}
                          >
                            {faObjectives.objective2.finalVals[idx]?.toFixed(
                              6,
                            ) || "-"}
                          </td>
                          <td
                            className={`p-2 text-right font-mono ${objectiveBgMap.objective2.efa}`}
                          >
                            {efaObjectives.objective2.finalVals[idx]?.toFixed(
                              6,
                            ) || "-"}
                          </td>

                          <td
                            className={`p-2 text-right font-mono ${objectiveBgMap.objective3.fa}`}
                          >
                            {faObjectives.objective3.finalVals[idx]?.toFixed(
                              6,
                            ) || "-"}
                          </td>
                          <td
                            className={`p-2 text-right font-mono ${objectiveBgMap.objective3.efa}`}
                          >
                            {efaObjectives.objective3.finalVals[idx]?.toFixed(
                              6,
                            ) || "-"}
                          </td>

                          <td
                            className={`p-2 text-right font-mono ${objectiveBgMap.objective4.fa}`}
                          >
                            {faObjectives.objective4.finalVals[idx]?.toFixed(
                              6,
                            ) || "-"}
                          </td>
                          <td
                            className={`p-2 text-right font-mono ${objectiveBgMap.objective4.efa}`}
                          >
                            {efaObjectives.objective4.finalVals[idx]?.toFixed(
                              6,
                            ) || "-"}
                          </td>

                          <td
                            className={`p-2 text-right font-mono ${objectiveBgMap.objective5.fa}`}
                          >
                            {faObjectives.objective5.finalVals[idx]?.toFixed(
                              6,
                            ) || "-"}
                          </td>
                          <td
                            className={`p-2 text-right font-mono ${objectiveBgMap.objective5.efa}`}
                          >
                            {efaObjectives.objective5.finalVals[idx]?.toFixed(
                              6,
                            ) || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
