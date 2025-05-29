import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // if you use cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for auth token, logging, etc.
axiosInstance.interceptors.response.use(
  res => res,
  err => {
    // handle error globally if needed
    return Promise.reject(err);
  }
);

export default axiosInstance;
