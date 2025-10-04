export interface SimulationParams {
  numFireflies: number;
  gamma: number;
  beta0: number;
  alpha0: number;
  alphaFinal: number;
  generations: number;
}

export type AlgorithmMode = "original" | "extended" | "both";
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
