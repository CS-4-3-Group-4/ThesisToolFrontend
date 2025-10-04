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
import { Activity, Settings2, TrendingUp } from "lucide-react";
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
} from "./queries/fa";
import { toast } from "sonner";
import { ChartLineFitnessIteration } from "./components/charts/chart-line-fitness-iteration";
import { SingleRunFAResult } from "./components/results/single-run-fa-result";

const DEFAULT_PARAMS: SimulationParams = {
  generations: 300,
  numFireflies: 50,
  alpha0: 0.6,
  alphaFinal: 0.05,
  beta0: 1.0,
  gamma: 1.0,
};

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

  // Status polling query - only runs when isRunning is true
  const { data: statusData } = useQuery({
    ...statusFAQueryOptions(),
    enabled: isRunning,
    refetchInterval: isRunning ? 100 : false,
  });

  // Iteration history polling - only for single run mode
  const { data: iterationsData } = useQuery({
    ...iterationsFAQueryOptions(),
    enabled: isRunning && runMode === "single",
    refetchInterval: isRunning && runMode === "single" ? 100 : false,
  });

  const { data: resultsData, refetch: refetchResults } = useQuery({
    ...resultsFAQueryOptions(),
    enabled: false, // We'll manually trigger this
  });

  const { data: allocationsData, refetch: refetchAllocations } = useQuery({
    ...allocationsFAQueryOptions(),
    enabled: false,
  });

  const { data: flowsData, refetch: refetchFlows } = useQuery({
    ...flowsFAQueryOptions(),
    enabled: false,
  });

  // Single FA mutation
  const { mutate: startSingleRunFA } = useMutation({
    ...startSingleRunFAMutationOptions(),
    onMutate: () => {
      setIsStarting(true);
    },
    onSuccess: () => {
      setIsRunning(true);
      setIsStarting(false);
      toast.success("Single run started");
    },
    onError: () => {
      setIsStarting(false);
      setIsRunning(false);
    },
  });

  // Multiple FA mutation
  const { mutate: startMultipleRunFA } = useMutation({
    ...startMultipleRunFAMutationOptions(),
    onMutate: () => {
      setIsStarting(true);
    },
    onSuccess: () => {
      setIsRunning(true);
      setIsStarting(false);
      toast.success(`Started ${numRuns} runs`);
    },
    onError: () => {
      setIsStarting(false);
      setIsRunning(false);
    },
  });

  const { mutate: stopSimulation } = useMutation({
    ...stopFAMutationOptions(),
    onSuccess: () => {
      setIsRunning(false);
      toast.info("Simulation stopped");
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
        } else if (statusData.error) {
          console.error("Simulation stopped with error:", statusData.error);
          toast.error(`Simulation error: ${statusData.error}`);
        }
      }
    }
  }, [statusData, isRunning, isStarting]);

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
      } else if (algorithmMode === "both") {
        toast.error("NOT YET IMPLEMENTED");
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

  function handleOnStartSimulation() {
    if (runMode === "single") {
      switch (algorithmMode) {
        case "original":
          startSingleRunFA(params);
          break;
        case "extended":
          toast.error("EXTENDED FA NOT YET IMPLEMENTED [SINGLE MODE]");
          break;
        case "both":
          toast.error("COMPARISON MODE NOT YET IMPLEMENTED [SINGLE MODE]");
          break;
      }
    } else if (runMode === "multiple") {
      switch (algorithmMode) {
        case "original":
          startMultipleRunFA({ params, numRuns });
          break;
        case "extended":
          toast.error("EXTENDED FA NOT YET IMPLEMENTED [MULTIPLE MODE]");
          break;
        case "both":
          toast.error("COMPARISON MODE NOT YET IMPLEMENTED [MULTIPLE MODE]");
          break;
      }
    }
  }

  function handleOnResetSimulation() {
    stopSimulation();

    setIsRunning(false);
    setIsStarting(false);
    setCurrentIteration(0);
    setCurrentRun(0);
    setNumRuns(30);
    setProgress(null);
    setBestFitnessOriginal(null);
    setBestFitnessExtended(null);

    if (iterationsData) {
      iterationsData.iterations = [];
    }
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
              />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              Result
            </TabsContent>
          </TabsContents>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
