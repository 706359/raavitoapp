import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const axios_ = axios.create({
  baseURL: 'http://192.168.1.50:5050/api/',
});

// Add request interceptor to attach token
axios_.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
