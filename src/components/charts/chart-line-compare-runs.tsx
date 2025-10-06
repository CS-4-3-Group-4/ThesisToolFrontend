import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import { Switch } from "@/components/ui/switch"; // Import Switch
import type { MultipleRunResult } from "@/types";

const chartConfig = {
  fa: { label: "FA", color: "var(--chart-1)" },
  efa: { label: "EFA", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface ChartLineCompareProps {
  faData: MultipleRunResult;
  efaData: MultipleRunResult;
}

// Component for comparing fitness scores across runs
export function ChartLineCompareFitnessRun({
  faData,
  efaData,
}: ChartLineCompareProps) {
  const [activeLines, setActiveLines] = useState<string[]>([]);
  const [useAutoDomain, setUseAutoDomain] = useState(true); // State for domain toggle

  function handleLegendClick(dataKey: string) {
    if (activeLines.includes(dataKey)) {
      setActiveLines(activeLines.filter((item) => item !== dataKey));
    } else {
      setActiveLines((prev) => [...prev, dataKey]);
    }
  }

  // Merge data from both algorithms
  const mergedData = faData.runs.map((run, idx) => ({
    runNumber: run.runNumber,
    fa: run.fitnessMaximization,
    efa: efaData.runs[idx]?.fitnessMaximization ?? null,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          Algorithm Comparison: Fitness Score Across Runs
        </CardTitle>
        <div className="mt-2 flex items-center justify-center gap-2">
          <Switch
            checked={useAutoDomain}
            onCheckedChange={setUseAutoDomain}
            id="domain-toggle-fitness"
          />
          <label htmlFor="domain-toggle-fitness" className="text-sm">
            Use Auto Domain
          </label>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={mergedData}
            accessibilityLayer
            margin={{
              left: 24,
              right: 12,
              bottom: 12,
              top: 12,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
            />

            <XAxis
              dataKey="runNumber"
              tickMargin={8}
              allowDecimals={false}
              label={{
                value: "Run Number",
                position: "insideBottom",
                offset: -10,
              }}
            />

            <YAxis
              tickMargin={8}
              tickCount={8}
              allowDecimals={true}
              domain={useAutoDomain ? ["auto", "auto"] : undefined}
              tickFormatter={(value) => value.toFixed(6)}
              label={{
                value: "Fitness Score",
                angle: -90,
                position: "insideLeft",
                offset: -20,
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const run = payload[0]?.payload.runNumber;
                    return `Run: ${run}`;
                  }}
                  formatter={(value, name) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{
                          backgroundColor:
                            chartConfig[name as keyof typeof chartConfig]
                              ?.color,
                        }}
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        {typeof value === "number" ? value.toFixed(6) : value}
                      </div>
                    </>
                  )}
                />
              }
            />

            <Legend
              verticalAlign="top"
              height={36}
              iconType="square"
              onClick={(props) => handleLegendClick(props.dataKey as string)}
              formatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />

            <Line
              dataKey="fa"
              type="monotone"
              stroke={chartConfig.fa.color}
              strokeWidth={2}
              dot={false}
              name="fa"
              hide={activeLines.includes("fa")}
            />

            <Line
              dataKey="efa"
              type="monotone"
              stroke={chartConfig.efa.color}
              strokeWidth={2}
              dot={false}
              name="efa"
              hide={activeLines.includes("efa")}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Component for comparing execution time across runs
export function ChartLineCompareExecutionTimeRun({
  faData,
  efaData,
}: ChartLineCompareProps) {
  const [activeLines, setActiveLines] = useState<string[]>([]);
  const [useAutoDomain, setUseAutoDomain] = useState(true); // State for domain toggle

  function handleLegendClick(dataKey: string) {
    if (activeLines.includes(dataKey)) {
      setActiveLines(activeLines.filter((item) => item !== dataKey));
    } else {
      setActiveLines((prev) => [...prev, dataKey]);
    }
  }

  // Merge data from both algorithms
  const mergedData = faData.runs.map((run, idx) => ({
    runNumber: run.runNumber,
    fa: run.executionTimeMs,
    efa: efaData.runs[idx]?.executionTimeMs ?? null,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          Algorithm Comparison: Execution Time Across Runs
        </CardTitle>
        <div className="mt-2 flex items-center justify-center gap-2">
          <Switch
            checked={useAutoDomain}
            onCheckedChange={setUseAutoDomain}
            id="domain-toggle-execution"
          />
          <label htmlFor="domain-toggle-execution" className="text-sm">
            Use Auto Domain
          </label>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={mergedData}
            accessibilityLayer
            margin={{
              left: 24,
              right: 12,
              bottom: 12,
              top: 12,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
            />

            <XAxis
              dataKey="runNumber"
              tickMargin={8}
              allowDecimals={false}
              label={{
                value: "Run Number",
                position: "insideBottom",
                offset: -10,
              }}
            />

            <YAxis
              tickMargin={8}
              tickCount={8}
              allowDecimals={true}
              domain={useAutoDomain ? ["auto", "auto"] : undefined}
              tickFormatter={(value) => value.toFixed(2)}
              label={{
                value: "Execution Time (ms)",
                angle: -90,
                position: "insideLeft",
                offset: -20,
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const run = payload[0]?.payload.runNumber;
                    return `Run: ${run}`;
                  }}
                  formatter={(value, name) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{
                          backgroundColor:
                            chartConfig[name as keyof typeof chartConfig]
                              ?.color,
                        }}
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        {typeof value === "number" ? value.toFixed(2) : value}{" "}
                        ms
                      </div>
                    </>
                  )}
                />
              }
            />

            <Legend
              verticalAlign="top"
              height={36}
              iconType="square"
              onClick={(props) => handleLegendClick(props.dataKey as string)}
              formatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />

            <Line
              dataKey="fa"
              type="monotone"
              stroke={chartConfig.fa.color}
              strokeWidth={2}
              dot={false}
              name="fa"
              hide={activeLines.includes("fa")}
            />

            <Line
              dataKey="efa"
              type="monotone"
              stroke={chartConfig.efa.color}
              strokeWidth={2}
              dot={false}
              name="efa"
              hide={activeLines.includes("efa")}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Component for comparing memory usage across runs
export function ChartLineCompareMemoryUsageRun({
  faData,
  efaData,
}: ChartLineCompareProps) {
  const [activeLines, setActiveLines] = useState<string[]>([]);
  const [useAutoDomain, setUseAutoDomain] = useState(true); // State for domain toggle

  function handleLegendClick(dataKey: string) {
    if (activeLines.includes(dataKey)) {
      setActiveLines(activeLines.filter((item) => item !== dataKey));
    } else {
      setActiveLines((prev) => [...prev, dataKey]);
    }
  }

  // Merge data from both algorithms
  const mergedData = faData.runs.map((run, idx) => ({
    runNumber: run.runNumber,
    fa: run.memoryBytes ?? null,
    efa: efaData.runs[idx]?.memoryBytes ?? null,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          Algorithm Comparison: Memory Usage Across Runs
        </CardTitle>
        <div className="mt-2 flex items-center justify-center gap-2">
          <Switch
            checked={useAutoDomain}
            onCheckedChange={setUseAutoDomain}
            id="domain-toggle-memory"
          />
          <label htmlFor="domain-toggle-memory" className="text-sm">
            Use Auto Domain
          </label>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={mergedData}
            accessibilityLayer
            margin={{
              left: 24,
              right: 12,
              bottom: 12,
              top: 12,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
            />

            <XAxis
              dataKey="runNumber"
              tickMargin={8}
              allowDecimals={false}
              label={{
                value: "Run Number",
                position: "insideBottom",
                offset: -10,
              }}
            />

            <YAxis
              tickMargin={8}
              tickCount={8}
              allowDecimals={false}
              domain={useAutoDomain ? ["auto", "auto"] : undefined}
              tickFormatter={(value) => value.toLocaleString()}
              label={{
                value: "Memory Usage (bytes)",
                angle: -90,
                position: "insideLeft",
                offset: -20,
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const run = payload[0]?.payload.runNumber;
                    return `Run: ${run}`;
                  }}
                  formatter={(value, name) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{
                          backgroundColor:
                            chartConfig[name as keyof typeof chartConfig]
                              ?.color,
                        }}
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        {typeof value === "number"
                          ? value.toLocaleString()
                          : value}{" "}
                        bytes
                      </div>
                    </>
                  )}
                />
              }
            />

            <Legend
              verticalAlign="top"
              height={36}
              iconType="square"
              onClick={(props) => handleLegendClick(props.dataKey as string)}
              formatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />

            <Line
              dataKey="fa"
              type="monotone"
              stroke={chartConfig.fa.color}
              strokeWidth={2}
              dot={false}
              name="fa"
              hide={activeLines.includes("fa")}
            />

            <Line
              dataKey="efa"
              type="monotone"
              stroke={chartConfig.efa.color}
              strokeWidth={2}
              dot={false}
              name="efa"
              hide={activeLines.includes("efa")}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
