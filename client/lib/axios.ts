import axios from "axios";

export const baseURL = "http://localhost:8000"

const api = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true,
});

export default api;