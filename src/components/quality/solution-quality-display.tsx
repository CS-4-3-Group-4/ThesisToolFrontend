import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Download,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { qualityComparisonQueryOptions } from "@/queries/quality";

export function SolutionQualityDisplay() {
  const {
    data: qualityComparison,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery(qualityComparisonQueryOptions());

  const [expandedScenarios, setExpandedScenarios] = useState<Set<number>>(
    new Set(),
  );

  // function formatNumber(num: number, toFixed: number) {
  //   if (Number.isInteger(num)) {
  //     return num.toString(); // leave integers as-is
  //   } else {
  //     return num.toFixed(toFixed); // toFixed decimal places for non-integers
  //   }
  // }

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
            <div className="space-y-2 text-center">
              <p className="text-lg font-medium">
                Loading Solution Quality Data
              </p>
              <p className="text-muted-foreground text-sm">
                Fetching comparison metrics...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (isError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to load quality comparison data";

    const isMissingRunsError = errorMessage.includes("must be completed first");

    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Solution Quality</AlertTitle>
          <AlertDescription>
            {isMissingRunsError ? (
              <div className="space-y-2">
                <p>{errorMessage}</p>
                <p className="text-sm">
                  To view solution quality comparison, you need to:
                </p>
                <ol className="list-inside list-decimal space-y-1 text-sm">
                  <li>Run FA in "All 30 Scenarios" mode</li>
                  <li>Run EFA in "All 30 Scenarios" mode</li>
                </ol>
                <p className="mt-2 text-sm">
                  Please complete both multiple runs first, then click the
                  Refresh button above.
                </p>
              </div>
            ) : (
              <p>{errorMessage}</p>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle no data
  if (!qualityComparison) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-muted-foreground text-center">
            <p>No quality comparison data available.</p>
            <p className="mt-2 text-sm">
              Run both FA and EFA in "All 30 Scenarios" mode to see comparison.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const toggleScenario = (scenarioNum: number) => {
    const newExpanded = new Set(expandedScenarios);
    if (newExpanded.has(scenarioNum)) {
      newExpanded.delete(scenarioNum);
    } else {
      newExpanded.add(scenarioNum);
    }
    setExpandedScenarios(newExpanded);
  };

  const exportDataToJson = () => {
    downloadFile(
      JSON.stringify(qualityComparison, null, 2),
      "solution_quality_comparison.json",
      "application/json",
    );
  };

  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string,
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getChangeColor = (percentChange: number): string => {
    if (percentChange > 0) return "text-green-500";
    if (percentChange < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const getChangeBadge = (percentChange: number) => {
    if (percentChange > 0) return <Badge variant="default">Improved</Badge>;
    if (percentChange < 0) return <Badge variant="destructive">Degraded</Badge>;
    return <Badge variant="secondary">Unchanged</Badge>;
  };

  const getHazardBadgeVariant = (hazardLevel: string) => {
    switch (hazardLevel.toLowerCase()) {
      case "low":
        return "default";
      case "medium":
        return "secondary";
      case "high":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Refresh Button at the top */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          {isFetching ? "Refreshing..." : "Refresh Data"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportDataToJson()}
          disabled={isFetching}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Table 1 - Overall Scenario Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Overall Scenario Performance</CardTitle>
              <CardDescription>
                Aggregated metrics across all{" "}
                {qualityComparison.scenarioComparisons.length} scenarios
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>FA Mean Solution Quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {qualityComparison.faMeanSQ}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>EFA Mean Solution Quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {qualityComparison.efaMeanSQ}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Mean Percentage Change</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${getChangeColor(qualityComparison.meanPercentageChange)}`}
                >
                  {qualityComparison.meanPercentageChange >= 0 ? "+" : ""}
                  {qualityComparison.meanPercentageChange}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Min/Max Percentage Change</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground">Min:</span>
                    <span
                      className={`font-semibold ${getChangeColor(qualityComparison.minPercentageChange)}`}
                    >
                      {qualityComparison.minPercentageChange}%
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground">Max:</span>
                    <span
                      className={`font-semibold ${getChangeColor(qualityComparison.maxPercentageChange)}`}
                    >
                      {qualityComparison.maxPercentageChange}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Improved Scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {qualityComparison.improvedScenarios}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Degraded Scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {qualityComparison.degradedScenarios}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Table 2 - Scenario-Level Quality Comparison */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scenario-Level Quality Comparison</CardTitle>
              <CardDescription>
                Performance metrics for each individual scenario
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <ScrollArea className="h-[400px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scenario</TableHead>
                    <TableHead className="text-right">
                      FA Solution Quality
                    </TableHead>
                    <TableHead className="text-right">
                      EFA Solution Quality
                    </TableHead>
                    <TableHead className="text-right">
                      Percentage Change (%)
                    </TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualityComparison.scenarioComparisons.map((sc) => (
                    <TableRow key={sc.scenarioNumber}>
                      <TableCell className="font-medium">
                        {sc.scenarioNumber}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {sc.faSolutionQuality}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {sc.efaSolutionQuality}
                      </TableCell>
                      <TableCell
                        className={`text-right font-mono ${getChangeColor(sc.percentageChange)}`}
                      >
                        {sc.percentageChange >= 0 ? "+" : ""}
                        {sc.percentageChange}%
                      </TableCell>
                      <TableCell className="text-center">
                        {getChangeBadge(sc.percentageChange)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Table 3 - Barangay-Level Allocation and Score Comparison */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Barangay-Level Allocation and Score Comparison
              </CardTitle>
              <CardDescription>
                Detailed breakdown by scenario and barangay
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {qualityComparison.scenarioComparisons.map((sc) => (
            <Card key={sc.scenarioNumber}>
              <CardHeader
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleScenario(sc.scenarioNumber)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CardTitle className="text-base">
                      Scenario {sc.scenarioNumber}
                    </CardTitle>
                    {getChangeBadge(sc.percentageChange)}
                    <span
                      className={`font-mono text-sm ${getChangeColor(sc.percentageChange)}`}
                    >
                      {sc.percentageChange >= 0 ? "+" : ""}
                      {sc.percentageChange}%
                    </span>
                  </div>
                  {expandedScenarios.has(sc.scenarioNumber) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>
              </CardHeader>
              {expandedScenarios.has(sc.scenarioNumber) && (
                <CardContent>
                  <div className="rounded-md border">
                    <ScrollArea className="h-[400px] w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Barangay ID</TableHead>
                            <TableHead>Barangay Name</TableHead>
                            <TableHead className="text-center">
                              Hazard Level
                            </TableHead>
                            <TableHead className="text-right">
                              FA Allocated
                            </TableHead>
                            <TableHead className="text-right">
                              FA Ideal
                            </TableHead>
                            <TableHead className="text-right">
                              EFA Allocated
                            </TableHead>
                            <TableHead className="text-right">
                              EFA Ideal
                            </TableHead>
                            <TableHead className="text-right">
                              FA Solution Quality
                            </TableHead>
                            <TableHead className="text-right">
                              EFA Solution Quality
                            </TableHead>
                            <TableHead className="text-right">
                              Percentage Change (%)
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sc.barangayComparisons.map((bc) => (
                            <TableRow
                              key={bc.barangayId}
                              className={
                                bc.barangayFAScore.hazardLevel === "None"
                                  ? "opacity-25"
                                  : ""
                              }
                            >
                              <TableCell className="font-mono text-xs">
                                {bc.barangayId}
                              </TableCell>
                              <TableCell className="font-medium">
                                {bc.barangayName}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={getHazardBadgeVariant(
                                    bc.barangayFAScore.hazardLevel,
                                  )}
                                >
                                  {bc.barangayFAScore.hazardLevel}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {bc.barangayFAScore.allocated}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {bc.barangayFAScore.ideal}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {bc.barangayEFAScore.allocated}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {bc.barangayEFAScore.ideal}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {bc.barangayFAScore.solutionQuality}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {bc.barangayEFAScore.solutionQuality}
                              </TableCell>
                              <TableCell
                                className={`text-right font-mono ${getChangeColor(bc.percentageChange)}`}
                              >
                                {bc.percentageChange >= 0 ? "+" : ""}
                                {bc.percentageChange}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
