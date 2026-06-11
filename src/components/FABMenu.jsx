import { CalendarOff, Clock, Home, Plus, Sunset, X } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../theme/colors";

export default function FABMenu({ isOpen, onToggle, onAction }) {
  const actions = [
    { id: "half_day", label: "Half Day", icon: Sunset, color: Colors.purple },
    {
      id: "leave",
      label: "Leave Application",
      icon: CalendarOff,
      color: Colors.dangerRed,
    },
    {
      id: "wfh",
      label: "Work From Home",
      icon: Home,
      color: Colors.successGreen,
    },
    {
      id: "late",
      label: "Running Late",
      icon: Clock,
      color: Colors.warningOrange,
    },
  ];

  if (!isOpen) {
    return (
      <TouchableOpacity
        style={styles.fab}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Plus color="white" size={28} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onToggle}
      />

      <View style={styles.menuContainer}>
        {actions.map((action, index) => (
          <View
            key={action.id}
            style={[styles.actionRow, { bottom: 80 + index * 60 }]}
          >
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{action.label}</Text>
            </View>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={() => onAction(action.id)}
            >
              <action.icon color="white" size={24} />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.fabOpen}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <X color="white" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  menuContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  fab: {
    position: "absolute",
    bottom: 15,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabOpen: {
    position: "absolute",
    bottom: 15,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  actionRow: {
    position: "absolute",
    right: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  labelContainer: {
    backgroundColor: "transparent",
    paddingHorizontal: 8,
    marginRight: 10,
  },
  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
});
