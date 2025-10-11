import axios, { AxiosError, AxiosResponse } from "axios";

export const baseURL = "http://localhost:8000"

export type ApiResponse = AxiosResponse<{ message: string }>
export type ApiError = AxiosError<{ detail: string }>

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