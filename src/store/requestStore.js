import { create } from "zustand";
import {
  createQuickAction,
  deleteQuickAction,
  getQuickActionsByUser,
  quickActionExists,
  updateQuickAction,
} from "../services/firestoreService";

const prettyTypeLabel = (type) => {
  if (type === "running_late") return "Running Late";
  if (type === "wfh") return "Work From Home";
  if (type === "half_day") return "Half Day";
  return type;
};

export const useRequestStore = create((set, get) => ({
  requests: [],
  requestsLoading: false,
  requestsError: null,
  addRequest: async (request) => {
    if (!request.userId) {
      throw new Error("User must be logged in to create a quick action.");
    }

    set({ requestsLoading: true, requestsError: null });

    try {
      const exists = await quickActionExists(
        request.userId,
        request.date,
        request.type,
      );
      if (exists) {
        throw new Error(`You have already submitted a request for this date.`);
      }

      const saved = await createQuickAction({
        ...request,
        status: request.status || "pending",
        reason: request.details?.reason || request.reason || "",
      });

      set((state) => ({ requests: [saved, ...state.requests] }));
      return saved;
    } catch (error) {
      console.error("Failed to save quick action", error);
      set({ requestsError: error.message || "Failed to save quick action." });
      throw error;
    } finally {
      set({ requestsLoading: false });
    }
  },
  updateRequest: async (id, updates) => {
    set({ requestsLoading: true, requestsError: null });
    try {
      const updated = await updateQuickAction(id, {
        ...updates,
        reason: updates.details?.reason || updates.reason || "",
      });
      set((state) => ({
        requests: state.requests.map((request) =>
          request.id === id ? { ...request, ...updated } : request,
        ),
      }));
      return updated;
    } catch (error) {
      console.error("Failed to update quick action", error);
      set({ requestsError: error.message || "Failed to update quick action." });
      throw error;
    } finally {
      set({ requestsLoading: false });
    }
  },
  deleteRequest: async (id) => {
    set({ requestsLoading: true, requestsError: null });
    try {
      await deleteQuickAction(id);
      set((state) => ({
        requests: state.requests.filter((request) => request.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete quick action", error);
      set({ requestsError: error.message || "Failed to delete quick action." });
      throw error;
    } finally {
      set({ requestsLoading: false });
    }
  },
  loadRequests: async (userId) => {
    if (!userId) return;
    set({ requestsLoading: true, requestsError: null });
    try {
      const savedRequests = await getQuickActionsByUser(userId);
      set({ requests: savedRequests });
    } catch (error) {
      console.error("Failed to load quick actions", error);
      set({ requestsError: error.message || "Failed to load quick actions." });
    } finally {
      set({ requestsLoading: false });
    }
  },
  filterRequests: (type) => {
    const { requests } = get();
    if (type === "all") return requests;
    return requests.filter((r) => {
      if (type === "leave") return r.type === "leave";
      if (type === "wfh") return r.type === "wfh";
      if (type === "late") return r.type === "running_late";
      if (type === "half_day") return r.type === "half_day";
      return true;
    });
  },
}));
