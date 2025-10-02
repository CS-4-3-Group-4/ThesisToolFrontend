import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-4">
      <Button>Click me</Button>
      <ThemeToggle />
    </div>
  );
}

export default App;
