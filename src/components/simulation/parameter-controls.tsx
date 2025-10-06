"use client";

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
import { RotateCcw } from "lucide-react";
import type { AlgorithmMode, SimulationParams } from "@/types";

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
  const showBetaMin = algorithmMode === "extended" || algorithmMode === "both";

  return (
    <div className="space-y-6">
      {onResetParams && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetParams}
            disabled={isRunning}
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
                <Label htmlFor="numFireflies">Number of Fireflies</Label>
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
                disabled={isRunning}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="generations">Generations</Label>
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
                disabled={isRunning}
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
                <Label htmlFor="gamma">Gamma (γ) - Light Absorption</Label>
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
                disabled={isRunning}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="beta0">Beta₀ - Base Attractiveness</Label>
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
                disabled={isRunning}
              />
            </div>

            {showBetaMin && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="betaMin">
                    Beta Min - Minimum Attractiveness
                  </Label>
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
                  disabled={isRunning}
                />
                <p className="text-muted-foreground text-xs">
                  Only used by Extended FA (EFA)
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="alpha0">Alpha₀ - Initial Randomness</Label>
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
                disabled={isRunning}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="alphaFinal">
                  Alpha Final - Final Randomness
                </Label>
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
                disabled={isRunning}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
