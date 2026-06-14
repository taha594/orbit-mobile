import { Filter } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RequestCard from "../../components/RequestCard";
import { useQuickActions } from "../../hooks/useQuickActions";
import { Colors } from "../../theme/colors";

const filters = [
  { id: "all", label: "All" },
  { id: "leave", label: "Leave" },
  { id: "wfh", label: "WFH" },
  { id: "late", label: "Late" },
  { id: "half_day", label: "Half Day" },
];

export default function RequestsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("all");
  const { requests, requestsLoading, requestsError } = useQuickActions();

  const filteredRequests = useMemo(() => {
    if (activeFilter === "all") return requests;

    return requests.filter((r) => {
      if (activeFilter === "leave") return r.type === "leave";
      if (activeFilter === "wfh") return r.type === "wfh";
      if (activeFilter === "late") return r.type === "running_late";
      if (activeFilter === "half_day") return r.type === "half_day";
      return true;
    });
  }, [requests, activeFilter]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Requests</Text>
        <TouchableOpacity>
          <Filter color={Colors.textPrimary} size={24} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 50 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.activeChip,
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterLabel,
                  activeFilter === filter.id && styles.activeLabel,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {requestsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestCard request={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No requests found.</Text>
            </View>
          )}
        />
      )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  filterContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  activeLabel: {
    color: "white",
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    color: Colors.danger || "#c53030",
    fontSize: 16,
    textAlign: "center",
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
