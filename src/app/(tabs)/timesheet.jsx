import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Menu, Plus } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { get } from "../../api/client";
import { mockApi } from "../../api/mock";
import CircularProgress from "../../components/CircularProgress";
import DateNavigator from "../../components/DateNavigator";
import FABMenu from "../../components/FABMenu";
import TimeEntryCard from "../../components/TimeEntryCard";
import HalfDaySheet from "../../sheets/HalfDaySheet";
import LeaveApplicationSheet from "../../sheets/LeaveApplicationSheet";
import NewTimeEntrySheet from "../../sheets/NewTimeEntrySheet";
import RunningLateSheet from "../../sheets/RunningLateSheet";
import WorkFromHomeSheet from "../../sheets/WorkFromHomeSheet";
import { useAuthStore } from "../../store/authStore";
import { useRequestStore } from "../../store/requestStore";
import { useTimesheetStore } from "../../store/timesheetStore";
import { Colors } from "../../theme/colors";

function convertTimeStringToMinutes(timeString) {
  if (!timeString || typeof timeString !== "string") {
    return 0;
  }

  const normalized = timeString
    .trim()
    .toLowerCase()
    .replace(/[^0-9:]/g, "");
  if (!normalized) {
    return 0;
  }

  if (normalized.includes(":")) {
    const [hoursPart, minutesPart] = normalized.split(":");
    const hours = parseInt(hoursPart, 10);
    const minutes = parseInt(minutesPart, 10);
    return (
      (Number.isNaN(hours) ? 0 : hours * 60) +
      (Number.isNaN(minutes) ? 0 : minutes)
    );
  }

  const parsed = parseInt(normalized, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function TimesheetScreen() {
  const insets = useSafeAreaInsets();
  const {
    loadingEntries,
    selectedDate,
    setSelectedDate,
    entries,
    setEntries,
    getTotalHoursForDate,
    addEntry,
    updateEntry,
    deleteEntry,
  } = useTimesheetStore();
  const addRequest = useRequestStore((state) => state.addRequest);
  const user = useAuthStore((state) => state.user);

  const [fabOpen, setFabOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState(null);
  const [editEntry, setEditEntry] = useState(null);

  const runningLateRef = useRef(null);
  const wfhRef = useRef(null);
  const leaveRef = useRef(null);
  const halfDayRef = useRef(null);
  const newEntryRef = useRef(null);

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const [projectOptions, setProjectOptions] = useState([]);

  const employeeId = user?.employee?.id;
  const { data: fetchedEntries, isLoading } = useQuery({
    queryKey: ["entries", dateKey, employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      return mockApi.getTimeEntries(dateKey, employeeId);
    },
    enabled: !!employeeId,
  });

  useEffect(() => {
    if (fetchedEntries) {
      setEntries(fetchedEntries);
    }
  }, [fetchedEntries]);

  const loadAssignedProjects = async (employeeId) => {
    if (!employeeId) {
      setProjectOptions([]);
      return;
    }

    try {
      const assignmentResponse = await get(
        `/rest/v1/project_team_members?select=project_id&employee_id=eq.${encodeURIComponent(
          employeeId,
        )}&is_assigned=eq.true`,
      );
      const projectIds = [
        ...new Set(
          assignmentResponse.map((item) => item.project_id).filter(Boolean),
        ),
      ];

      if (projectIds.length === 0) {
        setProjectOptions([]);
        return;
      }

      const projectsResponse = await get(
        `/rest/v1/projects?select=*,client:clients(id,name,status)&is_active=eq.true&id=in.(${projectIds.join(",")})&order=name.asc`,
      );

      setProjectOptions(
        projectsResponse.map((project) => ({
          label: project.name,
          value: project.id,
        })),
      );
    } catch (error) {
      console.error("Failed to load assigned projects", error);
      setProjectOptions([]);
    }
  };

  useEffect(() => {
    loadAssignedProjects(user?.employee?.id);
  }, [user?.employee?.id]);

  const stats = useMemo(
    () => getTotalHoursForDate(selectedDate),
    [JSON.stringify(entries), selectedDate, getTotalHoursForDate],
  );
  const targetMinutes = 8 * 60;
  const progressPercent = Math.min(
    (stats.totalMinutes / targetMinutes) * 100,
    100,
  );

  const handleAction = (id) => {
    setFabOpen(false);
    if (id === "late") runningLateRef.current?.expand();
    if (id === "wfh") wfhRef.current?.expand();
    if (id === "leave") leaveRef.current?.expand();
    if (id === "half_day") halfDayRef.current?.expand();
  };

  const handleEditEntry = (entry) => {
    Toast.show({
      type: "info",
      text1: "Edit feature coming soon!",
      text2: "This feature is under development. Stay tuned for updates!",
      position: "bottom",
    });
    return;
    setEditEntry(entry);
    newEntryRef.current?.expand();
  };

  const handleDeleteEntry = (entry) => {
    Toast.show({
      type: "info",
      text1: "Delete feature coming soon!",
      text2: "This feature is under development. Stay tuned for updates!",
      position: "bottom",
    });
    return;

    return;
    Alert.alert(
      "Delete time entry",
      "Are you sure you want to delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteEntry(entry.id),
        },
      ],
    );
  };

  const handleRequestSubmit = async (type, data) => {
    const newRequest = {
      id: Math.random().toString(),
      type,
      userId: user?.id || null,
      date: dateKey,
      submittedAt: new Date().toISOString(),
      status: "pending",
      details: data,
    };

    try {
      await addRequest(newRequest);
      Toast.show({
        type: "success",
        text1: "Request submitted successfully",
        text2: `Your ${type.replace("_", " ")} request has been submitted.`,
        position: "bottom",
      });
    } catch (error) {
      Toast.show({
        type: "info",
        text1: "Oops! ",
        text2: error.message || "Failed to submit request.",
        position: "bottom",
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Menu color={Colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Timesheet</Text>
        <TouchableOpacity>
          <CalendarIcon color={Colors.textPrimary} size={24} />
        </TouchableOpacity>
      </View>

      <DateNavigator
        date={selectedDate}
        onDateChange={setSelectedDate}
        onOpenPicker={() => {}}
      />

      {loadingEntries ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator style={{ marginTop: 20 }} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>Total Logged</Text>
              <Text style={styles.summaryValue}>
                {stats.hours}h {stats.minutes}m
              </Text>
              <Text style={styles.summarySubtext}>Daily Target: 8h 00m</Text>
            </View>
            <CircularProgress percentage={progressPercent} />
          </View>

          {/* Time Entries Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Time Entries</Text>
            <TouchableOpacity
              style={styles.newEntryBtn}
              onPress={() => {
                setEditEntry(null);
                newEntryRef.current?.expand();
              }}
            >
              <Plus
                size={16}
                color={Colors.primaryBlue}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.newEntryText}>New Entry</Text>
            </TouchableOpacity>
          </View>

          {/* Entries List */}
          {entries.map((entry) => (
            <TimeEntryCard
              key={entry.id}
              entry={entry}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          ))}

          {entries.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No entries for this day</Text>
            </View>
          )}

          {/* {entries.length > 0 && (
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit Timesheet</Text>
            </TouchableOpacity>
          )} */}

          {/* Spacer for FAB */}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      <FABMenu
        isOpen={fabOpen}
        onToggle={() => setFabOpen(!fabOpen)}
        onAction={handleAction}
      />

      <RunningLateSheet
        bottomSheetRef={runningLateRef}
        onSubmit={(data) => handleRequestSubmit("running_late", data)}
      />
      <WorkFromHomeSheet
        bottomSheetRef={wfhRef}
        onSubmit={(data) => handleRequestSubmit("wfh", data)}
      />
      <LeaveApplicationSheet
        bottomSheetRef={leaveRef}
        onSubmit={(data) => handleRequestSubmit("leave", data)}
      />
      <HalfDaySheet
        bottomSheetRef={halfDayRef}
        onSubmit={(data) => handleRequestSubmit("half_day", data)}
      />
      <NewTimeEntrySheet
        bottomSheetRef={newEntryRef}
        initialValues={editEntry}
        projectOptions={projectOptions}
        entryDate={dateKey}
        onSave={(data) => {
          const updatedEntry = {
            id: data.id || Math.random().toString(),
            date: dateKey,
            project: data.project || "Internal",
            task: data.task || "General",
            notes: data.notes,
            durationMinutes: convertTimeStringToMinutes(data.hours),
          };

          if (data.id) {
            updateEntry(updatedEntry);
          } else {
            addEntry(updatedEntry);
          }
          setEditEntry(null);
          newEntryRef.current?.close();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.primaryBlue,
    marginVertical: 4,
  },
  summarySubtext: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  newEntryBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 32,
  },
  newEntryText: {
    fontSize: 12,
    color: Colors.primaryBlue,
    fontWeight: "500",
  },
  submitBtn: {
    height: 50,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  submitBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
