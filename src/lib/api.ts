import store from "@/store";
import axios from "axios";

const api = axios.create({
  baseURL: "https://adimtech.com.ly/zajil/public/api",
  headers: {
    "X-APP-SOURCE": "system-dashboard",
  },
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${store.getState().token}`;
  return config;
});

export default api;
