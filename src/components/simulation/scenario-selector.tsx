import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { RunMode } from "@/types";

interface ScenarioSelectorProps {
  scenario: number;
  onScenarioChange: (scenario: number) => void;
  isRunning: boolean;
  runMode: RunMode;
}

export function ScenarioSelector({
  scenario,
  onScenarioChange,
  isRunning,
  runMode,
}: ScenarioSelectorProps) {
  // Only show for single run mode
  if (runMode !== "single") return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    onScenarioChange(Math.max(1, Math.min(30, val)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Selection</CardTitle>
        <CardDescription>
          Choose which flood scenario to run (1-30)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scenario">Scenario Number</Label>
          <Input
            id="scenario"
            type="number"
            min={1}
            max={30}
            value={scenario}
            onChange={handleChange}
            disabled={isRunning}
            className="font-mono"
          />
          <p className="text-muted-foreground text-xs">
            Each scenario represents a different flood situation with unique
            conditions
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Single Scenario Mode:</strong> Runs one specific scenario
            for detailed analysis. Choose a number between 1-30 to select the
            flood scenario.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
