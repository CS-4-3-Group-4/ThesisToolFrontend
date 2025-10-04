import ax from "@/lib/axios";
import type { IterationsResponse, StatusResponse, StopResponse } from "@/types";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

async function getStatusFA() {
  const response = await ax.get<StatusResponse>("/fa/status");
  return response.data;
}

async function postStopFA() {
  const response = await ax.post<StopResponse>("/fa/stop");
  return response.data;
}

async function postSingleRunFA() {
  await ax.post("/fa/single/run");
}

async function postMultipleRunFA(numRuns: number) {
  await ax.post(`/fa/multiple/run?runs=${numRuns}`);
}

async function getIterationsFA() {
  const response = await ax.get<IterationsResponse>("/fa/iterations");
  return response.data;
}

export const iterationsFAQueryOptions = () =>
  queryOptions({
    queryKey: ["iterations", "fa"],
    queryFn: getIterationsFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const statusFAQueryOptions = () =>
  queryOptions({
    queryKey: ["status", "fa"],
    queryFn: getStatusFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const stopFAMutationOptions = () =>
  mutationOptions({
    mutationFn: postStopFA,
  });

export const startSingleRunFAMutationOptions = () =>
  mutationOptions({
    mutationFn: postSingleRunFA,
    onError: (err) => {
      if (isAxiosError(err)) toast.error(err.response?.data.error);
    },
  });

export const startMultipleRunFAMutationOptions = () =>
  mutationOptions({
    mutationFn: postMultipleRunFA,
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(
          err.response?.data.error || "Failed to start multiple runs",
        );
      }
    },
  });
