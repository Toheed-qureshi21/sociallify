import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:'http://localhost:3000/api',
  withCredentials: true, // if you use cookies
 
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
