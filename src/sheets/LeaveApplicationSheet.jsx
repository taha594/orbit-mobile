import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { Calendar, ChevronDown } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DatePickerModal from "../components/DatePickerModal";
import { Colors } from "../theme/colors";

const leaveTypeOptions = [
  { label: "Casual Leave", value: "Casual Leave" },
  { label: "Sick Leave", value: "Sick Leave" },
  { label: "Earned Leave", value: "Earned Leave" },
  { label: "Maternity Leave", value: "Maternity Leave" },
];

function LeaveTypeModal({ visible, onClose, selectedValue, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Leave Type</Text>
          <FlatList
            data={leaveTypeOptions}
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

export default function LeaveApplicationSheet({ bottomSheetRef, onSubmit }) {
  const snapPoints = useMemo(() => ["70%"], []);

  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [showLeaveTypePicker, setShowLeaveTypePicker] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

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
    onSubmit({ leaveType, fromDate, toDate, reason });
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Leave Application</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Leave Type</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowLeaveTypePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.inputText}>{leaveType}</Text>
              <ChevronDown size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <LeaveTypeModal
            visible={showLeaveTypePicker}
            onClose={() => setShowLeaveTypePicker(false)}
            selectedValue={leaveType}
            onSelect={setLeaveType}
          />

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>From Date</Text>
              <TouchableOpacity
                onPress={() => setShowFromPicker(true)}
                style={styles.inputContainer}
              >
                <Text style={styles.inputText}>
                  {format(fromDate, "d MMM yyyy")}
                </Text>
                <Calendar size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity
                onPress={() => setShowToPicker(true)}
                style={styles.inputContainer}
              >
                <Text style={styles.inputText}>
                  {format(toDate, "d MMM yyyy")}
                </Text>
                <Calendar size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Reason</Text>
            <BottomSheetTextInput
              style={[styles.inputContainer, styles.multiline]}
              placeholder="e.g. Personal work, Family function, etc."
              placeholderTextColor={Colors.textMuted}
              multiline
              value={reason}
              onChangeText={setReason}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheetView>

      <DatePickerModal
        visible={showFromPicker}
        onClose={() => setShowFromPicker(false)}
        onSelect={setFromDate}
        initialDate={fromDate}
      />
      <DatePickerModal
        visible={showToPicker}
        onClose={() => setShowToPicker(false)}
        onSelect={setToDate}
        initialDate={toDate}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
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
  row: {
    flexDirection: "row",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalContainer: {
    backgroundColor: "#fff",
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
