import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Kết nối máy chủ bị quá thời gian (Timeout). Vui lòng thử lại.' : null) ||
      error.message ||
      'Lỗi kết nối máy chủ. Vui lòng thử lại sau.';
    return Promise.reject(new Error(message));
  }
);
