import type {
  AllocationsResponse,
  FlowsResponse,
  MultipleRunAllocationsResponse,
  MultipleRunFlowsResponse,
} from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type guard for flows
export function isMultipleRunFlows(
  response: FlowsResponse,
): response is MultipleRunFlowsResponse {
  return (
    Array.isArray(response.flows) &&
    response.flows.length > 0 &&
    Array.isArray(response.flows[0])
  );
}

// Type guard for allocations
export function isMultipleRunAllocations(
  response: AllocationsResponse,
): response is MultipleRunAllocationsResponse {
  return (
    Array.isArray(response.allocations) &&
    response.allocations.length > 0 &&
    Array.isArray(response.allocations[0])
  );
}
