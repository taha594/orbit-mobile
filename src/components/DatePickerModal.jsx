import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { getDaysInMonth } from "date-fns";
import { X } from "lucide-react-native";
import { Colors } from "../theme/colors";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function DatePickerModal({ visible, onClose, onSelect, initialDate }) {
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());

  useEffect(() => {
    if (initialDate) {
      setSelectedYear(initialDate.getFullYear());
      setSelectedMonth(initialDate.getMonth());
      setSelectedDay(initialDate.getDate());
    }
  }, [initialDate, visible]);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 + i);
  const daysCount = getDaysInMonth(new Date(selectedYear, selectedMonth));
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  const handleConfirm = () => {
    const clampedDay = Math.min(selectedDay, daysCount);
    const newDate = new Date(selectedYear, selectedMonth, clampedDay);
    onSelect(newDate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.columns}>
            <View style={styles.column}>
              <Text style={styles.columnLabel}>Month</Text>
              <FlatList
                data={months}
                keyExtractor={(item, index) => `m-${index}`}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedMonth(index)}
                    style={[
                      styles.item,
                      selectedMonth === index && styles.itemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        selectedMonth === index && styles.itemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.columnLabel}>Day</Text>
              <FlatList
                data={days}
                keyExtractor={(item) => `d-${item}`}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedDay(item)}
                    style={[
                      styles.item,
                      selectedDay === item && styles.itemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        selectedDay === item && styles.itemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.columnLabel}>Year</Text>
              <FlatList
                data={years}
                keyExtractor={(item) => `y-${item}`}
                style={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedYear(item)}
                    style={[
                      styles.item,
                      selectedYear === item && styles.itemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        selectedYear === item && styles.itemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
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
    gap: 8,
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
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 4,
  },
  itemSelected: {
    backgroundColor: Colors.primaryBlue,
  },
  itemText: {
    fontSize: 14,
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
