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
import { Download, FileSpreadsheet, FileJson } from "lucide-react";
import { json2csv } from "json-2-csv";
import type { ValidationReport } from "@/types";

interface ValidationTableProps {
  validationReport: ValidationReport;
  algorithmName: string;
}

export function ValidationTable({
  validationReport,
  algorithmName,
}: ValidationTableProps) {
  // Export validation data
  const exportValidation = (format: "csv" | "json") => {
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === "csv") {
      content = json2csv(validationReport.barangayValidations, {
        excelBOM: true,
      });
      mimeType = "text/csv";
      filename = `${algorithmName}-validation.csv`;
    } else {
      content = JSON.stringify(validationReport, null, 2);
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

  // Get quality rating badge variant (keeps badges, simple)
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
          Validation Report - {validationReport.standard}
          <Badge
            variant={getQualityBadgeVariant(
              validationReport.overallStats.qualityRating,
            )}
          >
            {validationReport.overallStats.qualityRating}
          </Badge>
        </AlertTitle>
        <AlertDescription>
          <div className="space-y-3">
            <p className="text-sm">{validationReport.interpretation}</p>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div>
                <p className="text-muted-foreground">Total Barangays</p>
                <p className="font-semibold">
                  {validationReport.overallStats.totalBarangays}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Avg Population Closeness
                </p>
                <p className="font-semibold">
                  {(
                    validationReport.overallStats.averagePopulationCloseness *
                    100
                  ).toFixed(2)}
                  %
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Hazard Closeness</p>
                <p className="font-semibold">
                  {(
                    validationReport.overallStats.averageHazardCloseness * 100
                  ).toFixed(2)}
                  %
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Combined Score</p>
                <p className="font-semibold">
                  {(
                    validationReport.overallStats.averageCombinedScore * 100
                  ).toFixed(2)}
                  %
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
                  <TableHead>Barangay</TableHead>
                  <TableHead className="text-center">Population</TableHead>
                  <TableHead className="text-center">Hazard</TableHead>
                  <TableHead className="text-right">Ideal Total</TableHead>
                  <TableHead className="text-right">Actual Total</TableHead>
                  <TableHead className="text-right">Population Score</TableHead>
                  <TableHead className="text-right">
                    Population Closeness
                  </TableHead>
                  <TableHead className="text-right">SAR Closeness</TableHead>
                  <TableHead className="text-right">EMS Closeness</TableHead>
                  <TableHead className="text-right">Hazard Closeness</TableHead>
                  <TableHead className="text-right">
                    Combined Closeness
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validationReport.barangayValidations.map((v) => (
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
                      {(v.populationCloseness * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {(v.sarCloseness * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {(v.emsCloseness * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {(v.hazardCloseness * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {(v.combinedScore * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="bg-muted/50 text-muted-foreground border-t px-4 py-3 text-xs">
          <strong>Baseline:</strong> {validationReport.baseline} |
          <strong className="ml-2">S</strong> = SAR Personnel,
          <strong className="ml-2">E</strong> = EMS Personnel
        </div>
      </div>
    </div>
  );
}
