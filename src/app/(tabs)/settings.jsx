import { ChevronRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { Colors } from "../../theme/colors";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => {
    console.log("🚀 ~ SettingsScreen ~ user:", JSON.stringify(user));
    return state.user;
  });
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("timesheet_reminders");
      if (stored !== null) setRemindersEnabled(JSON.parse(stored));
    })();
  }, []);

  const toggleReminders = async (value) => {
    setRemindersEnabled(value);
    await AsyncStorage.setItem("timesheet_reminders", JSON.stringify(value));

    // if (value) {
    //   // const { status } = await Notifications.requestPermissionsAsync();
    //   if (status === "granted") {
    //     await Notifications.scheduleNotificationAsync({
    //       content: {
    //         title: "Timesheet Reminder",
    //         body: "Don't forget to log your hours for today!",
    //       },
    //       trigger: {
    //         hour: 17,
    //         minute: 0,
    //         repeats: true,
    //       },
    //     });
    //   } else {
    //     Alert.alert(
    //       "Permission Denied",
    //       "Please enable notifications in settings to receive reminders.",
    //     );
    //     setRemindersEnabled(false);
    //   }
    // } else {
    //   await Notifications.cancelAllScheduledNotificationsAsync();
    // }
  };

  const ProfileRow = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.rowValue}>{value}</Text>
        <ChevronRight color={Colors.textMuted} size={18} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>Profile</Text>
        <View style={styles.card}>
          <ProfileRow
            label="Name"
            value={
              `${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}` ||
              "User"
            }
          />
          <ProfileRow
            label="Email"
            value={user?.email || "areeb@example.com"}
          />
          {/* <ProfileRow
            label="Department"
            value={user?.department || "Development"}
          /> */}
          {/* <ProfileRow
            label="Employee ID"
            value={user?.employeeId || "EMP-1024"}
          /> */}
        </View>

        {/* <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.card}>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.iconContainer}>
                <Bell size={20} color={Colors.primaryBlue} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Timesheet Reminder</Text>
                <Text style={styles.settingSub}>
                  Remind me to submit timesheet
                </Text>
              </View>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={toggleReminders}
              trackColor={{ false: "#D1D5DB", true: Colors.primaryBlue }}
              thumbColor="white"
            />
          </View>
        </View> */}

        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.card}>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={() =>
          Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Logout",
              style: "destructive",
              onPress: () => {
                useAuthStore.getState().logout();
                router.replace("/login");
              },
            },
          ])
        }
      >
        <Text
          style={[
            styles.rowLabel,
            { marginBottom: 20, textAlign: "center", fontSize: 16 },
          ]}
        >
          Logout
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  rowValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginRight: 4,
  },
  iconContainer: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  settingSub: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
