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
  combinedCloseness: number;
  populationScore: number;
}

export interface OverallStats {
  totalBarangays: number;
  averagePopulationScore: number;
  averagePopulationCloseness: number;
  averageSarCloseness: number;
  averageEmsCloseness: number;
  averageHazardCloseness: number;
  averageCombinedCloseness: number;
  qualityRating: string;
}

export interface ValidationReportSingle {
  standard: string;
  baseline: string;
  barangayValidations: BarangayValidation[];
  overallStats: OverallStats;
  interpretation: string;
  error: string | null;
  timestamp: number;
}

export interface ValidationReportSingleResponse {
  validationReport: ValidationReportSingle;
}

export interface PerBarangayStat {
  barangayId: string;
  barangayName: string;
  meanPopulationCloseness: number;
  stdPopulationCloseness: number;
  cvPopulationCloseness: number;
  meanSarCloseness: number;
  stdSarCloseness: number;
  cvSarCloseness: number;
  meanEmsCloseness: number;
  stdEmsCloseness: number;
  cvEmsCloseness: number;
  meanHazardCloseness: number;
  stdHazardCloseness: number;
  cvHazardCloseness: number;
  meanCombinedCloseness: number;
  stdCombinedCloseness: number;
  cvCombinedCloseness: number;
}

export interface ValidationReportMultiple {
  meanPopulationCloseness: number;
  meanSarCloseness: number;
  meanEmsCloseness: number;
  meanHazardCloseness: number;
  meanCombinedCloseness: number;
  meanPopulationScore: number;

  stdPopulationCloseness: number;
  stdSarCloseness: number;
  stdEmsCloseness: number;
  stdHazardCloseness: number;
  stdCombinedCloseness: number;
  stdPopulationScore: number;

  minPopulationCloseness: number;
  minSarCloseness: number;
  minEmsCloseness: number;
  minHazardCloseness: number;
  minCombinedCloseness: number;
  minPopulationScore: number;

  maxPopulationCloseness: number;
  maxSarCloseness: number;
  maxEmsCloseness: number;
  maxHazardCloseness: number;
  maxCombinedCloseness: number;
  maxPopulationScore: number;

  cvPopulationCloseness: number;
  cvSarCloseness: number;
  cvEmsCloseness: number;
  cvHazardCloseness: number;
  cvCombinedCloseness: number;
  cvPopulationScore: number;

  individualRuns: ValidationReportSingle[];
  perBarangayStats: PerBarangayStat[];
}

export interface ValidationReportMultipleResponse {
  validationReport: ValidationReportMultiple;
}

export interface ObjectiveData {
  objective1: Objective1;
  objective2: Objective2;
  objective3: Objective3;
  objective4: Objective4;
  objective5: Objective5;
}

export interface Objective1 {
  Cz: number[];
  Z: number[];
  finalVals: number[];
}

export interface Objective2 {
  A_runs: number[][][];
  r_runs: number[][];
  P_runs: number[];
  Z_runs: number[];
  C_runs: number[];
  finalVals: number[];
}

export interface Objective3 {
  totalsPerI_runs: number[][];
  mean_runs: number[];
  std_runs: number[];
  eps_runs: number[];
  finalVals: number[];
}

export interface Objective4 {
  A_runs: number[][][];
  D_runs: number[][][];
  Z_runs: number[];
  C_runs: number[];
  finalVals: number[];
}

export interface Objective5 {
  AiTotals_runs: number[][];
  DPi_runs: number[][];
  Z_runs: number[];
  eps_runs: number[];
  finalVals: number[];
}

export interface QualityComparison {
  scenarioPercentageChanges: number[];
  scenarioComparisons: ScenarioComparison[];
  meanPercentageChange: number;
  minPercentageChange: number;
  maxPercentageChange: number;
  faMeanSQ: number;
  efaMeanSQ: number;
  improvedScenarios: number;
  unchangedScenarios: number;
  degradedScenarios: number;
}

export interface ScenarioComparison {
  scenarioNumber: number;
  faSolutionQuality: number;
  efaSolutionQuality: number;
  percentageChange: number;
  barangayComparisons: BarangayComparison[];
}

export interface BarangayComparison {
  barangayId: string;
  barangayName: string;
  barangayFAScore: BarangayScore;
  barangayEFAScore: BarangayScore;
  percentageChange: number;
  degradation: boolean;
  noChange: boolean;
  improvement: boolean;
}

export interface BarangayScore {
  barangayId: string;
  barangayName: string;
  allocated: number;
  required: number;
  score: number;
  hazardLevel: string;
}
