import type { MyUrlsParams, ShortUrl, ShortUrlResponse } from "../types/url";
import { privateApi } from "./api";

export const shortUrlService = {
  async getPublicUrls(params?: {
    page?: number;
    search?: string;
    sortBy?: string;
    direction?: string;
  }): Promise<ShortUrlResponse> {
    const response = await privateApi.get<ShortUrlResponse>(
      "/api/v1/shorten/",
      {
        params,
      },
    );

    return response.data;
  },

  async createShortUrl(payload: {
    originalUrl: string;
    isPrivate?: boolean;
    expirationInDays?: number;
  }): Promise<ShortUrl> {
    try {
      const response = await privateApi.post<ShortUrl>(
        "/api/v1/shorten/",
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating short URL:", error);
      throw error;
    }
  },

  async deleteUrls(ids: string[]): Promise<string> {
    try {
      const response = await privateApi.delete<string>(
        "/api/v1/shorten/delete-urls",
        {
          params: { ids },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting URLs:", error);
      throw error;
    }
  },

  async getAllUrlsAdmin(page = 1): Promise<ShortUrlResponse> {
    try {
      const response = await privateApi.get<ShortUrlResponse>(
        `/api/v1/admin/urls?page=${page}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all URLs (admin):", error);
      throw error;
    }
  },

  async updateUrl(id: string, originalUrl: string) {
    try {
      const response = await privateApi.put(`/api/v1/shorten/${id}`, {
        originalUrl,
      });

      return response.data;
    } catch (error) {
      console.error("Error updating URL:", error);
      throw error;
    }
  },

  async getMyUrls(params: MyUrlsParams = {}): Promise<ShortUrlResponse> {
    const response = await privateApi.get<ShortUrlResponse>(
      "/api/v1/shorten/my-urls",
      {
        params: {
          page: params.page ?? 1,
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
};
