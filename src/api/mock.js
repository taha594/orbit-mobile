const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  login: async (username, password) => {
    await delay(800);
    return {
      user: {
        id: "1",
        name: "Muhammad Areeb",
        email: "areeb@example.com",
        department: "Development",
        employeeId: "EMP-1024",
      },
      token: "mock-jwt-token",
    };
  },
  getTimeEntries: async (date) => {
    await delay(800);
    // Returning some static data for the specific date 2026-06-08 as per prompt
    if (date === "2026-06-08") {
      return [
        {
          id: "101",
          date: "2026-06-08",
          project: "CAST",
          task: "UI Development",
          notes: "Working on timesheet screens",
          durationMinutes: 150,
          startTime: "09:00 AM",
          endTime: "11:30 AM",
        },
        {
          id: "102",
          date: "2026-06-08",
          project: "CAST",
          task: "API Integration",
          notes: "Mock API setup",
          durationMinutes: 150,
          startTime: "01:00 PM",
          endTime: "03:30 PM",
        },
      ];
    }
    return [];
  },
  addTimeEntry: async (entry) => {
    await delay(800);
    return { ...entry, id: Math.random().toString(36).substr(2, 9) };
  },
  submitTimesheet: async (date) => {
    await delay(800);
    return { success: true };
  },
  submitRequest: async (request) => {
    await delay(800);
    return {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
  },
  getRequests: async () => {
    await delay(800);
    return []; // Handled by store for now
  },
};
