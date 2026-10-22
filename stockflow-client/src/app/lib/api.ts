
import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("stockflow_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
