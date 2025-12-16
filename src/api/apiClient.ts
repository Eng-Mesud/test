// src/api/apiClient.ts
import axios, { AxiosError } from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];
const BaseUrl = "http://192.168.187.32:5037/api";
const api = axios.create({
    baseURL: BaseUrl,
    withCredentials: true, // enable cookies
});

function processQueue(error: any, token: string | null = null) {
    failedQueue.forEach((p) => {
        error ? p.reject(error) : p.resolve(token);
    });
    failedQueue = [];
}

api.interceptors.response.use(
    (res: any) => res,
    async (error: AxiosError) => {
        const original = error.config as any;

        // Skip if the request is for the refresh token itself or login, to avoid circular loops
        if (original.url?.includes("/auth/refresh") || original.url?.includes("/auth/login")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        original.headers["Authorization"] = `Bearer ${token}`;
                        return api(original);
                    })
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;
            try {
                const refreshRes = await api.post("/auth/refresh");

                const newAccessToken = refreshRes.data.accessToken;
                api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return api(original);
            } catch (err) {
                processQueue(err, null);
                // If refresh fails, we should probably clear the sticky token header too
                delete api.defaults.headers.common["Authorization"];
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(
            error.response?.data ?? { message: "Unknown error" }
        );
    }
);

export default api;
