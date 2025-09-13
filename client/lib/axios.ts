import axios from "axios";

export const baseURL = "http://localhost:8000"

const api = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;