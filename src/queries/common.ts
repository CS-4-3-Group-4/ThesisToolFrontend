import ax from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";

type HealthResponse = {
  status: "UP";
};

async function getHealthWithReset() {
  try {
    await ax.post("/fa/stop");
  } catch {
    console.log("Clear the backend state at startup");
  }
  const response = await ax.get<HealthResponse>("/health");
  return response.data;
}

export const healthQueryOptions = () =>
  queryOptions({
    queryKey: ["health"],
    queryFn: getHealthWithReset,
    retry: 1,
    refetchOnWindowFocus: false,
  });
