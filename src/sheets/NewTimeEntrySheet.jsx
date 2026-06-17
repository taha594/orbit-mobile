import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ChevronDown, Clock } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { get, post } from "../api/client";
import { useAuthStore } from "../store/authStore";
import { Colors } from "../theme/colors";

const defaultProjectOptions = [
  { label: "Client Website", value: "Client Website" },
  { label: "Marketing Campaign", value: "Marketing Campaign" },
  { label: "Internal Tools", value: "Internal Tools" },
];

const taskOptions = [
  { label: "Design", value: "Design" },
  { label: "Development", value: "Development" },
  { label: "Testing", value: "Testing" },
];

const hoursSuggestions = [
  "0:30",
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
];

function DropdownModal({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}) {
  if (!visible) return null;

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownTitle}>{title}</Text>
      <ScrollView
        style={styles.dropdownList}
        contentContainerStyle={styles.dropdownContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        {options.map((item) => {
          const selected = item.value === selectedValue;
          return (
            <Pressable
              key={item.value}
              style={[
                styles.dropdownOption,
                selected && styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                onSelect(item.value);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.dropdownOptionText,
                  selected && styles.dropdownOptionTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function NewTimeEntrySheet({
  bottomSheetRef,
  onSave,
  initialValues,
  projectOptions = [],
  entryDate,
}) {
  const snapPoints = useMemo(() => ["33%"], []);

  const [projectId, setProjectId] = useState("");
  const [project, setProject] = useState("");
  const [task, setTask] = useState("");
  const [taskId, setTaskId] = useState("");
  const [notes, setNotes] = useState("");
  const [hours, setHours] = useState("1:00");
  const [projectTaskOptions, setProjectTaskOptions] = useState([]);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  const formatDuration = (minutes) => {
    const hoursValue = Math.floor(minutes / 60);
    const minutesValue = minutes % 60;
    return `${hoursValue}:${minutesValue.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (initialValues) {
      const selectedProject = projectOptions.find(
        (option) =>
          option.label === initialValues.project ||
          option.value === initialValues.project,
      );
      setProjectId(selectedProject?.value || "");
      setProject(initialValues.project || selectedProject?.label || "");
      setTask(initialValues.task || "");
      setTaskId(initialValues.taskId || "");
      setNotes(initialValues.notes || "");
      setHours(
        initialValues.hours ||
          formatDuration(initialValues.durationMinutes || 0),
      );
    } else {
      setProjectId("");
      setProject("");
      setTask("");
      setTaskId("");
      setNotes("");
      setHours("1:00");
      setProjectTaskOptions([]);
    }
  }, [initialValues, projectOptions]);

  useEffect(() => {
    const loadProjectTasks = async () => {
      if (!projectId) {
        setProjectTaskOptions([]);
        return;
      }

      try {
        const response = await get(
          `/rest/v1/project_tasks?select=is_billable,task:tasks(id,name,project_id,is_active)&project_id=eq.${projectId}&is_active=eq.true`,
        );

        setProjectTaskOptions(
          response
            .filter((item) => item.task?.id)
            .map((item) => ({
              label: item.task.name,
              value: item.task.id,
              isBillable: item.is_billable,
            })),
        );
      } catch (error) {
        console.error("Failed to load project tasks", error);
        setProjectTaskOptions([]);
      }
    };

    loadProjectTasks();
  }, [projectId]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsAt={-1}
        appearsAt={0.5}
        opacity={0.5}
      />
    ),
    [],
  );

  const isEditing = Boolean(initialValues);
  const user = useAuthStore((state) => state.user);

  const handleSave = async () => {
    const employeeId = user?.employee?.id;
    console.log("🚀 ~ handleSave ~ user:", JSON.stringify(user));
    const organizationId = user?.employee?.organization_id;
    const durationMinutes = Number(
      hours
        .split(":")
        .reduce(
          (acc, segment, index) =>
            index === 0 ? Number(segment) * 60 : acc + Number(segment),
          0,
        ),
    );

    if (!employeeId || !projectId || !taskId || !entryDate || !organizationId) {
      Alert.alert(
        "Cannot save entry",
        "Missing required employee, project, task, date, or organization values.",
      );
      return;
    }

    setRequestLoading(true);

    try {
      const payload = {
        employee_id: employeeId,
        project_id: projectId,
        task_id: taskId,
        entry_date: entryDate,
        duration_minutes: durationMinutes,
        description: notes || null,
        status: "draft",
        organization_id: organizationId,
      };

      const response = await post(
        "/rest/v1/timesheet_entries?select=id",
        payload,
      );

      const returnedId = Array.isArray(response)
        ? response[0]?.id
        : response?.id;
      const savedId = initialValues?.id || returnedId;

      onSave({
        id: savedId,
        project,
        projectId,
        task,
        taskId,
        notes,
        hours,
        durationMinutes,
      });
      setRequestLoading(false);

      bottomSheetRef.current?.close();
    } catch (error) {
      console.error("Failed to save time entry", error);
      Alert.alert(
        "Save failed",
        error?.message || "Unable to save the time entry.",
      );
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={[styles.container, styles.bottomSheetView]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.title}>
            {isEditing ? "Edit Time Entry" : "New Time Entry"}
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Project</Text>
            <View
              style={[
                styles.dropdownWrapper,
                showProjectPicker && styles.dropdownWrapperOpen,
              ]}
            >
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => {
                  setShowTaskPicker(false);
                  setShowProjectPicker((prev) => !prev);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.inputText,
                    !project && { color: Colors.textMuted },
                  ]}
                >
                  {project || "Select project"}
                </Text>
                <ChevronDown size={18} color={Colors.textMuted} />
              </TouchableOpacity>
              <DropdownModal
                visible={showProjectPicker}
                onClose={() => setShowProjectPicker(false)}
                title="Select Project"
                options={
                  projectOptions.length > 0
                    ? projectOptions
                    : defaultProjectOptions
                }
                selectedValue={projectId || project}
                onSelect={(value) => {
                  const selectedProject =
                    projectOptions.find((option) => option.value === value) ||
                    defaultProjectOptions.find(
                      (option) => option.value === value,
                    );
                  setProjectId(value);
                  setProject(selectedProject?.label || value);
                  setTask("");
                  setTaskId("");
                }}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Task</Text>
            <View
              style={[
                styles.dropdownWrapper,
                showTaskPicker && styles.dropdownWrapperOpen,
              ]}
            >
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => {
                  setShowProjectPicker(false);
                  setShowTaskPicker((prev) => !prev);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.inputText,
                    !task && { color: Colors.textMuted },
                  ]}
                >
                  {task || "Select task"}
                </Text>
                <ChevronDown size={18} color={Colors.textMuted} />
              </TouchableOpacity>
              <DropdownModal
                visible={showTaskPicker}
                onClose={() => setShowTaskPicker(false)}
                title="Select Task"
                options={
                  projectTaskOptions.length > 0
                    ? projectTaskOptions
                    : taskOptions
                }
                selectedValue={taskId || task}
                onSelect={(value) => {
                  const selectedTask =
                    projectTaskOptions.find(
                      (option) => option.value === value,
                    ) || taskOptions.find((option) => option.value === value);
                  setTaskId(value);
                  setTask(selectedTask?.label || value);
                }}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Hours</Text>
            <View style={styles.inputContainerWide}>
              <Clock
                size={20}
                color={Colors.textMuted}
                style={{ marginRight: 8 }}
              />
              <BottomSheetTextInput
                style={styles.hoursInput}
                value={hours}
                onChangeText={setHours}
                placeholder="1:30"
                placeholderTextColor={Colors.textMuted}
                keyboardType={
                  Platform.OS === "ios"
                    ? "numbers-and-punctuation"
                    : "visible-password"
                }
              />
            </View>
            <View style={styles.suggestionRow}>
              {hoursSuggestions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.suggestionChip}
                  onPress={() => setHours(option)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suggestionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Notes</Text>
            <BottomSheetTextInput
              style={[styles.inputContainer, styles.multiline]}
              placeholder="What did you work on?"
              placeholderTextColor={Colors.textMuted}
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <TouchableOpacity
            disabled={requestLoading}
            style={[styles.submitBtn, { opacity: requestLoading ? 0.8 : 1 }]}
            onPress={handleSave}
          >
            <Text style={styles.submitText}>
              {isEditing ? "Update Entry" : "Save Entry"}
            </Text>
            {requestLoading && <ActivityIndicator color={"#fff"} />}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    overflow: "visible",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
    overflow: "visible",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  inputContainer: {
    height: 48,
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  bottomSheetView: {
    overflow: "visible",
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 999,
    overflow: "visible",
  },
  inputContainerWide: {
    minHeight: 48,
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  inputText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  hoursInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 48,
  },
  suggestionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  suggestionChip: {
    backgroundColor: Colors.inputBg,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  dropdownWrapperOpen: {
    zIndex: 1100,
  },
  dropdownContainer: {
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceWhite,
    borderRadius: 16,
    padding: 12,
    maxHeight: 360,
    borderWidth: 1,
    borderColor: Colors.inputBorder || "#E5E7EB",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  dropdownList: {
    maxHeight: 200,
  },
  dropdownContent: {
    paddingBottom: 0,
  },
  dropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.inputBg,
    marginBottom: 8,
  },
  dropdownOptionSelected: {
    backgroundColor: Colors.primaryBlue,
  },
  dropdownOptionText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  dropdownOptionTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  multiline: {
    height: 80,
    alignItems: "flex-start",
    paddingTop: 12,
  },
  submitBtn: {
    height: 50,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
  },
  submitText: {
    marginRight: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
