import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { addMinutes, format } from "date-fns";
import { Calendar, Clock, X } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
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

function TimePicker({ visible, onClose, onSelect, initialDate }) {
  const [selectedHour, setSelectedHour] = useState(initialDate.getHours());
  const [selectedMinute, setSelectedMinute] = useState(
    initialDate.getMinutes(),
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleConfirm = () => {
    const newDate = new Date(initialDate);
    newDate.setHours(selectedHour, selectedMinute, 0, 0);
    onSelect(newDate);
    onClose();
  };

  const formatHour = (h) => {
    const period = h >= 12 ? "PM" : "AM";
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${display} ${period}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.container}>
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.title}>Select Time</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <View style={pickerStyles.columns}>
            <View style={pickerStyles.column}>
              <Text style={pickerStyles.columnLabel}>Hour</Text>
              <FlatList
                data={hours}
                keyExtractor={(item) => `h-${item}`}
                style={pickerStyles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedHour(item)}
                    style={[
                      pickerStyles.item,
                      selectedHour === item && pickerStyles.itemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        pickerStyles.itemText,
                        selectedHour === item && pickerStyles.itemTextSelected,
                      ]}
                    >
                      {formatHour(item)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={pickerStyles.column}>
              <Text style={pickerStyles.columnLabel}>Minute</Text>
              <FlatList
                data={minutes}
                keyExtractor={(item) => `m-${item}`}
                style={pickerStyles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedMinute(item)}
                    style={[
                      pickerStyles.item,
                      selectedMinute === item && pickerStyles.itemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        pickerStyles.itemText,
                        selectedMinute === item &&
                          pickerStyles.itemTextSelected,
                      ]}
                    >
                      {String(item).padStart(2, "0")}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
          <TouchableOpacity
            style={pickerStyles.confirmBtn}
            onPress={handleConfirm}
          >
            <Text style={pickerStyles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: 420,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  columns: {
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: "center",
  },
  list: {
    height: 220,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 4,
  },
  itemSelected: {
    backgroundColor: Colors.primaryBlue,
  },
  itemText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  itemTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  confirmBtn: {
    marginTop: 16,
    height: 44,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default function RunningLateSheet({ bottomSheetRef, onSubmit }) {
  const snapPoints = useMemo(() => ["55%"], []);
  const todayStr = format(new Date(), "EEEE, d MMM yyyy");

  const [expectedTime, setExpectedTime] = useState(addMinutes(new Date(), 30));
  const [reason, setReason] = useState("");
  const [showPicker, setShowPicker] = useState(false);

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

  const handleSubmit = () => {
    onSubmit({
      date: todayStr,
      expectedArrival: format(expectedTime, "p"),
      reason,
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
          <Text style={styles.title}>Running Late</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>{todayStr}</Text>
              <Calendar size={18} color={Colors.textMuted} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Expected Arrival Time</Text>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.inputContainer}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Clock
                  size={18}
                  color={Colors.textMuted}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.inputText}>
                  {format(expectedTime, "p")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Reason</Text>
            <BottomSheetTextInput
              style={[styles.inputContainer, styles.multiline]}
              placeholder="e.g. Traffic, Doctor appointment, etc."
              placeholderTextColor={Colors.textMuted}
              multiline
              value={reason}
              onChangeText={setReason}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </BottomSheetView>

      <TimePicker
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={setExpectedTime}
        initialDate={expectedTime}
      />
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
  inputText: {
    fontSize: 14,
    color: Colors.textPrimary,
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
