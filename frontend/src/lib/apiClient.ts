import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      'Lỗi kết nối máy chủ';
    return Promise.reject(new Error(message));
  }
);
