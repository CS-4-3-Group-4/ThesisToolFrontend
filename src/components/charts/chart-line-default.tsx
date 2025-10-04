import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { sampleIterFit } from "@/sampleData";

export const description = "A line chart";

const chartData = sampleIterFit;

const chartConfig = {
  fitness: { label: "Fitness", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ChartLineDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fitness Progress</CardTitle>
        <CardDescription>Iteration vs Fitness</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData}>
            {/* vertical grid lines */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
            />

            {/* x-axis */}
            <XAxis
              dataKey="iteration"
              ticks={chartData
                .map((d) => d.iteration)
                .filter((v) => v % 50 === 0)}
              tickMargin={8}
              allowDecimals={false}
            />

            {/* y-axis */}
            <YAxis
              tickMargin={8}
              tickCount={10}
              allowDecimals={true} // allows decimal numbers if needed
              domain={[
                (dataMin: number) => dataMin,
                (dataMax: number) => dataMax,
              ]}
              tickFormatter={(value) => value.toFixed(5)}
            />

            {/* tooltip */}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const iter = payload[0].payload.iteration;
                    return `Iteration: ${iter}`;
                  }}
                  formatter={(value, name) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                        style={
                          {
                            "--color-bg": `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        {value}
                        {/* <span className="text-muted-foreground font-normal">
                          kcal
                        </span> */}
                      </div>
                      {/* Add this after the last item */}
                      {/* {index === 1 && (
                        <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                          Total
                          <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                            {item.payload.running + item.payload.swimming}
                            <span className="text-muted-foreground font-normal">
                              kcal
                            </span>
                          </div>
                        </div>
                      )} */}
                    </>
                  )}
                />
              }
            />

            {/* line */}
            <Line
              dataKey="fitness"
              type="monotone"
              stroke={chartConfig.fitness.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Fitness evolution over iterations
        </div>
      </CardFooter>
    </Card>
  );
}
