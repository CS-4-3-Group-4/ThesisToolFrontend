import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import type { ObjectiveData } from "@/types";

interface ObjectivesDisplayProps {
  objectives: ObjectiveData;
  algorithmName: string;
}

export function ObjectivesDisplay({
  objectives,
  algorithmName,
}: ObjectivesDisplayProps) {
  const [expandedObjectives, setExpandedObjectives] = useState<Set<number>>(
    new Set(),
  );

  const toggleObjective = (objNum: number) => {
    const newExpanded = new Set(expandedObjectives);
    if (newExpanded.has(objNum)) {
      newExpanded.delete(objNum);
    } else {
      newExpanded.add(objNum);
    }
    setExpandedObjectives(newExpanded);
  };

  // Export final values as CSV
  const exportCSV = () => {
    const numRuns = objectives.objective1.finalVals.length;

    // Create header row
    const headers = [
      "Run",
      "Objective 1",
      "Objective 2",
      "Objective 3",
      "Objective 4",
      "Objective 5",
    ];

    // Create data rows
    const rows = [];
    for (let i = 0; i < numRuns; i++) {
      rows.push([
        i + 1,
        objectives.objective1.finalVals[i],
        objectives.objective2.finalVals[i],
        objectives.objective3.finalVals[i],
        objectives.objective4.finalVals[i],
        objectives.objective5.finalVals[i],
      ]);
    }

    // Convert to CSV format
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const filename = `${algorithmName}-final-values-${Date.now()}.csv`;
    downloadFile(csvContent, filename, "text/csv");
  };

  // Export complete objectives data as JSON
  const exportJSON = () => {
    const content = JSON.stringify(objectives, null, 2);
    const filename = `${algorithmName}-objectives-${Date.now()}.json`;
    downloadFile(content, filename, "application/json");
  };

  // Export objectives data as Excel with 5 sheets (one per objective)
  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();

    // ==================== OBJECTIVE 1 ====================
    const obj1Data: unknown[][] = [
      ["OBJECTIVE 1 - SUMMARY"],
      [],
      ["Run", "Cz", "Z", "Final Value"],
      ...objectives.objective1.Cz.map((_, idx) => [
        idx + 1,
        objectives.objective1.Cz[idx],
        objectives.objective1.Z[idx],
        objectives.objective1.finalVals[idx],
      ]),
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(obj1Data);
    XLSX.utils.book_append_sheet(workbook, ws1, "Objective 1");

    // ==================== OBJECTIVE 2 ====================
    const obj2Data: unknown[][] = [
      ["OBJECTIVE 2 - SUMMARY"],
      [],
      ["Run", "P", "Z", "C", "Final Value"],
      ...objectives.objective2.P_runs.map((_, idx) => [
        idx + 1,
        objectives.objective2.P_runs[idx],
        objectives.objective2.Z_runs[idx],
        objectives.objective2.C_runs[idx],
        objectives.objective2.finalVals[idx],
      ]),
      [],
      [],
    ];

    // Add A_runs matrices horizontally
    obj2Data.push(["A_runs"]);
    const numRuns2A = objectives.objective2.A_runs.length;
    const headerRow2A = [""];
    for (let i = 0; i < numRuns2A; i++) {
      headerRow2A.push(`Run ${i + 1}`, "");
    }
    obj2Data.push(headerRow2A);

    const maxRows2A = Math.max(
      ...objectives.objective2.A_runs.map((m) => m.length),
    );
    for (let rowIdx = 0; rowIdx < maxRows2A; rowIdx++) {
      const row: unknown[] = [""];
      for (let runIdx = 0; runIdx < numRuns2A; runIdx++) {
        const matrix = objectives.objective2.A_runs[runIdx];
        if (rowIdx < matrix.length) {
          row.push(...matrix[rowIdx]);
        } else {
          row.push("", "");
        }
      }
      obj2Data.push(row);
    }

    // Add r_runs horizontally
    obj2Data.push([]);
    obj2Data.push(["r_runs"]);
    const numRuns2R = objectives.objective2.r_runs.length;
    const headerRow2R = [""];
    for (let i = 0; i < numRuns2R; i++) {
      headerRow2R.push(`Run ${i + 1}`);
    }
    obj2Data.push(headerRow2R);

    const maxRows2R = Math.max(
      ...objectives.objective2.r_runs.map((r) => r.length),
    );
    for (let rowIdx = 0; rowIdx < maxRows2R; rowIdx++) {
      const row: unknown[] = [""];
      for (let runIdx = 0; runIdx < numRuns2R; runIdx++) {
        const values = objectives.objective2.r_runs[runIdx];
        row.push(rowIdx < values.length ? values[rowIdx] : "");
      }
      obj2Data.push(row);
    }

    const ws2 = XLSX.utils.aoa_to_sheet(obj2Data);
    XLSX.utils.book_append_sheet(workbook, ws2, "Objective 2");

    // ==================== OBJECTIVE 3 ====================
    const obj3Data: unknown[][] = [
      ["OBJECTIVE 3 - SUMMARY"],
      [],
      ["Run", "Mean", "Std Dev", "Epsilon", "Final Value"],
      ...objectives.objective3.mean_runs.map((_, idx) => [
        idx + 1,
        objectives.objective3.mean_runs[idx],
        objectives.objective3.std_runs[idx],
        objectives.objective3.eps_runs[idx],
        objectives.objective3.finalVals[idx],
      ]),
      [],
      [],
    ];

    // Add totalsPerI_runs horizontally
    obj3Data.push(["Totals Per I"]);
    const numRuns3 = objectives.objective3.totalsPerI_runs.length;
    const headerRow3 = ["Index"];
    for (let i = 0; i < numRuns3; i++) {
      headerRow3.push(`Run ${i + 1}`);
    }
    obj3Data.push(headerRow3);

    const maxLen3 = Math.max(
      ...objectives.objective3.totalsPerI_runs.map((r) => r.length),
    );
    for (let idx = 0; idx < maxLen3; idx++) {
      const row: unknown[] = [idx];
      for (let runIdx = 0; runIdx < numRuns3; runIdx++) {
        const values = objectives.objective3.totalsPerI_runs[runIdx];
        row.push(idx < values.length ? values[idx] : "");
      }
      obj3Data.push(row);
    }

    const ws3 = XLSX.utils.aoa_to_sheet(obj3Data);
    XLSX.utils.book_append_sheet(workbook, ws3, "Objective 3");

    // ==================== OBJECTIVE 4 ====================
    const obj4Data: unknown[][] = [
      ["OBJECTIVE 4 - SUMMARY"],
      [],
      ["Run", "Z", "C", "Final Value"],
      ...objectives.objective4.Z_runs.map((_, idx) => [
        idx + 1,
        objectives.objective4.Z_runs[idx],
        objectives.objective4.C_runs[idx],
        objectives.objective4.finalVals[idx],
      ]),
      [],
      [],
    ];

    // Add A_runs matrices horizontally
    obj4Data.push(["A_runs"]);
    const numRuns4A = objectives.objective4.A_runs.length;
    const headerRow4A = [""];
    for (let i = 0; i < numRuns4A; i++) {
      headerRow4A.push(`Run ${i + 1}`, "");
    }
    obj4Data.push(headerRow4A);

    const maxRows4A = Math.max(
      ...objectives.objective4.A_runs.map((m) => m.length),
    );
    for (let rowIdx = 0; rowIdx < maxRows4A; rowIdx++) {
      const row: unknown[] = [""];
      for (let runIdx = 0; runIdx < numRuns4A; runIdx++) {
        const matrix = objectives.objective4.A_runs[runIdx];
        if (rowIdx < matrix.length) {
          row.push(...matrix[rowIdx]);
        } else {
          row.push("", "");
        }
      }
      obj4Data.push(row);
    }

    // Add D_runs matrices horizontally
    obj4Data.push([]);
    obj4Data.push(["D_runs"]);
    const numRuns4D = objectives.objective4.D_runs.length;
    const headerRow4D = [""];
    for (let i = 0; i < numRuns4D; i++) {
      headerRow4D.push(`Run ${i + 1}`, "");
    }
    obj4Data.push(headerRow4D);

    const maxRows4D = Math.max(
      ...objectives.objective4.D_runs.map((m) => m.length),
    );
    for (let rowIdx = 0; rowIdx < maxRows4D; rowIdx++) {
      const row: unknown[] = [""];
      for (let runIdx = 0; runIdx < numRuns4D; runIdx++) {
        const matrix = objectives.objective4.D_runs[runIdx];
        if (rowIdx < matrix.length) {
          row.push(...matrix[rowIdx]);
        } else {
          row.push("", "");
        }
      }
      obj4Data.push(row);
    }

    const ws4 = XLSX.utils.aoa_to_sheet(obj4Data);
    XLSX.utils.book_append_sheet(workbook, ws4, "Objective 4");

    // ==================== OBJECTIVE 5 ====================
    const obj5Data: unknown[][] = [
      ["OBJECTIVE 5 - SUMMARY"],
      [],
      ["Run", "Z", "Epsilon", "Final Value"],
      ...objectives.objective5.Z_runs.map((_, idx) => [
        idx + 1,
        objectives.objective5.Z_runs[idx],
        objectives.objective5.eps_runs[idx],
        objectives.objective5.finalVals[idx],
      ]),
      [],
      [],
    ];

    // Add AiTotals_runs horizontally
    obj5Data.push(["Ai Totals"]);
    const numRuns5A = objectives.objective5.AiTotals_runs.length;
    const headerRow5A = ["Index"];
    for (let i = 0; i < numRuns5A; i++) {
      headerRow5A.push(`Run ${i + 1}`);
    }
    obj5Data.push(headerRow5A);

    const maxLen5A = Math.max(
      ...objectives.objective5.AiTotals_runs.map((r) => r.length),
    );
    for (let idx = 0; idx < maxLen5A; idx++) {
      const row: unknown[] = [idx];
      for (let runIdx = 0; runIdx < numRuns5A; runIdx++) {
        const values = objectives.objective5.AiTotals_runs[runIdx];
        row.push(idx < values.length ? values[idx] : "");
      }
      obj5Data.push(row);
    }

    // Add DPi_runs horizontally
    obj5Data.push([]);
    obj5Data.push(["DPi"]);
    const numRuns5D = objectives.objective5.DPi_runs.length;
    const headerRow5D = ["Index"];
    for (let i = 0; i < numRuns5D; i++) {
      headerRow5D.push(`Run ${i + 1}`);
    }
    obj5Data.push(headerRow5D);

    const maxLen5D = Math.max(
      ...objectives.objective5.DPi_runs.map((r) => r.length),
    );
    for (let idx = 0; idx < maxLen5D; idx++) {
      const row: unknown[] = [idx];
      for (let runIdx = 0; runIdx < numRuns5D; runIdx++) {
        const values = objectives.objective5.DPi_runs[runIdx];
        row.push(idx < values.length ? values[idx] : "");
      }
      obj5Data.push(row);
    }

    const ws5 = XLSX.utils.aoa_to_sheet(obj5Data);
    XLSX.utils.book_append_sheet(workbook, ws5, "Objective 5");

    // Write file
    const filename = `${algorithmName}-objectives-${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, filename);
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

  const formatNumber = (num: number) => {
    return typeof num === "number" ? num.toFixed(6) : num;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Objectives Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown of all objective functions
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportExcel}>
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={exportJSON}>
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export Final Values to CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Objective 1 */}
        <Card>
          <CardHeader
            className="hover:bg-muted/50 cursor-pointer"
            onClick={() => toggleObjective(1)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Objective 1 - Coverage Score
              </CardTitle>
              {expandedObjectives.has(1) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedObjectives.has(1) && (
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Run</th>
                      <th className="p-2 text-right">Cz</th>
                      <th className="p-2 text-right">Z</th>
                      <th className="p-2 text-right">Final Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objectives.objective1.Cz.map((_, idx) => (
                      <tr key={idx} className="hover:bg-muted/50 border-b">
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective1.Cz[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective1.Z[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective1.finalVals[idx])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Objective 2 */}
        <Card>
          <CardHeader
            className="hover:bg-muted/50 cursor-pointer"
            onClick={() => toggleObjective(2)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Objective 2 - Prioritization Fulfillment
              </CardTitle>
              {expandedObjectives.has(2) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedObjectives.has(2) && (
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Run</th>
                      <th className="p-2 text-right">P</th>
                      <th className="p-2 text-right">Z</th>
                      <th className="p-2 text-right">C</th>
                      <th className="p-2 text-right">Final Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objectives.objective2.P_runs.map((_, idx) => (
                      <tr key={idx} className="hover:bg-muted/50 border-b">
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective2.P_runs[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective2.Z_runs[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective2.C_runs[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective2.finalVals[idx])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* A_runs and r_runs matrices display */}
              <div className="space-y-4 border-t pt-4">
                <div>
                  <h4 className="mb-2 font-semibold">A_runs Matrices</h4>
                  <div className="space-y-3">
                    {objectives.objective2.A_runs.map((matrix, runIdx) => (
                      <details key={runIdx} className="rounded border p-2">
                        <summary className="cursor-pointer font-medium">
                          Run {runIdx + 1}
                        </summary>
                        <div className="mt-2 overflow-x-auto">
                          <table className="w-full border-collapse text-xs">
                            <tbody>
                              {matrix.map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                  {row.map((val, colIdx) => (
                                    <td
                                      key={colIdx}
                                      className="border p-1 text-right font-mono"
                                    >
                                      {formatNumber(val)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">r_runs Matrices</h4>
                  <div className="space-y-3">
                    {objectives.objective2.r_runs.map((matrix, runIdx) => (
                      <details key={runIdx} className="rounded border p-2">
                        <summary className="cursor-pointer font-medium">
                          Run {runIdx + 1}
                        </summary>
                        <div className="mt-2 overflow-x-auto">
                          <table className="w-full border-collapse text-xs">
                            <tbody>
                              {matrix.map((val, idx) => (
                                <tr key={idx}>
                                  <td className="border p-1 text-right font-mono">
                                    {formatNumber(val)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Objective 3 */}
        <Card>
          <CardHeader
            className="hover:bg-muted/50 cursor-pointer"
            onClick={() => toggleObjective(3)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Objective 3 - Distribution Imbalance Penalty
              </CardTitle>
              {expandedObjectives.has(3) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedObjectives.has(3) && (
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Run</th>
                      <th className="p-2 text-right">Mean</th>
                      <th className="p-2 text-right">Std Dev</th>
                      <th className="p-2 text-right">Epsilon</th>
                      <th className="p-2 text-right">Final Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objectives.objective3.mean_runs.map((_, idx) => (
                      <tr key={idx} className="hover:bg-muted/50 border-b">
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective3.mean_runs[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective3.std_runs[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective3.eps_runs[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective3.finalVals[idx])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* totalsPerI_runs display */}
              <div className="border-t pt-4">
                <h4 className="mb-2 font-semibold">Totals Per I</h4>
                <div className="space-y-3">
                  {objectives.objective3.totalsPerI_runs.map((run, runIdx) => (
                    <details key={runIdx} className="rounded border p-2">
                      <summary className="cursor-pointer font-medium">
                        Run {runIdx + 1}
                      </summary>
                      <div className="mt-2 overflow-x-auto">
                        <div className="flex flex-wrap gap-2">
                          {run.map((val, idx) => (
                            <span
                              key={idx}
                              className="bg-muted rounded px-2 py-1 font-mono text-xs"
                            >
                              {idx}: {formatNumber(val)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Objective 4 */}
        <Card>
          <CardHeader
            className="hover:bg-muted/50 cursor-pointer"
            onClick={() => toggleObjective(4)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Objective 4 - Demand Satisfaction
              </CardTitle>
              {expandedObjectives.has(4) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedObjectives.has(4) && (
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Run</th>
                      <th className="p-2 text-right">Z</th>
                      <th className="p-2 text-right">C</th>
                      <th className="p-2 text-right">Final Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objectives.objective4.Z_runs.map((_, idx) => (
                      <tr key={idx} className="hover:bg-muted/50 border-b">
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective4.Z_runs[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective4.C_runs[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective4.finalVals[idx])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* A_runs and D_runs matrices display */}
              <div className="space-y-4 border-t pt-4">
                <div>
                  <h4 className="mb-2 font-semibold">A_runs Matrices</h4>
                  <div className="space-y-3">
                    {objectives.objective4.A_runs.map((matrix, runIdx) => (
                      <details key={runIdx} className="rounded border p-2">
                        <summary className="cursor-pointer font-medium">
                          Run {runIdx + 1}
                        </summary>
                        <div className="mt-2 overflow-x-auto">
                          <table className="w-full border-collapse text-xs">
                            <tbody>
                              {matrix.map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                  {row.map((val, colIdx) => (
                                    <td
                                      key={colIdx}
                                      className="border p-1 text-right font-mono"
                                    >
                                      {formatNumber(val)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">D_runs Matrices</h4>
                  <div className="space-y-3">
                    {objectives.objective4.D_runs.map((matrix, runIdx) => (
                      <details key={runIdx} className="rounded border p-2">
                        <summary className="cursor-pointer font-medium">
                          Run {runIdx + 1}
                        </summary>
                        <div className="mt-2 overflow-x-auto">
                          <table className="w-full border-collapse text-xs">
                            <tbody>
                              {matrix.map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                  {row.map((val, colIdx) => (
                                    <td
                                      key={colIdx}
                                      className="border p-1 text-right font-mono"
                                    >
                                      {formatNumber(val)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Objective 5 */}
        <Card>
          <CardHeader
            className="hover:bg-muted/50 cursor-pointer"
            onClick={() => toggleObjective(5)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Objective 5 - Displaced Population Index
              </CardTitle>
              {expandedObjectives.has(5) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedObjectives.has(5) && (
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Run</th>
                      <th className="p-2 text-right">Z</th>
                      <th className="p-2 text-right">Epsilon</th>
                      <th className="p-2 text-right">Final Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objectives.objective5.Z_runs.map((_, idx) => (
                      <tr key={idx} className="hover:bg-muted/50 border-b">
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective5.Z_runs[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective5.eps_runs[idx])}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatNumber(objectives.objective5.finalVals[idx])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AiTotals_runs and DPi_runs display */}
              <div className="space-y-4 border-t pt-4">
                <div>
                  <h4 className="mb-2 font-semibold">Ai Totals</h4>
                  <div className="space-y-3">
                    {objectives.objective5.AiTotals_runs.map((run, runIdx) => (
                      <details key={runIdx} className="rounded border p-2">
                        <summary className="cursor-pointer font-medium">
                          Run {runIdx + 1}
                        </summary>
                        <div className="mt-2 overflow-x-auto">
                          <div className="flex flex-wrap gap-2">
                            {run.map((val, idx) => (
                              <span
                                key={idx}
                                className="bg-muted rounded px-2 py-1 font-mono text-xs"
                              >
                                {idx}: {formatNumber(val)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">DPi</h4>
                  <div className="space-y-3">
                    {objectives.objective5.DPi_runs.map((run, runIdx) => (
                      <details key={runIdx} className="rounded border p-2">
                        <summary className="cursor-pointer font-medium">
                          Run {runIdx + 1}
                        </summary>
                        <div className="mt-2 overflow-x-auto">
                          <div className="flex flex-wrap gap-2">
                            {run.map((val, idx) => (
                              <span
                                key={idx}
                                className="bg-muted rounded px-2 py-1 font-mono text-xs"
                              >
                                {idx}: {formatNumber(val)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </CardContent>
    </Card>
  );
}
