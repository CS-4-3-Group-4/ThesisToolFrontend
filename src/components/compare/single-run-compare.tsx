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
import { UploadIcon, CheckCircle2, AlertTriangle } from "lucide-react";
import type { Flow } from "@/types";
import { ChartLineCompareIteration } from "../charts/chart-line-compare-iteration";

export interface SingleRunFile {
  algorithm: string;
  result: {
    fitnessMaximization: number;
    fitnessMinimization: number;
    executionTimeMs: number;
    memoryBytes: number;
  };
  iterations: {
    iteration: number;
    fitness: number;
  }[];
  allocations: {
    id: string;
    name: string;
    SAR: number;
    EMS: number;
    total: number;
  }[];
  flows: Flow[];
}

// Validation functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateSingleRunFile = (data: any): data is SingleRunFile => {
  if (!data || typeof data !== "object") return false;

  const hasRequiredTopLevel =
    typeof data.algorithm === "string" &&
    data.result &&
    Array.isArray(data.iterations) &&
    Array.isArray(data.allocations) &&
    Array.isArray(data.flows);

  const hasResultFields =
    data.result &&
    typeof data.result.fitnessMaximization === "number" &&
    typeof data.result.fitnessMinimization === "number" &&
    typeof data.result.executionTimeMs === "number" &&
    typeof data.result.memoryBytes === "number";

  const hasIterationStructure =
    data.iterations.length === 0 ||
    (typeof data.iterations[0].iteration === "number" &&
      typeof data.iterations[0].fitness === "number");

  return hasRequiredTopLevel && hasResultFields && hasIterationStructure;
};

// Single Run Comparison Component
export function SingleRunCompare() {
  const [FASingleFile, setFASingleFile] = useState<SingleRunFile | null>(null);
  const [EFASingleFile, setEFASingleFile] = useState<SingleRunFile | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSingleFileDrop = async (
    files: File[],
    setFile: (data: SingleRunFile) => void,
  ) => {
    const file = files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!validateSingleRunFile(json)) {
        setErrorMessage(
          "Invalid single run file structure. Please upload a valid algorithm result JSON.",
        );
        return;
      }

      setErrorMessage(null);
      setFile(json);
    } catch (error) {
      console.error("Invalid JSON file", error);
      setErrorMessage(
        "Invalid JSON file format. Please upload a valid JSON. Make sure that this is a single run result file.",
      );
    }
  };

  const handleResetSingle = () => {
    setFASingleFile(null);
    setEFASingleFile(null);
    setErrorMessage(null);
  };

  const bothSingleUploaded = FASingleFile && EFASingleFile;

  return (
    <div className="space-y-6">
      {(FASingleFile || EFASingleFile) && (
        <div className="mb-6 flex justify-center">
          <Button variant="destructive" onClick={handleResetSingle}>
            Reset Single Run Files
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:border-primary border-2 border-dashed">
          <CardHeader>
            <CardTitle>Firefly Algorithm (FA)</CardTitle>
            <CardDescription>
              Upload the single run result file for FA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dropzone
              accept={{ "application/json": [] }}
              maxFiles={1}
              maxSize={1024 * 1024 * 5}
              onDrop={(files) => handleSingleFileDrop(files, setFASingleFile)}
              src={FASingleFile ? [new File([], "FA-single.json")] : undefined}
            >
              {!FASingleFile ? (
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
                      {FASingleFile.algorithm}
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
              Upload the single run result file for EFA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dropzone
              accept={{ "application/json": [] }}
              maxFiles={1}
              maxSize={1024 * 1024 * 5}
              onDrop={(files) => handleSingleFileDrop(files, setEFASingleFile)}
              src={
                EFASingleFile ? [new File([], "EFA-single.json")] : undefined
              }
            >
              {!EFASingleFile ? (
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
                      {EFASingleFile.algorithm}
                    </p>
                  </div>
                </DropzoneContent>
              )}
            </Dropzone>
          </CardContent>
        </Card>
      </div>

      {bothSingleUploaded && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Algorithm Comparison — FA vs EFA (Single Run)
              </h2>
              <p className="text-muted-foreground text-sm">
                Side-by-side comparison of both algorithms
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Firefly Algorithm (FA)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Fitness (Max)
                    </span>
                    <span className="font-semibold">
                      {FASingleFile.result.fitnessMaximization.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Execution Time
                    </span>
                    <span className="font-semibold">
                      {(FASingleFile.result.executionTimeMs / 1000).toFixed(2)}{" "}
                      s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Memory Usage
                    </span>
                    <span className="font-semibold">
                      {(FASingleFile.result.memoryBytes / 1024 / 1024).toFixed(
                        2,
                      )}{" "}
                      MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Iterations
                    </span>
                    <span className="font-semibold">
                      {FASingleFile.iterations.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Extended Firefly Algorithm (EFA)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Fitness (Max)
                    </span>
                    <span className="font-semibold">
                      {EFASingleFile.result.fitnessMaximization.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Execution Time
                    </span>
                    <span className="font-semibold">
                      {(EFASingleFile.result.executionTimeMs / 1000).toFixed(2)}{" "}
                      s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Memory Usage
                    </span>
                    <span className="font-semibold">
                      {(EFASingleFile.result.memoryBytes / 1024 / 1024).toFixed(
                        2,
                      )}{" "}
                      MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Iterations
                    </span>
                    <span className="font-semibold">
                      {EFASingleFile.iterations.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <ChartLineCompareIteration
            faData={FASingleFile.iterations}
            efaData={EFASingleFile.iterations}
          />
        </div>
      )}

      {errorMessage && (
        <div className="bg-destructive/10 text-destructive flex items-center justify-center gap-2 rounded-md p-3 text-sm font-medium">
          <AlertTriangle className="h-4 w-4" />
          {errorMessage}
        </div>
      )}
    </div>
  );
}
