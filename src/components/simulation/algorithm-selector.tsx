"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AlgorithmMode } from "@/types";

interface AlgorithmSelectorProps {
  algorithmMode: AlgorithmMode;
  onAlgorithmModeChange: (mode: AlgorithmMode) => void;
  isRunning: boolean;
}

export function AlgorithmSelector({
  algorithmMode,
  onAlgorithmModeChange,
  isRunning,
}: AlgorithmSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Algorithm Selection</CardTitle>
        <CardDescription>
          Choose which algorithm(s) to run and compare
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Label htmlFor="algorithm-mode" className="min-w-fit">
            Algorithm Mode
          </Label>
          <Select
            value={algorithmMode}
            onValueChange={(value) =>
              onAlgorithmModeChange(value as AlgorithmMode)
            }
            disabled={isRunning}
          >
            <SelectTrigger id="algorithm-mode" className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="original">Original FA Only</SelectItem>
              <SelectItem value="extended">Extended FA Only</SelectItem>
              <SelectItem value="both">Both (Comparison Mode)</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-chart-1/10">
              <div className="bg-chart-1 mr-2 h-2 w-2 rounded-full" />
              Original FA
            </Badge>
            <Badge variant="outline" className="bg-chart-2/10">
              <div className="bg-chart-2 mr-2 h-2 w-2 rounded-full" />
              Extended FA
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
