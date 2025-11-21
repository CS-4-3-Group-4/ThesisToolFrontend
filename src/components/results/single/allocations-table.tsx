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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileSpreadsheet, FileJson } from "lucide-react";
import { json2csv } from "json-2-csv";
import type { Allocation } from "@/types";

interface AllocationTableProps {
  allocations: Allocation[];
  algorithmName: string;
}

export function AllocationTable({
  allocations,
  algorithmName,
}: AllocationTableProps) {
  // Flatten allocations for cleaner CSV export (removes nested personnel object)
  const flattenAllocations = () => {
    return allocations.map((alloc) => ({
      id: alloc.id,
      name: alloc.name,
      SAR: alloc.personnel.SAR,
      EMS: alloc.personnel.EMS,
      total: alloc.total,
    }));
  };

  // Export allocations
  const exportAllocations = (format: "csv" | "json") => {
    const flattened = flattenAllocations();
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === "csv") {
      content = json2csv(flattened, {
        excelBOM: true,
      });
      mimeType = "text/csv";
      filename = `${algorithmName}-allocations.csv`;
    } else {
      content = JSON.stringify(flattened, null, 2);
      mimeType = "application/json";
      filename = `${algorithmName}-allocations.json`;
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

  const totalSAR = allocations.reduce(
    (sum, alloc) => sum + alloc.personnel.SAR,
    0,
  );
  const totalEMS = allocations.reduce(
    (sum, alloc) => sum + alloc.personnel.EMS,
    0,
  );
  const totalPersonnel = allocations.reduce(
    (sum, alloc) => sum + alloc.total,
    0,
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Resource Allocations by Barangay
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => exportAllocations("csv")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportAllocations("json")}>
              <FileJson className="mr-2 h-4 w-4" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barangay</TableHead>
                <TableHead className="text-right">SAR</TableHead>
                <TableHead className="text-right">EMS</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocations.map((alloc) => (
                <TableRow key={alloc.id}>
                  <TableCell className="font-medium">{alloc.name}</TableCell>
                  <TableCell className="text-right">
                    {alloc.personnel.SAR}
                  </TableCell>
                  <TableCell className="text-right">
                    {alloc.personnel.EMS}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {alloc.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div className="bg-muted/50 border-t px-4 py-3">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Total Personnel</span>
          <div className="flex gap-8">
            <span>SAR: {totalSAR}</span>
            <span>EMS: {totalEMS}</span>
            <span className="text-primary">Total: {totalPersonnel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
