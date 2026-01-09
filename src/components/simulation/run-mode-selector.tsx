import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, Layers, Info } from "lucide-react";
import type { RunMode } from "@/types";

interface RunModeSelectorProps {
  runMode: RunMode;
  isRunning: boolean;
  onRunModeChange: (mode: RunMode) => void;
}

export function RunModeSelector({
  runMode,
  isRunning,
  onRunModeChange,
}: RunModeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Mode</CardTitle>
        <CardDescription>
          Choose between single scenario or all 30 scenarios
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
                <span className="font-medium">Single Scenario</span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Run one specific scenario (choose from 1-30) for detailed
                analysis
              </p>
            </Label>
          </div>

          <div className="hover:bg-muted/50 border-border flex items-center space-x-3 rounded-lg border p-4">
            <RadioGroupItem value="multiple" id="multiple" />
            <Label htmlFor="multiple" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <Layers className="text-chart-2 h-4 w-4" />
                <span className="font-medium">All 30 Scenarios</span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Run all 30 flood scenarios automatically for comprehensive
                statistical analysis
              </p>
            </Label>
          </div>
        </RadioGroup>

        {runMode === "multiple" && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Multiple Scenarios Mode:</strong> This will automatically
              run all 30 predefined flood scenarios sequentially. This is fixed
              and cannot be changed.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
