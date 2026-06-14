import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";
import { get } from "../api/client";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (user, token) => {
    await AsyncStorage.setItem("orbit_token", token);

    let mergedUser = user;
    try {
      const employeeResponse = await get(
        `/rest/v1/employees?select=*&user_id=eq.${encodeURIComponent(user.id)}`,
      );

      const employeeData = Array.isArray(employeeResponse)
        ? employeeResponse[0]
        : employeeResponse;
      if (employeeData) {
        mergedUser = { ...user, employee: employeeData };
      }
      console.log("🚀 ~ login ~ mergedUser:", mergedUser);
    } catch (error) {
      console.error("Failed to fetch employee data after login", error);
    }

    await AsyncStorage.setItem("orbit_user", JSON.stringify(mergedUser));
    set({ user: mergedUser, token, isAuthenticated: true });
  },
  logout: async () => {
    await AsyncStorage.removeItem("orbit_token");
    await AsyncStorage.removeItem("orbit_user");
    set({ user: null, token: null, isAuthenticated: false });
  },
  hydrateFromStorage: async () => {
    const token = await AsyncStorage.getItem("orbit_token");
    const userStr = await AsyncStorage.getItem("orbit_user");
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr), isAuthenticated: true });
      router.replace("/(tabs)/timesheet");
    }
  },
}));
