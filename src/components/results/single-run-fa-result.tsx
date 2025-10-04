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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Allocation, Flow, SingleRunResult } from "@/types";

interface SingleRunResultProps {
  result: SingleRunResult;
  allocations: Allocation[];
  flows: Flow[];
}

export function SingleRunFAResult({
  result,
  allocations,
  flows,
}: SingleRunResultProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Firefly Algorithm (FA) - Single Run Results</CardTitle>
        <CardDescription>
          Performance metrics and resource allocation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Fitness (Max)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.fitnessMaximization.toFixed(6)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Fitness (Min)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.fitnessMinimization.toFixed(6)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Execution Time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.executionTimeMs.toFixed(2)}
              </div>
              <p className="text-muted-foreground text-xs">ms</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Memory Usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(result.memoryBytes / 1024 / 1024).toFixed(2)}
              </div>
              <p className="text-muted-foreground text-xs">MB</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Iterations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.totalIterations}</div>
            </CardContent>
          </Card>
        </div>

        {/* Allocations Table */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Resource Allocations by Barangay
          </h3>
          <ScrollArea className="h-[400px] rounded-md border">
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
                      {alloc.personnel.SAR + alloc.personnel.EMS}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Resource Flows */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Resource Flows</h3>
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flows.map((flow, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Badge
                        variant={
                          flow.classId === "SAR" ? "default" : "secondary"
                        }
                      >
                        {flow.classId}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{flow.fromName}</TableCell>
                    <TableCell className="text-sm">{flow.toName}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {flow.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
