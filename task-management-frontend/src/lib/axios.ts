import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }
};

api.interceptors.request.use((config) => {
  const token = accessToken || (typeof window !== "undefined" && localStorage.getItem("token"));
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post("/auth/refresh", {});

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken("");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default api;