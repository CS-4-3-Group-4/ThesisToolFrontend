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

  const { data: counter } = useQuery({
    queryKey: ["counter"],
    queryFn: async () => {
      const response = await ax.get<{ value: number }>("/counter");
      return response.data.value;
    },
    refetchInterval: 100,
  });

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-4 font-sans">
      <Button>Click me</Button>
      <ThemeToggle />

      <div>
        <h1>Placeholder</h1>
        <p>{data?.message}</p>
      </div>

      <p>{counter}</p>
    </div>
  );
}

export default App;
