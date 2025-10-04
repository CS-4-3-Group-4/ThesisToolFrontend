"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Zap, Layers } from "lucide-react";
import type { RunMode } from "@/types";

interface RunModeSelectorProps {
  runMode: RunMode;
  numRuns: number;
  isRunning: boolean;
  onRunModeChange: (mode: RunMode) => void;
  onNumRunsChange: (num: number) => void;
}

export function RunModeSelector({
  runMode,
  numRuns,
  isRunning,
  onRunModeChange,
  onNumRunsChange,
}: RunModeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Mode</CardTitle>
        <CardDescription>
          Choose between single or multiple runs for statistical analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={runMode}
          onValueChange={(value) => onRunModeChange(value as RunMode)}
          disabled={isRunning}
          className="space-y-3"
        >
          <div className="hover:bg-muted/50 border-border flex items-center space-x-3 rounded-lg border p-4">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <Zap className="text-chart-1 h-4 w-4" />
                <span className="font-medium">Single Run</span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Run the algorithm once and visualize the process
              </p>
            </Label>
          </div>

          <div className="hover:bg-muted/50 border-border flex items-center space-x-3 rounded-lg border p-4">
            <RadioGroupItem value="multiple" id="multiple" />
            <Label htmlFor="multiple" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <Layers className="text-chart-2 h-4 w-4" />
                <span className="font-medium">Multiple Runs</span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Run multiple times to analyze performance statistics
              </p>
            </Label>
          </div>
        </RadioGroup>

        {runMode === "multiple" && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="numRuns">Number of Runs</Label>
            <Input
              id="numRuns"
              type="number"
              min={2}
              max={100}
              value={numRuns}
              onChange={(e) =>
                onNumRunsChange(Number.parseInt(e.target.value) || 30)
              }
              disabled={isRunning}
              className="font-mono"
            />
            <p className="text-muted-foreground text-xs">
              Recommended: 30 runs for statistical significance
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
