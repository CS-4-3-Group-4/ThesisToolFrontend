import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
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

const chartConfig = {
  fitness: { label: "Fitness", color: "var(--chart-1)" },
} satisfies ChartConfig;

interface ChartLineFitnessIterationProps {
  data: { iteration: number; fitness: number }[];
}
export function ChartLineFitnessIteration({
  data,
}: ChartLineFitnessIterationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          Fitness Score Over Generations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            accessibilityLayer
            margin={{
              left: 24,
              right: 12,
              bottom: 12,
            }}
          >
            {/* vertical grid lines */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
            />

            {/* x-axis */}
            <XAxis
              dataKey="iteration"
              ticks={data.map((d) => d.iteration).filter((v) => v % 50 === 0)}
              tickMargin={8}
              allowDecimals={false}
              label={{
                value: "Iteration",
                position: "insideBottom",
                offset: -10,
              }}
            />

            {/* y-axis */}
            <YAxis
              tickMargin={8}
              tickCount={8}
              allowDecimals={true} // allows decimal numbers if needed
              // domain={[
              //   (dataMin: number) => dataMin,
              //   (dataMax: number) => dataMax,
              // ]}
              domain={["auto", "auto"]}
              tickFormatter={(value) => value.toFixed(5)}
              label={{
                value: "Fitness",
                angle: -90,
                position: "insideLeft",
                offset: -20,
              }}
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
      <CardFooter>{/* <ChartFooterSummary data={data} /> */}</CardFooter>
    </Card>
  );
}

// interface ChartFooterSummaryProps {
//   data: { iteration: number; fitness: number }[];
// }

// function ChartFooterSummary({ data }: ChartFooterSummaryProps) {
//   if (!data || data.length === 0) return null;

//   const first = data[0].fitness;
//   const last = data.at(-1)!.fitness;
//   const diff = last - first;
//   const percentChange = ((diff / first) * 100).toFixed(2);

//   const trend =
//     diff > 0
//       ? { label: "improved", Icon: TrendingUp, color: "text-green-500" }
//       : diff < 0
//         ? { label: "declined", Icon: TrendingDown, color: "text-red-500" }
//         : {
//             label: "remained stable",
//             Icon: null,
//             color: "text-muted-foreground",
//           };

//   const Icon = trend.Icon;

//   return (
//     <div className="flex-col items-start gap-2 text-sm">
//       <div className="flex items-center gap-2 leading-none font-medium">
//         Fitness Score {trend.label}
//         {diff !== 0 && (
//           <>
//             {" "}
//             by {Math.abs(Number(percentChange))}%{" "}
//             {Icon && <Icon className={`h-4 w-4 ${trend.color}`} />}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
