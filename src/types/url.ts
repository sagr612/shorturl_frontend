export interface ShortenResponse {
  shortUrl: string;
}

export interface ApiError {
  message: string;
}

export interface AuthResponse {
  accessToken: string;
  token: string;
}

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  role: string;
  userId: string;
}

export type UserDto = {
  id: string;
  name: string;
};

export type ShortUrl = {
  id: string;
  shortKey: string;
  originalUrl: string;
  isPrivate: boolean;
  expiresAt: string;
  createdBy: UserDto;
  clickCount: number;
  createdAt: string;
  status: "ACTIVE" | "EXPIRED" | "DELETED";
};

export type ShortUrlResponse = {
  data: ShortUrl[];
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

export interface MyUrlsParams {
  page?: number;
  search?: string;
  isPrivate?: boolean;
  status?: "ACTIVE" | "EXPIRED" | "DELETED";
  sortBy?: "createdAt" | "clickCount" | "expiresAt";
  direction?: "asc" | "desc";
}

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export type UserStats = {
  totalUrls: number;
  publicUrls: number;
  privateUrls: number;
  totalClicks: number;
};

export type ApiErrorResponse = {
  timestamp: string;

  statusCode: number;

  message: string;

  error: string;

  validationErrors?: string[] | null;
};
