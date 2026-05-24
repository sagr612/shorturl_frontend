import { privateApi } from "./api";
import type { UserProfile, UserStats } from "../types/url";

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await privateApi.get("/api/v1/users/me");
    return response.data;
  },

  async getStats(): Promise<UserStats> {
    const response = await privateApi.get("/api/v1/users/me/stats");
    return response.data;
  },
};
