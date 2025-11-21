import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SimulationHeader } from "./components/simulation/simulation-header";
import type { AlgorithmMode, RunMode, SimulationParams } from "./types";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "./components/ui/motion-tabs";
import { Card, CardContent } from "./components/ui/card";
import {
  Activity,
  GitCompareArrows,
  Settings2,
  TrendingUp,
} from "lucide-react";
import { AlgorithmSelector } from "./components/simulation/algorithm-selector";
import { ControlPanel } from "./components/simulation/control-panel";
import { RunModeSelector } from "./components/simulation/run-mode-selector";
import { ParameterControls } from "./components/simulation/parameter-controls";
import { healthQueryOptions } from "./queries/common";
import {
  startSingleRunFAMutationOptions,
  startMultipleRunFAMutationOptions,
  stopFAMutationOptions,
  statusFAQueryOptions,
  iterationsFAQueryOptions,
  resultsFAQueryOptions,
  allocationsFAQueryOptions,
  flowsFAQueryOptions,
  validationReportSingleFAQueryOptions,
} from "./queries/fa";
import {
  startSingleRunEFAMutationOptions,
  startMultipleRunEFAMutationOptions,
  stopEFAMutationOptions,
  statusEFAQueryOptions,
  iterationsEFAQueryOptions,
  resultsEFAQueryOptions,
  allocationsEFAQueryOptions,
  flowsEFAQueryOptions,
} from "./queries/efa";
import { toast } from "sonner";
import { ChartLineFitnessIteration } from "./components/charts/chart-line-fitness-iteration";
import { SingleRunResult } from "./components/results/single/single-run-result";
import { MultipleRunResult } from "./components/results/multiple-run-result";
import { AlgorithmCompare } from "./components/simulation/algorithm-compare";

const DEFAULT_PARAMS: SimulationParams = {
  generations: 300,
  numFireflies: 50,
  alpha0: 0.6,
  alphaFinal: 0.05,
  beta0: 1.0,
  gamma: 1.0,
  betaMin: 0.2, // Default for EFA
};

const REFETCH_INTERVAL_MS = 200;

