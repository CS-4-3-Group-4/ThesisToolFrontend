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
  ValidationReportMultipleResponse,
  ObjectiveData,
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

async function getObjectivesEFA() {
  const response = await ax.get<ObjectiveData>("/efa/objectives");
  return response.data;
}

async function getValidationReportSingleEFA() {
  const response = await ax.get<ValidationReportSingleResponse>(
    "/efa/single/validation",
  );
  return response.data;
}

async function getValidationReportMultipleEFA() {
  const response = await ax.get<ValidationReportMultipleResponse>(
    "/efa/multiple/validation",
  );
  return response.data;
}

async function postStopEFA() {
  const response = await ax.post<StopResponse>("/efa/stop");
  return response.data;
}

async function postSingleRunEFA(params: SimulationParams) {
  const { scenario = 1, ...efaParams } = params;
  await ax.post(`/efa/single/run?scenario=${scenario}`, efaParams);
}

async function postMultipleRunEFA(params: SimulationParams) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { scenario: _, ...efaParams } = params;
  await ax.post("/efa/multiple/run", efaParams);
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

export const objectivesEFAQueryOptions = () =>
  queryOptions({
    queryKey: ["objectives", "efa"],
    queryFn: getObjectivesEFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const validationReportSingleEFAQueryOptions = () =>
  queryOptions({
    queryKey: ["validationReportSingle", "efa"],
    queryFn: getValidationReportSingleEFA,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const validationReportMultipleEFAQueryOptions = () =>
  queryOptions({
    queryKey: ["validationReportMultiple", "efa"],
    queryFn: getValidationReportMultipleEFA,
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
