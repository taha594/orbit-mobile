import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { format, addDays, subDays } from "date-fns";
import { Colors } from "../theme/colors";

export default function DateNavigator({ date, onDateChange, onOpenPicker }) {
  const dateStr = format(date, "EEEE, d MMM yyyy");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginVertical: 12,
      }}
    >
      <TouchableOpacity onPress={() => onDateChange(subDays(date, 1))}>
        <ChevronLeft color={Colors.textPrimary} size={24} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onOpenPicker}
        style={{
          borderBottomWidth: 2,
          borderBottomColor: Colors.primaryBlue,
          paddingBottom: 2,
        }}
      >
        <Text
          style={{ fontSize: 15, fontWeight: "500", color: Colors.textPrimary }}
        >
          {dateStr}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onDateChange(addDays(date, 1))}>
        <ChevronRight color={Colors.textPrimary} size={24} />
      </TouchableOpacity>
    </View>
  );
}
