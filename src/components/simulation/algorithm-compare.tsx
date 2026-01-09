import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SingleRunCompare } from "../compare/single-run-compare";
import { MultipleRunCompare } from "../compare/multiple-run-compare";

type CompareMode = "single" | "multiple";

// Main AlgorithmCompare Component
export function AlgorithmCompare() {
  const [compareMode, setCompareMode] = useState<CompareMode>("single");

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Comparison Mode</CardTitle>
          <CardDescription>
            Choose whether to compare single scenario or multiple scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={compareMode}
            onValueChange={(v) => setCompareMode(v as CompareMode)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Scenario</TabsTrigger>
              <TabsTrigger value="multiple">Multiple Scenarios</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {compareMode === "single" ? <SingleRunCompare /> : <MultipleRunCompare />}
    </div>
  );
}
