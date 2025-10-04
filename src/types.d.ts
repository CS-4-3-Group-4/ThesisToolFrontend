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
