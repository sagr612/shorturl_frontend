import type { ShortUrl } from "./url";

export interface AdminStats {
  totalUsers: number;

  totalUrls: number;

  publicUrls: number;

  privateUrls: number;

  totalClicks: number;
}

export interface AdminUser {
  id: string;

  name: string;

  email: string;

  role: string;

  createdAt: string;

  totalUrls: number;

  totalClicks: number;
}

export interface AdminUrlsResponse {
  data: ShortUrl[];

  pageNumber: number;

  totalPages: number;

  totalElements: number;

  isFirst: boolean;

  isLast: boolean;

  hasNext: boolean;

  hasPrevious: boolean;
}

export interface AdminUrlsParams {
  page?: number;

  size?: number;

  search?: string;

  isPrivate?: boolean;

  sortBy?: "createdAt" | "clickCount" | "expiresAt";

  direction?: "asc" | "desc";
}
