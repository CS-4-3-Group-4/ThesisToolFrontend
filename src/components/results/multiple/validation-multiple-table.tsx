import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ValidationReportMultiple } from "@/types";

interface ValidationTableMultipleProps {
  validationReportMultiple: ValidationReportMultiple;
}

export function ValidationTableMultiple({
  validationReportMultiple,
}: ValidationTableMultipleProps) {
  const getCVBadgeVariant = (cv: number) => {
    if (cv <= 0.1) return "default"; // Excellent consistency (≤10%)
    if (cv <= 0.2) return "secondary"; // Good consistency (≤20%)
    return "destructive"; // Poor consistency (>20%)
  };

  const getCVLabel = (cv: number) => {
    if (cv <= 0.1) return "Excellent";
    if (cv <= 0.2) return "Good";
    return "Variable";
  };

  const stats = [
    {
      metric: "Population Closeness",
      mean: validationReportMultiple.meanPopulationCloseness,
      std: validationReportMultiple.stdPopulationCloseness,
      min: validationReportMultiple.minPopulationCloseness,
      max: validationReportMultiple.maxPopulationCloseness,
      cv: validationReportMultiple.cvPopulationCloseness,
    },
    {
      metric: "SAR Closeness",
      mean: validationReportMultiple.meanSarCloseness,
      std: validationReportMultiple.stdSarCloseness,
      min: validationReportMultiple.minSarCloseness,
      max: validationReportMultiple.maxSarCloseness,
      cv: validationReportMultiple.cvSarCloseness,
    },
    {
      metric: "EMS Closeness",
      mean: validationReportMultiple.meanEmsCloseness,
      std: validationReportMultiple.stdEmsCloseness,
      min: validationReportMultiple.minEmsCloseness,
      max: validationReportMultiple.maxEmsCloseness,
      cv: validationReportMultiple.cvEmsCloseness,
    },
    {
      metric: "Population Score",
      mean: validationReportMultiple.meanPopulationScore,
      std: validationReportMultiple.stdPopulationScore,
      min: validationReportMultiple.minPopulationScore,
      max: validationReportMultiple.maxPopulationScore,
      cv: validationReportMultiple.cvPopulationScore,
      isScore: true, // Flag to handle different formatting
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Validation Statistics</CardTitle>
        <CardDescription>
          Aggregated metrics across{" "}
          {validationReportMultiple.individualRuns.length} runs and all
          barangays
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Metric</TableHead>
                <TableHead className="text-right">Mean</TableHead>
                <TableHead className="text-right">Std Dev</TableHead>
                <TableHead className="text-right">Min</TableHead>
                <TableHead className="text-right">Max</TableHead>
                <TableHead className="text-center">Consistency (CV)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat) => (
                <TableRow key={stat.metric}>
                  <TableCell className="font-medium">{stat.metric}</TableCell>
                  <TableCell className="text-right">
                    {stat.isScore ? stat.mean.toFixed(2) : stat.mean.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    {stat.isScore ? stat.std.toFixed(2) : stat.std.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    {stat.isScore ? stat.min.toFixed(2) : stat.min.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    {stat.isScore ? stat.max.toFixed(2) : stat.max.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Badge variant={getCVBadgeVariant(stat.cv)}>
                        {getCVLabel(stat.cv)}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {(stat.cv * 100).toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="bg-muted/50 text-muted-foreground mt-4 rounded-md px-4 py-3 text-xs">
          <div className="space-y-1">
            <p>
              <strong>Coefficient of Variation (CV):</strong> Measures
              consistency across runs. Lower is better.
            </p>
            <p>
              <strong>CV Ratings:</strong> Excellent (≤10%), Good (≤20%),
              Variable (&gt;20%)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
