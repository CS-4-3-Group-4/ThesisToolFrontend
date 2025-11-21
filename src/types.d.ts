export interface SimulationParams {
  numFireflies: number;
  gamma: number;
  beta0: number;
  alpha0: number;
  alphaFinal: number;
  generations: number;
  betaMin?: number; // Optional - only used by EFA
}

export type AlgorithmMode = "original" | "extended";
export type RunMode = "single" | "multiple";

export type StatusResponse =
  | {
      running: boolean;
      mode: "multiple";
      currentRun: number;
      totalRuns: number;
      completedRuns: number;
      failedRuns: number;
      progress: number;
      totalDurationMs?: number;
      errors?: string[];
      error?: string;
      completed?: true;
    }
  | {
      running: boolean;
      mode: "single";
      currentIteration: number;
      totalIterations: number;
      progress: number;
      error?: string;
      completed?: true;
    };

export type StopResponse = {
  message: string;
};

export type IterationsResponse = {
  iterations: Array<{
    iteration: number;
    fitness: number;
  }>;
};

export interface AllocationsResponse {
  allocations: Allocation[];
}

export interface FlowsResponse {
  flows: Flow[];
}

export type ResultsResponse = SingleRunResult | MultipleRunResult;

export interface Allocation {
  id: string;
  name: string;
  personnel: Personnel;
  total: number;
}

export interface Personnel {
  SAR: number;
  EMS: number;
}

export interface Flow {
  classId: string;
  className: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
}

export interface SingleRunResult {
  fitnessMaximization: number;
  executionTimeMs: number;
  memoryBytes: number;
  totalIterations: number;
  fitnessMinimization: number;
}

export interface MultipleRunResult {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  totalDurationMs: number;
  fitnessMaximization: {
    best: number;
    worst: number;
    average: number;
  };
  fitnessMinimization: {
    best: number;
    worst: number;
    average: number;
  };
  executionTime: {
    average: number;
    min: number;
    max: number;
  };
  memory: {
    average: number;
    min: number;
    max: number;
  };
  runs: Array<{
    runNumber: number;
    fitnessMaximization: number;
    fitnessMinimization: number;
    executionTimeMs: number;
    memoryBytes: number;
  }>;
  errors?: string[]; // Optional, only present if there are errors
}

//

export interface BarangayValidation {
  barangayId: string;
  barangayName: string;
  population: number;
  hazardLevel: string;
  idealTotal: number;
  idealSAR: number;
  idealEMS: number;
  actualTotal: number;
  actualSAR: number;
  actualEMS: number;
  populationCloseness: number;
  sarCloseness: number;
  emsCloseness: number;
  hazardCloseness: number;
  combinedScore: number;
  populationScore: number;
}

export interface OverallStats {
  totalBarangays: number;
  averagePopulationCloseness: number;
  averageHazardCloseness: number;
  averageCombinedScore: number;
  qualityRating: string;
}

export interface ValidationReport {
  standard: string;
  baseline: string;
  barangayValidations: BarangayValidation[];
  overallStats: OverallStats;
  multiRunStats: null;
  interpretation: string;
  error: string | null;
  timestamp: number;
  multiRun: boolean;
}

export interface ValidationReportResponse {
  validationReport: ValidationReport;
}


