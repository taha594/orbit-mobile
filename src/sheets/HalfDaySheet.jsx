import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { Calendar } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DatePickerModal from "../components/DatePickerModal";
import { Colors } from "../theme/colors";

export default function HalfDaySheet({ bottomSheetRef, onSubmit }) {
  const snapPoints = useMemo(() => ["60%"], []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const todayStr = format(selectedDate, "EEEE, d MMM yyyy");
  const [requestLoading, setRequestLoading] = useState(false);

  const [halfType, setHalfType] = useState("first");
  const [reason, setReason] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleSubmit = async () => {
    try {
      setRequestLoading(true);
      await onSubmit({ date: todayStr, halfType, reason });
      setRequestLoading(false);
      bottomSheetRef.current?.close();
    } catch (error) {
      // Keep the bottom sheet open when submission fails.
    } finally {
      setRequestLoading(false);
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
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>Half Day</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.inputText}>{todayStr}</Text>
            <Calendar size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <DatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelect={setSelectedDate}
          initialDate={selectedDate}
        />

        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setHalfType("first")}
          >
            <View
              style={[
                styles.radio,
                halfType === "first" && styles.radioSelected,
              ]}
            />
            <Text style={styles.radioLabel}>First Half (Before 12:30 PM)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setHalfType("second")}
          >
            <View
              style={[
                styles.radio,
                halfType === "second" && styles.radioSelected,
              ]}
            />
            <Text style={styles.radioLabel}>Second Half (After 12:30 PM)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Reason</Text>
          <BottomSheetTextInput
            style={[styles.inputContainer, styles.multiline]}
            placeholder="e.g. Personal work, Appointment, etc."
            placeholderTextColor={Colors.textMuted}
            multiline
            value={reason}
            onChangeText={setReason}
          />
        </View>

        <TouchableOpacity
          disabled={requestLoading}
          style={[styles.submitBtn, { opacity: requestLoading ? 0.8 : 1 }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Submit</Text>
          {requestLoading && <ActivityIndicator color={"#fff"} />}
        </TouchableOpacity>
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
  inputText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: Colors.primaryBlue,
  },
  radioLabel: {
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
    flexDirection: "row",
  },
  submitText: {
    marginRight: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
