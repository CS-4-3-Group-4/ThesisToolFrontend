import { TrendingDown, TrendingUp } from "lucide-react";
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

interface PerformanceChartProps {
  data: { run: number; [key: string]: number }[];
  title: string;
  dataKey: string;
  yAxisLabel: string;
  chartConfig: ChartConfig;
  valueFormatter?: (value: number) => string;
  stroke: string;
}

export function PerformanceChart({
  data,
  title,
  dataKey,
  yAxisLabel,
  chartConfig,
  stroke,
  valueFormatter = (value) => value.toFixed(2),
}: PerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-base">{title}</CardTitle>
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
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
            />

            <XAxis
              dataKey="run"
              tickMargin={8}
              allowDecimals={false}
              label={{
                value: "Run #",
                position: "insideBottom",
                offset: -10,
              }}
            />

            <YAxis
              tickMargin={8}
              allowDecimals={true}
              domain={["auto", "auto"]}
              tickFormatter={valueFormatter}
              label={{
                value: yAxisLabel,
                angle: -90,
                position: "insideLeft",
                offset: -20,
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const runNum = payload[0]?.payload.run;
                    return `Run: ${runNum}`;
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
                        {typeof value === "number"
                          ? valueFormatter(value)
                          : value}
                      </div>
                    </>
                  )}
                />
              }
            />

            <Line
              dataKey={dataKey}
              type="natural"
              stroke={stroke}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <ChartFooterSummary data={data} dataKey={dataKey} label={yAxisLabel} />
      </CardFooter>
    </Card>
  );
}

interface ChartFooterSummaryProps {
  data: { run: number; [key: string]: number }[];
  dataKey: string;
  label: string;
}

function ChartFooterSummary({ data, dataKey, label }: ChartFooterSummaryProps) {
  if (!data || data.length === 0) return null;

  const first = data[0][dataKey];
  const last = data.at(-1)![dataKey];
  const diff = last - first;
  const percentChange = ((diff / first) * 100).toFixed(2);

  const trend =
    diff > 0
      ? { label: "improved", Icon: TrendingUp, color: "text-green-500" }
      : diff < 0
        ? { label: "declined", Icon: TrendingDown, color: "text-red-500" }
        : {
            label: "remained stable",
            Icon: null,
            color: "text-muted-foreground",
          };

  const Icon = trend.Icon;

  return (
    <div className="flex-col items-start gap-2 text-sm">
      <div className="flex items-center gap-2 leading-none font-medium">
        {label} {trend.label}
        {diff !== 0 && (
          <>
            {" "}
            by {Math.abs(Number(percentChange))}%{" "}
            {Icon && <Icon className={`h-4 w-4 ${trend.color}`} />}
          </>
        )}
      </div>
    </div>
  );
}
