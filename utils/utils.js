import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const axios_ = axios.create({
  baseURL: "http://192.168.1.13:5050/api/",
});

// Add request interceptor to attach token
axios_.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
