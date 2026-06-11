import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (user, token) => {
    await AsyncStorage.setItem("orbit_token", token);
    await AsyncStorage.setItem("orbit_user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
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
    }
  },
}));