function App() {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);

  const [algorithmMode, setAlgorithmMode] = useState<AlgorithmMode>("original");
  const [runMode, setRunMode] = useState<RunMode>("single");
  const [progress, setProgress] = useState<number | null>(null);

  const [numRuns, setNumRuns] = useState(30);
  const [currentRun, setCurrentRun] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [bestFitnessOriginal, setBestFitnessOriginal] = useState<number | null>(
    null,
  );
  const [bestFitnessExtended, setBestFitnessExtended] = useState<number | null>(
    null,
  );

  // Health check query
  const { data: health, isLoading, isError } = useQuery(healthQueryOptions());

  // Determine which algorithm queries to use
  const isFA = algorithmMode === "original";
  const isEFA = algorithmMode === "extended";

  // Status polling query - switches based on algorithm mode
  const { data: statusDataFA } = useQuery({
    ...statusFAQueryOptions(),
    enabled: isRunning && isFA,
    refetchInterval: isRunning && isFA ? REFETCH_INTERVAL_MS : false,
  });

  const { data: statusDataEFA } = useQuery({
    ...statusEFAQueryOptions(),
    enabled: isRunning && isEFA,
    refetchInterval: isRunning && isEFA ? REFETCH_INTERVAL_MS : false,
  });

  const statusData = isFA ? statusDataFA : statusDataEFA;

  // Iteration history polling - only for single run mode
  const { data: iterationsDataFA } = useQuery({
    ...iterationsFAQueryOptions(),
    enabled: isRunning && runMode === "single" && isFA,
    refetchInterval:
      isRunning && runMode === "single" && isFA ? REFETCH_INTERVAL_MS : false,
  });

  const { data: iterationsDataEFA } = useQuery({
    ...iterationsEFAQueryOptions(),
    enabled: isRunning && runMode === "single" && isEFA,
    refetchInterval:
      isRunning && runMode === "single" && isEFA ? REFETCH_INTERVAL_MS : false,
  });

  const iterationsData = isFA ? iterationsDataFA : iterationsDataEFA;

  // Results queries
  const { data: resultsDataFA, refetch: refetchResultsFA } = useQuery({
    ...resultsFAQueryOptions(),
    enabled: false,
  });

  const { data: resultsDataEFA, refetch: refetchResultsEFA } = useQuery({
    ...resultsEFAQueryOptions(),
    enabled: false,
  });

  const resultsData = isFA ? resultsDataFA : resultsDataEFA;
  const refetchResults = isFA ? refetchResultsFA : refetchResultsEFA;

  // Allocations queries
  const { data: allocationsDataFA, refetch: refetchAllocationsFA } = useQuery({
    ...allocationsFAQueryOptions(),
    enabled: false,
  });

  const { data: allocationsDataEFA, refetch: refetchAllocationsEFA } = useQuery(
    {
      ...allocationsEFAQueryOptions(),
      enabled: false,
    },
  );

  const allocationsData = isFA ? allocationsDataFA : allocationsDataEFA;
  const refetchAllocations = isFA
    ? refetchAllocationsFA
    : refetchAllocationsEFA;

  // Flows queries
  const { data: flowsDataFA, refetch: refetchFlowsFA } = useQuery({
    ...flowsFAQueryOptions(),
    enabled: false,
  });

  const { data: flowsDataEFA, refetch: refetchFlowsEFA } = useQuery({
    ...flowsEFAQueryOptions(),
    enabled: false,
  });

  const flowsData = isFA ? flowsDataFA : flowsDataEFA;
  const refetchFlows = isFA ? refetchFlowsFA : refetchFlowsEFA;

  const {
    data: validationReportSingleDataFA,
    refetch: refetchValidationReportSingleFA,
  } = useQuery({ ...validationReportSingleFAQueryOptions(), enabled: false }); // Placeholder for validation report query

  const refetchValidationReportSingleEFA = () => {
    console.log("Test");
  };

  const validationReportData = validationReportSingleDataFA;
  const refetchValidationReport = isFA
    ? refetchValidationReportSingleFA
    : refetchValidationReportSingleEFA;

  // FA mutations
  const { mutate: startSingleRunFA } = useMutation({
    ...startSingleRunFAMutationOptions(),
    onMutate: () => {
      setIsStarting(true);
    },
    onSuccess: () => {
      setIsRunning(true);
      setIsStarting(false);
      toast.success("Single run started (Original FA)");
    },
    onError: () => {
      setIsStarting(false);
      setIsRunning(false);
    },
  });

  const { mutate: startMultipleRunFA } = useMutation({
    ...startMultipleRunFAMutationOptions(),
    onMutate: () => {
      setIsStarting(true);
    },
    onSuccess: () => {
      setIsRunning(true);
      setIsStarting(false);
      toast.success(`Started ${numRuns} runs (Original FA)`);
    },
    onError: () => {
      setIsStarting(false);
      setIsRunning(false);
    },
  });

  const { mutate: stopFA } = useMutation({
    ...stopFAMutationOptions(),
    onSuccess: () => {
      setIsRunning(false);
      toast.info("Simulation stopped (Original FA)");
    },
  });

  // EFA mutations
  const { mutate: startSingleRunEFA } = useMutation({
    ...startSingleRunEFAMutationOptions(),
    onMutate: () => {
      setIsStarting(true);
    },
    onSuccess: () => {
      setIsRunning(true);
      setIsStarting(false);
      toast.success("Single run started (Extended FA)");
    },
    onError: () => {
      setIsStarting(false);
      setIsRunning(false);
    },
  });

  const { mutate: startMultipleRunEFA } = useMutation({
    ...startMultipleRunEFAMutationOptions(),
    onMutate: () => {
      setIsStarting(true);
    },
    onSuccess: () => {
      setIsRunning(true);
      setIsStarting(false);
      toast.success(`Started ${numRuns} runs (Extended FA)`);
    },
    onError: () => {
      setIsStarting(false);
      setIsRunning(false);
    },
  });

  const { mutate: stopEFA } = useMutation({
    ...stopEFAMutationOptions(),
    onSuccess: () => {
      setIsRunning(false);
      toast.info("Simulation stopped (Extended FA)");
    },
  });

  // Update state based on status data
  useEffect(() => {
    if (statusData) {
      // Handle different modes
      if (statusData.mode === "single") {
        setCurrentIteration(statusData.currentIteration || 0);
      } else if (statusData.mode === "multiple") {
        if (statusData.completedRuns === statusData.totalRuns) {
          setCurrentRun(statusData.totalRuns);
        } else {
          setCurrentRun(statusData.currentRun || 0);
        }
      }

      setProgress(statusData.progress || null);

      // Only update isRunning based on backend state appropriately
      if (statusData.running && !isRunning && !isStarting) {
        // Backend started, frontend didn't know yet (edge case)
        setIsRunning(true);
      } else if (!statusData.running && isRunning && !isStarting) {
        setIsRunning(false);

        if (statusData.completed) {
          console.log("Simulation completed successfully");
          toast.success("Simulation completed successfully");

          // Fetch results data for single run mode
          if (runMode === "single") {
            refetchResults();
            refetchAllocations();
            refetchFlows();
            refetchValidationReport();
          }

          // Fetch results data for multiple run mode
          if (runMode === "multiple") {
            refetchResults();
          }
        } else if (statusData.error) {
          console.error("Simulation stopped with error:", statusData.error);
          toast.error(`Simulation error: ${statusData.error}`);
        }
      }
    }
  }, [
    statusData,
    isRunning,
    isStarting,
    runMode,
    refetchResults,
    refetchAllocations,
    refetchFlows,
    refetchValidationReport,
  ]);

  // Update fitness from iteration history (single run only)
  useEffect(() => {
    if (
      iterationsData &&
      iterationsData.iterations &&
      iterationsData.iterations.length > 0
    ) {
      const lastIteration =
        iterationsData.iterations[iterationsData.iterations.length - 1];

      if (algorithmMode === "original") {
        setBestFitnessOriginal(lastIteration.fitness);
      } else if (algorithmMode === "extended") {
        setBestFitnessExtended(lastIteration.fitness);
      }
    }
  }, [iterationsData, algorithmMode]);

  let apiStatus: "connected" | "disconnected" | "checking" = "checking";

  if (isLoading) {
    apiStatus = "checking";
  } else if (isError) {
    apiStatus = "disconnected";
  } else if (health?.status === "UP") {
    apiStatus = "connected";
  }

  function handleResetParams() {
    setParams(DEFAULT_PARAMS);
    toast.success("Parameters reset to defaults");
  }

  function handleParamChange(key: keyof SimulationParams, value: number) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  function validateParameters() {
    if (
      algorithmMode === "extended" &&
      params.betaMin !== undefined &&
      params.betaMin > params.beta0
    ) {
      toast.error(
        `Invalid parameters: Beta Min (${params.betaMin.toFixed(2)}) must be ≤ Beta₀ (${params.beta0.toFixed(2)})`,
      );
      return false;
    }
    return true;
  }

  function handleOnStartSimulation() {
    if (!validateParameters()) {
      return;
    }

    if (runMode === "single") {
      switch (algorithmMode) {
        case "original":
          startSingleRunFA(params);
          break;
        case "extended":
          startSingleRunEFA(params);
          break;
      }
    } else if (runMode === "multiple") {
      switch (algorithmMode) {
        case "original":
          startMultipleRunFA({ params, numRuns });
          break;
        case "extended":
          startMultipleRunEFA({ params, numRuns });
          break;
      }
    }
  }

  function handleOnResetSimulation() {
    // Stop the appropriate algorithm
    if (algorithmMode === "original") {
      stopFA();
    } else if (algorithmMode === "extended") {
      stopEFA();
    }

    setIsRunning(false);
    setIsStarting(false);
    setCurrentIteration(0);
    setCurrentRun(0);
    setNumRuns(30);
    setProgress(null);
    setBestFitnessOriginal(null);
    setBestFitnessExtended(null);
  }

  function renderResultsContent() {
    // Simulation in progress
    if (isRunning || isStarting) {
      return (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
              <div className="space-y-2 text-center">
                <p className="text-lg font-medium">Simulation in Progress</p>
                <p className="text-muted-foreground text-sm">
                  {runMode === "single"
                    ? `Running iteration ${currentIteration} of ${params.generations}`
                    : `Running ${currentRun} of ${numRuns} simulations`}
                </p>
                {progress !== null && (
                  <p className="text-muted-foreground text-sm">
                    {Math.round(progress * 100)}% complete
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Single run results
    if (
      runMode === "single" &&
      resultsData &&
      iterationsData &&
      allocationsData &&
      flowsData &&
      validationReportData &&
      "executionTimeMs" in resultsData
    ) {
      return (
        <SingleRunResult
          result={resultsData}
          allocations={allocationsData.allocations}
          flows={flowsData.flows}
          validationReportSingle={validationReportData.validationReport}
          algorithmMode={algorithmMode}
          iterations={iterationsData.iterations}
        />
      );
    }

    // Multiple run results
    if (runMode === "multiple" && resultsData && "totalRuns" in resultsData) {
      return (
        <MultipleRunResult result={resultsData} algorithmMode={algorithmMode} />
      );
    }

    // No results available
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-muted-foreground text-center">
            <p>No results available yet. Run a simulation to see results.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <SimulationHeader apiStatus={apiStatus} />

        <Tabs defaultValue="simulation" className="space-y-6">
          <TabsList>
            <TabsTrigger value="simulation">
              <Activity className="mr-2 h-4 w-4" />
              Simulation
            </TabsTrigger>
            <TabsTrigger value="parameters">
              <Settings2 className="mr-2 h-4 w-4" />
              Parameters
            </TabsTrigger>
            <TabsTrigger value="results">
              <TrendingUp className="mr-2 h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="compare">
              <GitCompareArrows className="mr-2 h-4 w-4" />
              Compare
            </TabsTrigger>
          </TabsList>

          <TabsContents>
            <TabsContent value="simulation" className="space-y-6">
              <AlgorithmSelector
                algorithmMode={algorithmMode}
                onAlgorithmModeChange={setAlgorithmMode}
                isRunning={isRunning || isStarting}
              />

              <RunModeSelector
                runMode={runMode}
                numRuns={numRuns}
                isRunning={isRunning || isStarting}
                onRunModeChange={setRunMode}
                onNumRunsChange={setNumRuns}
              />

              <div className="grid gap-6 lg:grid-cols-3">
                <ControlPanel
                  isRunning={isRunning || isStarting}
                  progress={progress}
                  currentIteration={currentIteration}
                  totalGenerations={params.generations}
                  totalRuns={numRuns}
                  currentRun={currentRun}
                  bestFitnessOriginal={bestFitnessOriginal}
                  bestFitnessExtended={bestFitnessExtended}
                  numFireflies={params.numFireflies}
                  algorithmMode={algorithmMode}
                  runMode={runMode}
                  onStart={handleOnStartSimulation}
                  onReset={handleOnResetSimulation}
                />

                <div className="lg:col-span-2">
                  {runMode === "single" ? (
                    <ChartLineFitnessIteration
                      data={iterationsData?.iterations ?? []}
                    />
                  ) : null}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="parameters" className="space-y-6">
              <ParameterControls
                params={params}
                isRunning={isRunning || isStarting}
                onParamChange={handleParamChange}
                onResetParams={handleResetParams}
                algorithmMode={algorithmMode}
              />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {renderResultsContent()}
            </TabsContent>

            <TabsContent value="compare" className="space-y-6">
              <AlgorithmCompare />
            </TabsContent>
          </TabsContents>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
