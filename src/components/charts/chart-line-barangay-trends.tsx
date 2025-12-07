import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import type { ValidationReportSingle } from "@/types";

const chartConfig = {
  populationCloseness: {
    label: "Population",
    color: "var(--chart-1)",
  },
  sarCloseness: {
    label: "SAR",
    color: "var(--chart-2)",
  },
  emsCloseness: {
    label: "EMS",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const scoreChartConfig = {
  populationScore: {
    label: "Population Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartLineBarangayTrendsProps {
  barangayName: string;
  barangayId: string;
  individualRuns: ValidationReportSingle[];
}

export function ChartLineBarangayTrends({
  barangayName,
  barangayId,
  individualRuns,
}: ChartLineBarangayTrendsProps) {
  const [activeLines, setActiveLines] = useState<string[]>([]);

  function handleLegendClick(dataKey: string) {
    if (activeLines.includes(dataKey)) {
      setActiveLines(activeLines.filter((item) => item !== dataKey));
    } else {
      setActiveLines((prev) => [...prev, dataKey]);
    }
  }

  // Extract data for this specific barangay across all runs
  const closenessData = individualRuns
    .map((run, index) => {
      const barangay = run.barangayValidations.find(
        (bv) => bv.barangayId === barangayId,
      );
      if (!barangay) return null;

      return {
        runNumber: index + 1,
        populationCloseness: barangay.populationCloseness * 100,
        sarCloseness: barangay.sarCloseness * 100,
        emsCloseness: barangay.emsCloseness * 100,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const scoreData = individualRuns
    .map((run, index) => {
      const barangay = run.barangayValidations.find(
        (bv) => bv.barangayId === barangayId,
      );
      if (!barangay) return null;

      return {
        runNumber: index + 1,
        populationScore: barangay.populationScore,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="space-y-6">
      {/* Closeness Metrics Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {barangayName} - Closeness Metrics Across Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              data={closenessData}
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
                domain={["auto", "auto"]}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
                label={{
                  value: "Closeness (%)",
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
                      return `Run ${run}`;
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
                            ? `${value.toFixed(2)}%`
                            : value}
                        </div>
                      </>
                    )}
                  />
                }
              />

              <Legend
                verticalAlign="top"
                height={36}
                iconType="line"
                onClick={(props) => handleLegendClick(props.dataKey as string)}
                formatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                }
              />

              <Line
                dataKey="populationCloseness"
                type="monotone"
                stroke={chartConfig.populationCloseness.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="populationCloseness"
                hide={activeLines.includes("populationCloseness")}
              />

              <Line
                dataKey="sarCloseness"
                type="monotone"
                stroke={chartConfig.sarCloseness.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="sarCloseness"
                hide={activeLines.includes("sarCloseness")}
              />

              <Line
                dataKey="emsCloseness"
                type="monotone"
                stroke={chartConfig.emsCloseness.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="emsCloseness"
                hide={activeLines.includes("emsCloseness")}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Population Score Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {barangayName} - Population Score Across Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={scoreChartConfig}>
            <LineChart
              data={scoreData}
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
                tickCount={5}
                allowDecimals={false}
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                label={{
                  value: "Population Score",
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
                      return `Run ${run}`;
                    }}
                    formatter={(value, name) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{
                            backgroundColor:
                              scoreChartConfig[
                                name as keyof typeof scoreChartConfig
                              ]?.color,
                          }}
                        />
                        {scoreChartConfig[name as keyof typeof scoreChartConfig]
                          ?.label || name}
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {value}
                        </div>
                      </>
                    )}
                  />
                }
              />

              <Line
                dataKey="populationScore"
                type="monotone"
                stroke={scoreChartConfig.populationScore.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="populationScore"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
