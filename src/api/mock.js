import { get, post } from "./client";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  login: async (username, password) => {
    const response = await post("/auth/v1/token?grant_type=password", {
      email: username,
      password,
    });

    return {
      user: response.user,
      token: response.access_token,
    };
  },
  getTimeEntries: async (
    date,
    employeeId = "cc4cbd74-2c21-4b6f-9a4d-57606afde175",
  ) => {
    const select =
      "*,project:projects(id,name,is_active,end_date,client:clients(id,name)),task:tasks(id,name)";
    const query = `select=${encodeURIComponent(select)}&employee_id=eq.${encodeURIComponent(
      employeeId,
    )}&entry_date=eq.${encodeURIComponent(date)}`;

    try {
      const response = await get(`/rest/v1/timesheet_entries?${query}`);

      if (response.length > 0) {
        return response.map((item) => ({
          id: item.id,
          date: item.entry_date,
          project: item.project?.name || "",
          task: item.task?.name || "",
          notes: item.description || "",
          durationMinutes: item.duration_minutes,
          startTime: "",
          endTime: "",
        }));
      }

      return [];
    } catch (error) {
      console.error("getTimeEntries failed", error);
      return [];
    }
    // if (date === "2026-06-08") {
    //   return [
    //     {
    //       id: "101",
    //       date: "2026-06-08",
    //       project: "CAST",
    //       task: "UI Development",
    //       notes: "Working on timesheet screens",
    //       durationMinutes: 150,
    //       startTime: "09:00 AM",
    //       endTime: "11:30 AM",
    //     },
    //     {
    //       id: "102",
    //       date: "2026-06-08",
    //       project: "CAST",
    //       task: "API Integration",
    //       notes: "Mock API setup",
    //       durationMinutes: 150,
    //       startTime: "01:00 PM",
    //       endTime: "03:30 PM",
    //     },
    //   ];
    // }

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
