import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ChevronDown, Clock } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../theme/colors";

const projectOptions = [
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
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const selected = item.value === selectedValue;
              return (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    selected && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

export default function NewTimeEntrySheet({
  bottomSheetRef,
  onSave,
  initialValues,
}) {
  const snapPoints = useMemo(() => ["65%"], []);

  const [project, setProject] = useState("");
  const [task, setTask] = useState("");
  const [notes, setNotes] = useState("");
  const [hours, setHours] = useState("1:00");
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [showTaskPicker, setShowTaskPicker] = useState(false);

  const formatDuration = (minutes) => {
    const hoursValue = Math.floor(minutes / 60);
    const minutesValue = minutes % 60;
    return `${hoursValue}:${minutesValue.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (initialValues) {
      setProject(initialValues.project || "");
      setTask(initialValues.task || "");
      setNotes(initialValues.notes || "");
      setHours(
        initialValues.hours ||
          formatDuration(initialValues.durationMinutes || 0),
      );
    } else {
      setProject("");
      setTask("");
      setNotes("");
      setHours("1:00");
    }
  }, [initialValues]);

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

  const handleSave = () => {
    onSave({
      id: initialValues?.id,
      project,
      task,
      notes,
      hours,
    });
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.title}>
            {isEditing ? "Edit Time Entry" : "New Time Entry"}
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Project</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowProjectPicker(true)}
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
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Task</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowTaskPicker(true)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.inputText, !task && { color: Colors.textMuted }]}
              >
                {task || "Select task"}
              </Text>
              <ChevronDown size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <DropdownModal
            visible={showProjectPicker}
            onClose={() => setShowProjectPicker(false)}
            title="Select Project"
            options={projectOptions}
            selectedValue={project}
            onSelect={setProject}
          />

          <DropdownModal
            visible={showTaskPicker}
            onClose={() => setShowTaskPicker(false)}
            title="Select Task"
            options={taskOptions}
            selectedValue={task}
            onSelect={setTask}
          />

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

          <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
            <Text style={styles.submitText}>
              {isEditing ? "Update Entry" : "Save Entry"}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    flex: 1,
  },
  modalContainer: {
    backgroundColor: Colors.surfaceWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  modalList: {
    maxHeight: 240,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.inputBg,
    marginBottom: 8,
  },
  modalOptionSelected: {
    backgroundColor: Colors.primaryBlue,
  },
  modalOptionText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  modalOptionTextSelected: {
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
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
