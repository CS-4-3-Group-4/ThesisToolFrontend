import { Badge } from "@/components/ui/badge";
import { Zap, Database, Clock } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

interface SimulationHeaderProps {
  apiStatus: "connected" | "disconnected" | "checking";
}

// Main component
export function SimulationHeader({ apiStatus }: SimulationHeaderProps) {
  return (
    <div className="from-background via-background to-muted/20 relative overflow-hidden rounded-xl border bg-gradient-to-br p-8">
      <div className="from-primary/5 absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l to-transparent" />

      <div className="relative flex items-start justify-between gap-6">
        <div className="flex-1 space-y-4">
          <HeaderTitle />
          <HeaderDescription />
          <HeaderBadges apiStatus={apiStatus} />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

// Sub-component: Header Title Section
function HeaderTitle() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
        <Zap className="text-primary h-6 w-6" />
      </div>
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-balance">
          Firefly Algorithm Simulator
        </h1>
        <p className="text-muted-foreground text-sm text-pretty">
          Advanced optimization algorithm comparison platform
        </p>
      </div>
    </div>
  );
}

// Sub-component: Description Text
function HeaderDescription() {
  return (
    <p className="text-muted-foreground max-w-2xl text-pretty">
      Compare and analyze the performance of Original and Extended Firefly
      Algorithms with real-time visualization, parameter tuning, and
      comprehensive metrics tracking.
    </p>
  );
}

// Sub-component: Status Badges
function HeaderBadges({
  apiStatus,
}: {
  apiStatus: SimulationHeaderProps["apiStatus"];
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="outline" className="gap-1.5">
        <Database className="h-3 w-3" />
        Backend: Java + Javalin
      </Badge>
      <Badge variant="outline" className="gap-1.5">
        <Clock className="h-3 w-3" />
        Real-time Analysis
      </Badge>
      <Badge
        variant={apiStatus === "connected" ? "default" : "destructive"}
        className="gap-1.5"
      >
        <div
          className={`h-2 w-2 rounded-full ${apiStatus === "connected" ? "animate-pulse bg-green-500" : "bg-red-600"}`}
        />
        {apiStatus === "connected" ? "API Connected" : "API Disconnected"}
      </Badge>
    </div>
  );
}
