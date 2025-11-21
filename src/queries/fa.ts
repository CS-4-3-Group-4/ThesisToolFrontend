import ax from "@/lib/axios";
import type {
  IterationsResponse,
  StatusResponse,
  StopResponse,
  SimulationParams,
  AllocationsResponse,
  FlowsResponse,
  ResultsResponse,
  ValidationReportSingleResponse,
} from "@/types";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

async function getStatusFA() {
  const response = await ax.get<StatusResponse>("/fa/status");
  return response.data;
}

async function getIterationsFA() {
  const response = await ax.get<IterationsResponse>("/fa/iterations");
  return response.data;
}

async function getResultsFA() {
  const response = await ax.get<ResultsResponse>("/fa/results");
  return response.data;
}

async function getAllocationsFA() {
  const response = await ax.get<AllocationsResponse>("/fa/allocations");
  return response.data;
}

async function getFlowsFA() {
  const response = await ax.get<FlowsResponse>("/fa/flows");
  return response.data;
}

async function getValidationReportSingleFA() {
  const response =
    await ax.get<ValidationReportSingleResponse>("/fa/validation");
  return response.data;
}

async function postStopFA() {
  const response = await ax.post<StopResponse>("/fa/stop");
  return response.data;
}

async function postSingleRunFA(params: SimulationParams) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { betaMin: _, ...faParams } = params;
  await ax.post("/fa/single/run", faParams);
}

async function postMultipleRunFA(payload: {
  params: SimulationParams;
  numRuns: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { betaMin: _, ...faParams } = payload.params;
  await ax.post(`/fa/multiple/run?runs=${payload.numRuns}`, faParams);
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

export const resultsFAQueryOptions = () =>
  queryOptions({
    queryKey: ["results", "fa"],
    queryFn: getResultsFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const allocationsFAQueryOptions = () =>
  queryOptions({
    queryKey: ["allocations", "fa"],
    queryFn: getAllocationsFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const flowsFAQueryOptions = () =>
  queryOptions({
    queryKey: ["flows", "fa"],
    queryFn: getFlowsFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const validationReportSingleFAQueryOptions = () =>
  queryOptions({
    queryKey: ["validation-report-single", "fa"],
    queryFn: getValidationReportSingleFA,
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
      if (isAxiosError(err)) {
        toast.error(err.response?.data.error || "Failed to start single run");
      }
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
