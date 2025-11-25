import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const axios_ = axios.create({
  baseURL: 'http://192.168.1.50:5050/api/',
});

// Add request interceptor to attach token
axios_.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // If no token, remove Authorization header
        delete config.headers.Authorization;
      }
    } catch (error) {
      console.error('Error getting token in interceptor:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors globally
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axios_.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios_(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to get the current token
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
          // No token available, clear everything and reject
          await AsyncStorage.multiRemove(['token', 'role', 'user']);
          delete axios_.defaults.headers.common.Authorization;
          processQueue(error, null);
          isRefreshing = false;
          return Promise.reject(error);
        }

        // Verify token is still valid by checking with backend
        try {
          const verifyResponse = await axios_.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (verifyResponse.data?.user) {
            // Token is valid, retry original request
            originalRequest.headers.Authorization = `Bearer ${token}`;
            processQueue(null, token);
            isRefreshing = false;
            return axios_(originalRequest);
          }
        } catch (verifyError) {
          // Token is invalid or expired
          console.log('Token verification failed, logging out...');
        }

        // Token is invalid, clear storage
        await AsyncStorage.multiRemove(['token', 'role', 'user']);
        delete axios_.defaults.headers.common.Authorization;
        processQueue(error, null);
        isRefreshing = false;
        
        // Return the original error so components can handle it
        return Promise.reject(error);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);
