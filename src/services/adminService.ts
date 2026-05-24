import { privateApi } from "./api";

import type {
  AdminStats,
  AdminUser,
  AdminUrlsResponse,
  AdminUrlsParams,
} from "../types/admin";

export const adminService = {
  async getAllUrls(params: AdminUrlsParams = {}): Promise<AdminUrlsResponse> {
    const response = await privateApi.get<AdminUrlsResponse>(
      "/api/v1/admin/urls",
      {
        params: {
          page: params.page ?? 1,

          size: params.size ?? 10,

          search: params.search || undefined,

          isPrivate:
            params.isPrivate !== undefined ? params.isPrivate : undefined,

          sortBy: params.sortBy ?? "createdAt",

          direction: params.direction ?? "desc",
        },
      },
    );

    return response.data;
  },

  async deleteUrls(ids: string[]): Promise<string> {
    const response = await privateApi.delete("/api/v1/admin/delete-urls", {
      params: {
        ids,
      },
    });

    return response.data;
  },

  async getUsers(): Promise<AdminUser[]> {
    const response = await privateApi.get<AdminUser[]>("/api/v1/admin/users");

    return response.data;
  },

  async getStats(): Promise<AdminStats> {
    const response = await privateApi.get<AdminStats>("/api/v1/admin/stats");

    return response.data;
  },
};
