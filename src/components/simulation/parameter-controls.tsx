import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCcw, HelpCircle } from "lucide-react";
import type { AlgorithmMode, SimulationParams } from "@/types";

// Toggle this to enable/disable parameter controls
const ENABLE_PARAMETER_TUNING = false;

interface ParameterControlsProps {
  params: SimulationParams;
  isRunning: boolean;
  algorithmMode: AlgorithmMode;
  onParamChange: (key: keyof SimulationParams, value: number) => void;
  onResetParams: () => void;
}

export function ParameterControls({
  params,
  isRunning,
  algorithmMode,
  onParamChange,
  onResetParams,
}: ParameterControlsProps) {
  const showBetaMin = algorithmMode === "extended";
  const isDisabled = isRunning || !ENABLE_PARAMETER_TUNING;

  const parameterInfo = {
    numFireflies: {
      description: "Size of the firefly population",
      effect:
        "Higher values explore the solution space more thoroughly but increase computation time. Lower values run faster but may miss optimal solutions.",
    },
    generations: {
      description: "Number of optimization iterations",
      effect:
        "More generations allow better convergence to optimal solutions but take longer. Fewer generations run faster but may not find the best solution.",
    },
    gamma: {
      description:
        "Light absorption coefficient - controls how fast attractiveness decreases with distance",
      effect:
        "Higher γ means faster decay (more local search, fireflies attract only nearby ones). Lower γ means slower decay (more global search, long-range attraction).",
    },
    beta0: {
      description:
        "Maximum attractiveness when fireflies are at the same location (r=0)",
      effect:
        "Higher values create stronger attraction forces between fireflies. Lower values make movements more conservative and exploration gentler.",
    },
    betaMin: {
      description:
        "Minimum attractiveness floor to prevent weak attraction at large distances (EFA only)",
      effect:
        "Higher values maintain exploration even between distant fireflies. Lower values allow attraction to decay more completely.",
    },
    alpha0: {
      description:
        "Initial randomization parameter for exploration at the start",
      effect:
        "Higher values add more randomness early on (broad exploration). Lower values make initial movements more deterministic.",
    },
    alphaFinal: {
      description: "Final randomization parameter for fine-tuning near the end",
      effect:
        "Higher values maintain exploration throughout. Lower values focus on exploitation and convergence in later iterations.",
    },
  };

  const ParameterLabel = ({
    htmlFor,
    text,
    info,
  }: {
    htmlFor: string;
    text: string;
    info: { description: string; effect: string };
  }) => (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor}>{text}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold">{info.description}</p>
              <p className="text-sm">{info.effect}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <div className="space-y-6">
      {!ENABLE_PARAMETER_TUNING && (
        <Card className="bg-muted/50">
          <CardContent className="pt-1">
            <p className="text-muted-foreground text-center text-sm">
              For all thesis experiments and evaluation runs, hyperparameter
              tuning has been disabled. The system now operates using a
              finalized and locked hyperparameter configuration to ensure
              consistency and reliability of the official results. Any
              remaining parameter adjustment controls are intended solely
              for demonstration or exploratory use and do not affect the
              formal evaluation outputs.
            </p>
          </CardContent>
        </Card>
      )}

      {onResetParams && ENABLE_PARAMETER_TUNING && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetParams}
            disabled={isDisabled}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Population Parameters</CardTitle>
            <CardDescription>
              Configure the firefly population and iterations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <ParameterLabel
                  htmlFor="numFireflies"
                  text="Number of Fireflies"
                  info={parameterInfo.numFireflies}
                />
                <span className="text-muted-foreground font-mono text-sm">
                  {params.numFireflies}
                </span>
              </div>
              <Slider
                id="numFireflies"
                min={10}
                max={150}
                step={5}
                value={[params.numFireflies]}
                onValueChange={([value]) =>
                  onParamChange("numFireflies", value)
                }
                disabled={isDisabled}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <ParameterLabel
                  htmlFor="generations"
                  text="Generations"
                  info={parameterInfo.generations}
                />
                <span className="text-muted-foreground font-mono text-sm">
                  {params.generations}
                </span>
              </div>
              <Slider
                id="generations"
                min={10}
                max={500}
                step={1}
                value={[params.generations]}
                onValueChange={([value]) => onParamChange("generations", value)}
                disabled={isDisabled}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Algorithm Parameters</CardTitle>
            <CardDescription>
              Fine-tune the Firefly Algorithm behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <ParameterLabel
                  htmlFor="gamma"
                  text="Gamma (γ) - Light Absorption"
                  info={parameterInfo.gamma}
                />
                <span className="text-muted-foreground font-mono text-sm">
                  {params.gamma.toFixed(2)}
                </span>
              </div>
              <Slider
                id="gamma"
                min={0.1}
                max={10.0}
                step={0.05}
                value={[params.gamma]}
                onValueChange={([value]) => onParamChange("gamma", value)}
                disabled={isDisabled}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <ParameterLabel
                  htmlFor="beta0"
                  text="Beta₀ - Base Attractiveness"
                  info={parameterInfo.beta0}
                />
                <span className="text-muted-foreground font-mono text-sm">
                  {params.beta0.toFixed(2)}
                </span>
              </div>
              <Slider
                id="beta0"
                min={0.1}
                max={10.0}
                step={0.05}
                value={[params.beta0]}
                onValueChange={([value]) => onParamChange("beta0", value)}
                disabled={isDisabled}
              />
            </div>

            {showBetaMin && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <ParameterLabel
                    htmlFor="betaMin"
                    text="Beta Min - Minimum Attractiveness"
                    info={parameterInfo.betaMin}
                  />
                  <span className="text-muted-foreground font-mono text-sm">
                    {(params.betaMin ?? 0.2).toFixed(2)}
                  </span>
                </div>
                <Slider
                  id="betaMin"
                  min={0.1}
                  max={0.5}
                  step={0.05}
                  value={[params.betaMin ?? 0.2]}
                  onValueChange={([value]) => onParamChange("betaMin", value)}
                  disabled={isDisabled}
                />
                <p className="text-muted-foreground text-xs">
                  Only used by Extended FA (EFA)
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <ParameterLabel
                  htmlFor="alpha0"
                  text="Alpha₀ - Initial Randomness"
                  info={parameterInfo.alpha0}
                />
                <span className="text-muted-foreground font-mono text-sm">
                  {params.alpha0.toFixed(2)}
                </span>
              </div>
              <Slider
                id="alpha0"
                min={0.01}
                max={1}
                step={0.01}
                value={[params.alpha0]}
                onValueChange={([value]) => onParamChange("alpha0", value)}
                disabled={isDisabled}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <ParameterLabel
                  htmlFor="alphaFinal"
                  text="Alpha Final - Final Randomness"
                  info={parameterInfo.alphaFinal}
                />
                <span className="text-muted-foreground font-mono text-sm">
                  {params.alphaFinal.toFixed(2)}
                </span>
              </div>
              <Slider
                id="alphaFinal"
                min={0.01}
                max={1}
                step={0.01}
                value={[params.alphaFinal]}
                onValueChange={([value]) => onParamChange("alphaFinal", value)}
                disabled={isDisabled}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
