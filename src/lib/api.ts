import store from "@/store";
import axios from "axios";

const api = axios.create({
  baseURL: "https://adimtech.com.ly/zajil/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    language: "ar",
  },
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${store.getState().token}`;
  return config;
});

export default api;
