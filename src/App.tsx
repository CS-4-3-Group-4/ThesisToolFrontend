import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./components/ThemeToggle";
import { useQuery } from "@tanstack/react-query";
import ax from "@/lib/axios";

function App() {
  const { data } = useQuery({
    queryKey: ["example"],
    queryFn: async () => {
      const response = await ax.get<{ message: string }>("/");
      return response.data;
    },
  });

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-4">
      <Button>Click me</Button>
      <ThemeToggle />

      <div>
        <h1>Placeholder</h1>
        <p>{data?.message}</p>
      </div>
    </div>
  );
}

export default App;
