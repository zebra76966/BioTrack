import axios from "axios";

const api = axios.create({
  baseURL: "https://api.forge.ngo",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
