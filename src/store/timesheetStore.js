import { create } from "zustand";
import { format } from "date-fns";

export const useTimesheetStore = create((set, get) => ({
  selectedDate: new Date(),
  loadingEntries: false,
  entries: [],
  setSelectedDate: (date) => {
    set({ selectedDate: date, loadingEntries: true });
    setTimeout(() => {
      set({ loadingEntries: false });
    }, 500);
  },
  addEntry: (entry) => set((state) => ({ entries: [...state.entries, entry] })),
  updateEntry: (updatedEntry) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry,
      ),
    })),
  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    })),
  setEntries: (entries) => set({ entries }),
  getTotalHoursForDate: (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayEntries = get().entries.filter((e) => e.date === dateStr);
    const totalMinutes = dayEntries.reduce(
      (sum, e) => sum + e.durationMinutes,
      0,
    );
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes, totalMinutes };
  },
}));
