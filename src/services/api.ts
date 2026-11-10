import axios from "axios";

export const URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const publicApi = axios.create({
  baseURL: URL,
  withCredentials: true
});

export const privateApi = axios.create({
  baseURL: URL,
  withCredentials: true
});

let refreshPromise: Promise<string> | null = null;
function getRefreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = publicApi
      .post("/api/v1/auth/refreshToken")
      .then((res) => {
        const { accessToken } = res.data;
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("token");
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const accessToken = await getRefreshAccessToken();
        if (!accessToken) {
          throw new Error("No access token returned from refresh endpoint");
        }
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return privateApi(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
