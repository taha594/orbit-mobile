import { Tabs } from "expo-router";
import {
  CalendarClock,
  ClipboardList,
  Settings as SettingsIcon,
} from "lucide-react-native";
import { Colors } from "../../theme/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primaryBlue,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="timesheet"
        options={{
          title: "Timesheet",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <CalendarClock size={24} color={color} />
            ) : (
              <CalendarClock size={24} color={color} strokeWidth={1.5} />
            ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: "Requests",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <ClipboardList size={24} color={color} />
            ) : (
              <ClipboardList size={24} color={color} strokeWidth={1.5} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SettingsIcon size={24} color={color} />
            ) : (
              <SettingsIcon size={24} color={color} strokeWidth={1.5} />
            ),
        }}
      />
    </Tabs>
  );
}
