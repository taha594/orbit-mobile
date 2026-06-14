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
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../theme/colors";

export default function WorkFromHomeSheet({ bottomSheetRef, onSubmit }) {
  const snapPoints = useMemo(() => ["50%"], []);
  const todayStr = format(new Date(), "EEEE, d MMM yyyy");
  const [requestLoading, setRequestLoading] = useState(false);

  const [reason, setReason] = useState("");

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
      await onSubmit({ date: todayStr, reason });
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.title}>Work From Home</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>{todayStr}</Text>
              <Calendar size={18} color={Colors.textMuted} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Reason</Text>
            <BottomSheetTextInput
              style={[styles.inputContainer, styles.multiline]}
              placeholder="e.g. Personal work, No commute, etc."
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
  inputText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  multiline: {
    height: 100,
    alignItems: "flex-start",
    paddingTop: 12,
  },
  submitBtn: {
    height: 50,
    flexDirection: "row",
    backgroundColor: Colors.primaryBlue,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "white",
    marginRight: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
