import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";

const chartConfig = {
  fa: { label: "FA", color: "var(--chart-1)" },
  efa: { label: "EFA", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface ChartLineCompareIterationProps {
  faData: { iteration: number; fitness: number }[];
  efaData: { iteration: number; fitness: number }[];
}

export function ChartLineCompareIteration({
  faData,
  efaData,
}: ChartLineCompareIterationProps) {
  const [activeLines, setActiveLines] = useState<string[]>([]);

  function handleLegendClick(dataKey: string) {
    if (activeLines.includes(dataKey)) {
      setActiveLines(activeLines.filter((item) => item !== dataKey));
    } else {
      setActiveLines((prev) => [...prev, dataKey]);
    }
  }

  // Merge data from both algorithms
  const mergedData = faData.map((item, idx) => ({
    iteration: item.iteration,
    fa: item.fitness,
    efa: efaData[idx]?.fitness ?? null,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          Algorithm Comparison: Fitness Over Generations
        </CardTitle>
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
              dataKey="iteration"
              ticks={mergedData
                .map((d) => d.iteration)
                .filter((v) => v % 50 === 0)}
              tickMargin={8}
              allowDecimals={false}
              label={{
                value: "Iteration",
                position: "insideBottom",
                offset: -10,
              }}
            />

            <YAxis
              tickMargin={8}
              tickCount={8}
              allowDecimals={true}
              domain={["auto", "auto"]}
              tickFormatter={(value) => value.toFixed(5)}
              label={{
                value: "Fitness",
                angle: -90,
                position: "insideLeft",
                offset: -20,
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const iter = payload[0]?.payload.iteration;
                    return `Iteration: ${iter}`;
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
