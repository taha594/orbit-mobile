import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

const API_BASE_URL = "https://fvzbdiysdtnxhbrjciiq.supabase.co";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2emJkaXlzZHRueGhicmpjaWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwOTc3NTYsImV4cCI6MjA4NzY3Mzc1Nn0.0sgBxtwTnrg0xG5ppTFlyL62monQQ9nQouBkfulDf8I";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    apikey: API_KEY,
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("orbit_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const get = async (url, config) => {
  try {
    const response = await apiClient.get(url, config);
    return response.data;
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
};

export const post = async (url, data, config) => {
  try {
    console.log({ url, data, config });

    const response = await apiClient.post(url, data, config);
    return response.data;
  } catch (error) {
    console.log("STATUS", error.response?.status);
    console.log("DATA", error.response?.data);
    Toast.show({
      type: "error",
      text1: error.response?.data?.msg,
      position: "bottom",
    });
    throw error;
  }
};

export const put = async (url, data, config) => {
  try {
    const response = await apiClient.put(url, data, config);
    return response.data;
  } catch (error) {
    console.error("Error in PUT request:", error);
    throw error;
  }
};

export const del = async (url, config) => {
  try {
    const response = await apiClient.delete(url, config);
    return response.data;
  } catch (error) {
    console.error("Error in DELETE request:", error);
    throw error;
  }
};
