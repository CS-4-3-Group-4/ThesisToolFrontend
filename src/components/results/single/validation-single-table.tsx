import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Download,
  FileSpreadsheet,
  FileJson,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { json2csv } from "json-2-csv";
import type { ValidationReportSingle } from "@/types";

interface ValidationTableSingleProps {
  validationReportSingle: ValidationReportSingle;
  algorithmName: string;
}

type SortField =
  | "barangayName"
  | "population"
  | "hazardLevel"
  | "idealTotal"
  | "actualTotal"
  | "populationScore"
  | "populationCloseness"
  | "sarCloseness"
  | "emsCloseness";

type SortDirection = "asc" | "desc" | null;

export function ValidationTableSingle({
  validationReportSingle,
  algorithmName,
}: ValidationTableSingleProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort validations
  const sortedValidations = [
    ...validationReportSingle.barangayValidations,
  ].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aVal: string | number = a[sortField];
    let bVal: string | number = b[sortField];

    // Special handling for hazard level
    if (sortField === "hazardLevel") {
      const hazardOrder = { low: 1, medium: 2, high: 3 };
      aVal =
        hazardOrder[String(aVal).toLowerCase() as keyof typeof hazardOrder] ||
        0;
      bVal =
        hazardOrder[String(bVal).toLowerCase() as keyof typeof hazardOrder] ||
        0;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  // Get sort icon for column
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // Export validation data
  const exportValidation = (format: "csv" | "json") => {
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === "csv") {
      content = json2csv(sortedValidations, {
        excelBOM: true,
      });
      mimeType = "text/csv";
      filename = `${algorithmName}-validation.csv`;
    } else {
      content = JSON.stringify(
        { ...validationReportSingle, barangayValidations: sortedValidations },
        null,
        2,
      );
      mimeType = "application/json";
      filename = `${algorithmName}-validation.json`;
    }

    downloadFile(content, filename, mimeType);
  };

  // Helper function to download file
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

  // Get quality rating badge variant
  const getQualityBadgeVariant = (rating: string) => {
    if (rating) return "default";
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
    <div className="space-y-4">
      {/* Overall Stats Card */}
      <Alert>
        <AlertTitle className="mb-2 flex items-center gap-2">
          Validation Report - {validationReportSingle.standard}
          <Badge
            variant={getQualityBadgeVariant(
              validationReportSingle.overallStats.qualityRating,
            )}
          >
            {validationReportSingle.overallStats.qualityRating}
          </Badge>
        </AlertTitle>
        <AlertDescription>
          <div className="space-y-3">
            <p className="text-sm">{validationReportSingle.interpretation}</p>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
              <div>
                <p className="text-muted-foreground">Total Barangays</p>
                <p className="font-semibold">
                  {validationReportSingle.overallStats.totalBarangays}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Population Score</p>
                <p className="font-semibold">
                  {validationReportSingle.overallStats.averagePopulationScore.toFixed(
                    2,
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Avg Population Closeness
                </p>
                <p className="font-semibold">
                  {validationReportSingle.overallStats.averagePopulationCloseness.toFixed(
                    2,
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg SAR Closeness</p>
                <p className="font-semibold">
                  {validationReportSingle.overallStats.averageSarCloseness.toFixed(
                    2,
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg EMS Closeness</p>
                <p className="font-semibold">
                  {validationReportSingle.overallStats.averageEmsCloseness.toFixed(
                    2,
                  )}
                </p>
              </div>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Validation Table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Barangay Validation Details</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportValidation("csv")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportValidation("json")}>
                <FileJson className="mr-2 h-4 w-4" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <ScrollArea className="h-[500px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="hover:text-foreground flex items-center whitespace-nowrap"
                      onClick={() => handleSort("barangayName")}
                    >
                      Barangay
                      {getSortIcon("barangayName")}
                    </button>
                  </TableHead>
                  <TableHead className="text-center">
                    <button
                      className="hover:text-foreground mx-auto flex items-center whitespace-nowrap"
                      onClick={() => handleSort("population")}
                    >
                      Population
                      {getSortIcon("population")}
                    </button>
                  </TableHead>
                  <TableHead className="text-center">
                    <button
                      className="hover:text-foreground mx-auto flex items-center whitespace-nowrap"
                      onClick={() => handleSort("hazardLevel")}
                    >
                      Hazard
                      {getSortIcon("hazardLevel")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      className="hover:text-foreground ml-auto flex items-center whitespace-nowrap"
                      onClick={() => handleSort("idealTotal")}
                    >
                      Ideal Total
                      {getSortIcon("idealTotal")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      className="hover:text-foreground ml-auto flex items-center whitespace-nowrap"
                      onClick={() => handleSort("actualTotal")}
                    >
                      Actual Total
                      {getSortIcon("actualTotal")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      className="hover:text-foreground ml-auto flex items-center whitespace-nowrap"
                      onClick={() => handleSort("populationScore")}
                    >
                      Population Score
                      {getSortIcon("populationScore")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      className="hover:text-foreground ml-auto flex items-center whitespace-nowrap"
                      onClick={() => handleSort("populationCloseness")}
                    >
                      Population Closeness
                      {getSortIcon("populationCloseness")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      className="hover:text-foreground ml-auto flex items-center whitespace-nowrap"
                      onClick={() => handleSort("sarCloseness")}
                    >
                      SAR Closeness
                      {getSortIcon("sarCloseness")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      className="hover:text-foreground ml-auto flex items-center whitespace-nowrap"
                      onClick={() => handleSort("emsCloseness")}
                    >
                      EMS Closeness
                      {getSortIcon("emsCloseness")}
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedValidations.map((v) => (
                  <TableRow key={v.barangayId}>
                    <TableCell className="font-medium">
                      {v.barangayName}
                    </TableCell>
                    <TableCell className="text-center">
                      {v.population.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getHazardBadgeVariant(v.hazardLevel)}>
                        {v.hazardLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {v.idealTotal}
                      <div className="text-muted-foreground text-xs font-normal">
                        ({v.idealSAR}S/{v.idealEMS}E)
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {v.actualTotal}
                      <div className="text-muted-foreground text-xs font-normal">
                        ({v.actualSAR}S/{v.actualEMS}E)
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {v.populationScore}
                    </TableCell>
                    <TableCell className="text-right">
                      {v.populationCloseness.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {v.sarCloseness.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {v.emsCloseness.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="bg-muted/50 text-muted-foreground border-t px-4 py-3 text-xs">
          <strong>Baseline:</strong> {validationReportSingle.baseline} |
          <strong className="ml-2">S</strong> = SAR Personnel,
          <strong className="ml-2">E</strong> = EMS Personnel
        </div>
      </div>
    </div>
  );
}
