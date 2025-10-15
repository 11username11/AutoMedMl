import axios, { AxiosError, AxiosResponse } from "axios";

export const baseURL = "http://localhost:8000"
//  http://backend:8000 - для докера
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
    const status = error?.response?.status;

    if (status >= 300 && status < 400 && !error.response?.data) {
      error.response.data = {
        detail: error.response.statusText,
      };
    }

    return Promise.reject(error);
  }
);

export default api;