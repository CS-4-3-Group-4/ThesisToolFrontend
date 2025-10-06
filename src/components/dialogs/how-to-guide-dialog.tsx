import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { BookOpen } from "lucide-react";


export function HowToGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" />
          How to Use
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] !max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5" />
            How to Use the Simulator
          </DialogTitle>
          <DialogDescription>
            Step-by-step guide to using the Firefly Algorithm Simulator
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="mb-3 text-lg font-semibold">
                1. Select Your Algorithm
              </h3>
              <p className="text-muted-foreground mb-2 text-sm">
                Navigate to the <strong>Simulation</strong> tab and choose
                between:
              </p>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>
                  <strong>Original FA:</strong> Standard Firefly Algorithm
                </li>
                <li>
                  <strong>Extended FA:</strong> Enhanced version with additional
                  parameters
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-lg font-semibold">2. Choose Run Mode</h3>
              <p className="text-muted-foreground mb-2 text-sm">
                Select how you want to run the simulation:
              </p>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>
                  <strong>Single Run:</strong> Execute once to see detailed
                  iteration progress and visualizations
                </li>
                <li>
                  <strong>Multiple Runs:</strong> Run the algorithm multiple
                  times (2-100) for statistical analysis
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-lg font-semibold">
                3. Configure Parameters
              </h3>
              <p className="text-muted-foreground mb-2 text-sm">
                Go to the <strong>Parameters</strong> tab to adjust:
              </p>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>
                  <strong>Generations:</strong> Number of iterations
                </li>
                <li>
                  <strong>Population Size:</strong> Number of fireflies
                </li>
                <li>
                  <strong>Alpha (α₀):</strong> Initial randomization parameter
                </li>
                <li>
                  <strong>Alpha Final:</strong> Final randomization parameter
                </li>
                <li>
                  <strong>Beta (β₀):</strong> Base attractiveness at r=0
                </li>
                <li>
                  <strong>Gamma (γ):</strong> Light absorption coefficient
                </li>
                <li>
                  <strong>Beta Min:</strong> (Extended FA only) Minimum
                  attractiveness floor
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-lg font-semibold">
                4. Start the Simulation
              </h3>
              <p className="text-muted-foreground mb-2 text-sm">
                Click the <strong>Start</strong> button in the Control Panel.
                You'll see:
              </p>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>Real-time progress updates</li>
                <li>Current iteration/run counter</li>
                <li>Best fitness score (for single runs)</li>
                <li>Live chart updates showing convergence</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-lg font-semibold">5. View Results</h3>
              <p className="text-muted-foreground mb-2 text-sm">
                After completion, go to the <strong>Results</strong> tab to see:
              </p>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>
                  <strong>Single Run:</strong> Fitness score, execution time,
                  memory usage, resource allocations, and flow details
                </li>
                <li>
                  <strong>Multiple Runs:</strong> Statistical analysis including
                  average, best, worst values, and individual run details
                </li>
                <li>Export options (CSV/JSON) for all data</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-3 text-lg font-semibold">
                6. Compare Algorithms
              </h3>
              <p className="text-muted-foreground mb-2 text-sm">
                Use the <strong>Compare</strong> tab to:
              </p>
              <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1 text-sm">
                <li>Upload exported result files from previous runs</li>
                <li>Compare FA vs EFA performance side-by-side</li>
                <li>View percentage improvements and visualizations</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
