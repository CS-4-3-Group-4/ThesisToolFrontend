import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SimulationHeader } from "./components/simulation/simulation-header";
import type { AlgorithmMode, RunMode } from "./types";
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
import { healthQueryOptions } from "./queries/common";
import {
  startSingleRunFAMutationOptions,
  stopFAMutationOptions,
  statusFAQueryOptions,
  iterationsFAQueryOptions,
} from "./queries/fa";
import { toast } from "sonner";

interface SimulationParams {
  numFireflies: number;
  gamma: number;
  beta0: number;
  alpha0: number;
  alphaFinal: number;
  generations: number;
}

function App() {
  const [params] = useState<SimulationParams>({
    generations: 300,
    numFireflies: 50,
    alpha0: 0.6,
    alphaFinal: 0.05,
    beta0: 1.0,
    gamma: 1.0,
  });

  const [algorithmMode, setAlgorithmMode] = useState<AlgorithmMode>("original");
  const [runMode, setRunMode] = useState<RunMode>("single");
  const [numRuns, setNumRuns] = useState(30);
  const [currentRun, setCurrentRun] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false); // NEW: track startup state
  const [currentIteration, setCurrentIteration] = useState(0);
  const [bestFitnessOriginal, setBestFitnessOriginal] = useState<number | null>(
    null,
  );
  const [bestFitnessExtended, setBestFitnessExtended] = useState<number | null>(
    null,
  );

  // Health check query
  const { data, isLoading, isError } = useQuery(healthQueryOptions());

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

  // Mutations with proper state management
  const { mutate: startSingleRun } = useMutation({
    ...startSingleRunFAMutationOptions(),
    onMutate: () => {
      setIsStarting(true); // Lock the button during startup
    },
    onSuccess: () => {
      setIsRunning(true);
      setIsStarting(false);
    },
    onError: () => {
      setIsStarting(false); // Unlock on error
      setIsRunning(false);
    },
  });

  const { mutate: stopSimulation } = useMutation({
    ...stopFAMutationOptions(),
    onSuccess: () => {
      setIsRunning(false);
    },
  });

  // Update state based on status data - FIXED
  useEffect(() => {
    if (statusData) {
      // Handle different modes
      if (statusData.mode === "single") {
        setCurrentIteration(statusData.currentIteration);
      } else if (statusData.mode === "multiple") {
        setCurrentRun(statusData.currentRun);
      }

      // FIXED: Only update isRunning based on backend state appropriately
      // Don't let "idle" status during startup interfere
      if (statusData.running && !isRunning && !isStarting) {
        // Backend started, frontend didn't know yet (edge case)
        setIsRunning(true);
      } else if (!statusData.running && isRunning && !isStarting) {
        // Backend stopped (completed or error) - only stop if we're not starting
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

  // Update fitness from iteration history
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
  } else if (data?.status === "UP") {
    apiStatus = "connected";
  }

  function handleOnStartSimulation() {
    // Don't set isRunning here - let the mutation handle it
    if (runMode === "single") {
      switch (algorithmMode) {
        case "original":
          startSingleRun();
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
          toast.error("ORIGINAL FA NOT YET IMPLEMENTED [MULTIPLE MODE]");
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
    setIsStarting(false); // Also reset starting state
    setCurrentIteration(0);
    setCurrentRun(0);
    setNumRuns(30);
    setBestFitnessOriginal(null);
    setBestFitnessExtended(null);
  }

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <SimulationHeader
          apiStatus={apiStatus}
          isRunning={isRunning || isStarting} // Show running state during startup too
          currentIteration={currentIteration}
          totalGenerations={params.generations}
          algorithmMode={algorithmMode}
          runMode={runMode}
        />

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
                isRunning={isRunning || isStarting} // Disable during startup too
              />

              <RunModeSelector
                runMode={runMode}
                numRuns={numRuns}
                isRunning={isRunning || isStarting} // Disable during startup too
                onRunModeChange={setRunMode}
                onNumRunsChange={setNumRuns}
              />

              <div className="grid gap-6 lg:grid-cols-3">
                <ControlPanel
                  isRunning={isRunning || isStarting} // Disable button during both running and starting
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
              </div>
            </TabsContent>
            <TabsContent value="parameters" className="space-y-6">
              <div>Parameters</div>
            </TabsContent>
            <TabsContent value="results" className="space-y-6">
              <div>Results</div>
            </TabsContent>
          </TabsContents>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
