import ax from "@/lib/axios";
import type {
  IterationsResponse,
  StatusResponse,
  StopResponse,
  SimulationParams,
  AllocationsResponse,
  FlowsResponse,
  ResultsResponse,
} from "@/types";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

async function getStatusEFA() {
  const response = await ax.get<StatusResponse>("/efa/status");
  return response.data;
}

async function getIterationsEFA() {
  const response = await ax.get<IterationsResponse>("/efa/iterations");
  return response.data;
}

async function getResultsEFA() {
  const response = await ax.get<ResultsResponse>("/efa/results");
  return response.data;
}

async function getAllocationsEFA() {
  const response = await ax.get<AllocationsResponse>("/efa/allocations");
  return response.data;
}

async function getFlowsEFA() {
  const response = await ax.get<FlowsResponse>("/efa/flows");
  return response.data;
}

async function postStopEFA() {
  const response = await ax.post<StopResponse>("/efa/stop");
  return response.data;
}

async function postSingleRunEFA(params: SimulationParams) {
  await ax.post("/efa/single/run", params);
}

async function postMultipleRunEFA(payload: {
  params: SimulationParams;
  numRuns: number;
}) {
  await ax.post(`/efa/multiple/run?runs=${payload.numRuns}`, payload.params);
}

export const iterationsEFAQueryOptions = () =>
  queryOptions({
    queryKey: ["iterations", "efa"],
    queryFn: getIterationsEFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const statusEFAQueryOptions = () =>
  queryOptions({
    queryKey: ["status", "efa"],
    queryFn: getStatusEFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const resultsEFAQueryOptions = () =>
  queryOptions({
    queryKey: ["results", "efa"],
    queryFn: getResultsEFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const allocationsEFAQueryOptions = () =>
  queryOptions({
    queryKey: ["allocations", "efa"],
    queryFn: getAllocationsEFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const flowsEFAQueryOptions = () =>
  queryOptions({
    queryKey: ["flows", "efa"],
    queryFn: getFlowsEFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const stopEFAMutationOptions = () =>
  mutationOptions({
    mutationFn: postStopEFA,
  });

export const startSingleRunEFAMutationOptions = () =>
  mutationOptions({
    mutationFn: postSingleRunEFA,
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.error || "Failed to start single run");
      }
    },
  });

export const startMultipleRunEFAMutationOptions = () =>
  mutationOptions({
    mutationFn: postMultipleRunEFA,
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(
          err.response?.data.error || "Failed to start multiple runs",
        );
      }
    },
  });
