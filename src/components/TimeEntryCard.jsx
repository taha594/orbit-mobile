import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Edit3, Trash2 } from "lucide-react-native";
import { Colors } from "../theme/colors";

export default function TimeEntryCard({ entry, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.project}>{entry.project}</Text>
          <Text style={styles.task}>{entry.task}</Text>
        </View>
        <View style={styles.rightColumn}>
          <View style={styles.meta}> 
            <Text style={styles.duration}>
              {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m
            </Text>
            <Text style={styles.timeRange}>
              {entry.startTime} - {entry.endTime}
            </Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit?.(entry)}
              activeOpacity={0.7}
            >
              <Edit3 size={16} color={Colors.primaryBlue} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete?.(entry)}
              activeOpacity={0.7}
            >
              <Trash2 size={16} color={Colors.dangerRed} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceWhite,
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accent: {
    width: 4,
    backgroundColor: Colors.primaryBlue,
  },
  content: {
    flex: 1,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  meta: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.inputBg,
  },
  project: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  task: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  duration: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primaryBlue,
  },
  timeRange: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
