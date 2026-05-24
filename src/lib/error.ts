import type { ApiErrorResponse } from "../types/url";

export function getErrorMessage(error: any): string {
  const apiError = error?.response?.data as ApiErrorResponse;

  return apiError?.message || error?.message || "Something went wrong";
}
