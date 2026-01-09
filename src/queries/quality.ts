import ax from "@/lib/axios";
import type { QualityComparison } from "@/types";
import { queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";

async function getQualityComparison() {
  try {
    const response = await ax.get<QualityComparison>("/quality/comparison");
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}

export const qualityComparisonQueryOptions = () =>
  queryOptions({
    queryKey: ["quality", "comparison"],
    queryFn: getQualityComparison,
    retry: 0, // Don't retry on 400 errors
    refetchOnWindowFocus: false,
  });
