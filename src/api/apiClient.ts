// src/api/apiClient.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import type { ApiErrorResponse } from "@/schemas";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const errorData = error.response?.data;

    // 1. Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/refresh") || originalRequest.url?.includes("/auth/login")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshRes = await api.post("/auth/refresh");
        const { accessToken } = refreshRes.data;

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // --- STATE SYNC SOLUTION ---
        delete api.defaults.headers.common["Authorization"];
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-logout"));
        }
        // ---------------------------

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 400 && errorData?.errorCode === "VALIDATION_ERROR") {
      const firstError = errorData.validationErrors
        ? Object.values(errorData.validationErrors).flat()[0]
        : errorData.message;

      toast.error(firstError || "Validation failed");
      return Promise.reject(errorData);
    }

    // 3. Global Toast for other errors
    if (error.response?.status !== 401) {
      toast.error(errorData?.message || "An unexpected error occurred");
    }

    return Promise.reject(errorData || { message: "Unknown error" });
  }
);

export default api;