"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw } from "lucide-react";
import type { AlgorithmMode, RunMode } from "@/types";

interface ControlPanelProps {
  isRunning: boolean;
  currentIteration: number;
  totalGenerations: number;
  currentRun: number;
  totalRuns: number;
  bestFitnessOriginal: number | null;
  bestFitnessExtended: number | null;
  numFireflies: number;
  algorithmMode: AlgorithmMode;
  runMode: RunMode;
  onStart: () => void;
  onReset: () => void;
}

export function ControlPanel({
  isRunning,
  currentIteration,
  totalGenerations,
  currentRun,
  totalRuns,
  bestFitnessOriginal,
  bestFitnessExtended,
  numFireflies,
  algorithmMode,
  runMode,
  onStart,
  onReset,
}: ControlPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Control Panel</CardTitle>
        <CardDescription>Start or reset the simulation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={onStart}
            disabled={isRunning}
            className="flex-1"
            size="lg"
          >
            <Play className="mr-2 h-4 w-4" />
            Start
          </Button>
        </div>
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>

        <div className="space-y-3 pt-4">
          <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium">
              {runMode === "single" ? "Current Iteration" : "Current Run"}
            </span>
            {runMode === "single" && (
              <Badge variant="outline" className="font-mono">
                {currentIteration} / {totalGenerations}
              </Badge>
            )}
            {runMode === "multiple" && (
              <Badge variant="outline" className="font-mono">
                {currentRun} / {totalRuns}
              </Badge>
            )}
          </div>
          {(algorithmMode === "original" || algorithmMode === "both") && (
            <div className="bg-chart-1/10 flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">Original FA Fitness</span>
              <Badge variant="outline" className="font-mono">
                {bestFitnessOriginal !== null ? bestFitnessOriginal : "—"}
              </Badge>
            </div>
          )}
          {(algorithmMode === "extended" || algorithmMode === "both") && (
            <div className="bg-chart-2/10 flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">Extended FA Fitness</span>
              <Badge variant="outline" className="font-mono">
                {bestFitnessExtended !== null ? bestFitnessExtended : "—"}
              </Badge>
            </div>
          )}
          <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium">Population Size</span>
            <Badge variant="outline" className="font-mono">
              {numFireflies}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
