import { create } from "zustand";

export const useRequestStore = create((set, get) => ({
  requests: [],
  addRequest: (request) =>
    set((state) => ({ requests: [request, ...state.requests] })),
  filterRequests: (type) => {
    const { requests } = get();
    console.log("Filtering requests with type:", requests);
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
