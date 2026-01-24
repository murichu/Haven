import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Hardcoded for now based on README
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optional: Redirect to login or handled by AuthContext
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
