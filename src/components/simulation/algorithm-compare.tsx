"use client";

import { useState } from "react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { UploadIcon, CheckCircle2 } from "lucide-react";
import type { Flow } from "@/types";
import { ChartLineCompareIteration } from "../charts/performance/chart-line-compare-iteration";

export interface AlgorithmFile {
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

export function AlgorithmCompare() {
  const [FAFile, setFAFile] = useState<AlgorithmFile | null>(null);
  const [EFAFile, setEFAFile] = useState<AlgorithmFile | null>(null);

  const handleFileDrop = async (
    files: File[],
    setFile: (data: AlgorithmFile) => void,
  ) => {
    const file = files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json: AlgorithmFile = JSON.parse(text);
      setFile(json);
    } catch (error) {
      console.error("Invalid JSON file", error);
    }
  };

  const bothUploaded = FAFile && EFAFile;

  return (
    <div className="space-y-8">
      {/* === Upload Cards === */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 🔶 Firefly Algorithm */}
        <Card className="hover:border-primary border-2 border-dashed transition-all duration-200">
          <CardHeader>
            <CardTitle>Firefly Algorithm (FA)</CardTitle>
            <CardDescription>
              Upload the result file for the Firefly Algorithm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dropzone
              accept={{ "application/json": [] }}
              maxFiles={1}
              maxSize={1024 * 1024 * 5}
              onDrop={(files) => handleFileDrop(files, setFAFile)}
              src={FAFile ? [new File([], "FAFile.json")] : undefined}
            >
              {!FAFile ? (
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
                    <p className="text-sm font-medium">
                      FA File Loaded Successfully
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {FAFile.algorithm}
                    </p>
                  </div>
                </DropzoneContent>
              )}
            </Dropzone>
          </CardContent>
        </Card>

        {/* 🔷 Extended Firefly Algorithm */}
        <Card className="hover:border-primary border-2 border-dashed transition-all duration-200">
          <CardHeader>
            <CardTitle>Extended Firefly Algorithm (EFA)</CardTitle>
            <CardDescription>
              Upload the result file for the Extended Firefly Algorithm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dropzone
              accept={{ "application/json": [] }}
              maxFiles={1}
              maxSize={1024 * 1024 * 5}
              onDrop={(files) => handleFileDrop(files, setEFAFile)}
              src={EFAFile ? [new File([], "EFAFile.json")] : undefined}
            >
              {!EFAFile ? (
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
                    <p className="text-sm font-medium">
                      EFA File Loaded Successfully
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {EFAFile.algorithm}
                    </p>
                  </div>
                </DropzoneContent>
              )}
            </Dropzone>
          </CardContent>
        </Card>
      </div>

      {/* === Comparison Section === */}
      {bothUploaded && (
        <div className="space-y-6">
          <div>
            <h2 className="text-center text-2xl font-bold">
              Algorithm Comparison — FA vs EFA (Single Run)
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Side-by-side comparison of both algorithms
            </p>
          </div>

          {/* Metrics */}
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
                      {FAFile.result.fitnessMaximization.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Execution Time
                    </span>
                    <span className="font-semibold">
                      {(FAFile.result.executionTimeMs / 1000).toFixed(2)} s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Memory Usage
                    </span>
                    <span className="font-semibold">
                      {(FAFile.result.memoryBytes / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Iterations
                    </span>
                    <span className="font-semibold">
                      {FAFile.iterations.length}
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
                      {EFAFile.result.fitnessMaximization.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Execution Time
                    </span>
                    <span className="font-semibold">
                      {(EFAFile.result.executionTimeMs / 1000).toFixed(2)} s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Memory Usage
                    </span>
                    <span className="font-semibold">
                      {(EFAFile.result.memoryBytes / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Iterations
                    </span>
                    <span className="font-semibold">
                      {EFAFile.allocations.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <ChartLineCompareIteration
            faData={FAFile.iterations}
            efaData={EFAFile.iterations}
          />
        </div>
      )}
    </div>
  );
}
