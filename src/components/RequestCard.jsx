import { format } from "date-fns";
import {
  Calendar,
  ChevronRight,
  Clock,
  Home,
  Sunset,
} from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../theme/colors";

const icons = {
  running_late: { icon: Clock, bg: Colors.warningOrange },
  wfh: { icon: Home, bg: Colors.successGreen },
  leave: { icon: Calendar, bg: Colors.dangerRed },
  half_day: { icon: Sunset, bg: Colors.purple },
};

const parseRequestDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value.seconds != null) return new Date(value.seconds * 1000);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function RequestCard({ request }) {
  const { icon: Icon, bg } = icons[request.type] || icons.leave;
  const title = request.type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const dateStr = format(new Date(request.date), "d MMM yyyy");

  let detail = "";
  if (request.type === "running_late")
    detail = `Expected: ${request.details.expectedArrival}`;
  if (request.type === "leave") {
    const fromDate = parseRequestDate(request.details.fromDate);
    const toDate = parseRequestDate(request.details.toDate);
    if (fromDate && toDate) {
      detail = `${format(fromDate, "d MMM")} - ${format(toDate, "d MMM")}`;
    }
  }
  if (request.type === "half_day")
    detail = `${request.details.halfType === "first" ? "First Half" : "Second Half"}`;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <Icon color="white" size={20} />
      </View>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{dateStr}</Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
        {request.details.reason ? (
          <Text style={styles.reason} numberOfLines={1}>
            Reason: {request.details.reason}
          </Text>
        ) : null}
      </View>
      <ChevronRight color={Colors.textMuted} size={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceWhite,
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  center: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  detail: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  reason: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: "italic",
    marginTop: 1,
  },
});
