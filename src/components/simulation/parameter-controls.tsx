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
import type { SimulationParams } from "@/types";

interface ParameterControlsProps {
  params: SimulationParams;
  isRunning: boolean;
  onParamChange: (key: keyof SimulationParams, value: number) => void;
}

export function ParameterControls({
  params,
  isRunning,
  onParamChange,
}: ParameterControlsProps) {
  return (
    <div className="space-y-6">
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
                max={200}
                step={10}
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
                min={50}
                max={1000}
                step={50}
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
                max={5.0}
                step={0.1}
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
                max={2.0}
                step={0.1}
                value={[params.beta0]}
                onValueChange={([value]) => onParamChange("beta0", value)}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="alpha0">Alpha₀ - Initial Randomness</Label>
                <span className="text-muted-foreground font-mono text-sm">
                  {params.alpha0.toFixed(2)}
                </span>
              </div>
              <Slider
                id="alpha0"
                min={0.1}
                max={1.0}
                step={0.05}
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
                max={0.5}
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
