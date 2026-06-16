import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";

export default function Admin({ navigation }) {
  const [search, setSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [expandedCards, setExpandedCards] = useState({});
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = async () => {
    try {
      setLoading(true);

      const response = await api.getAllSubmissions();
      console.log("ADMIN SUBMISSIONS:", response);

      if (response.success) {
        const formatted = response.submissions.map((item) => {
          return {
            id: item.Submission_ID,
            user: item.User_Name,
            trust: `${item.User_Points || 0}/100`,
            product: item.Product_Name,
            status: item.Status,
            submittedPrice: `${item.Submitted_Price} SAR`,
            store: item.Store_Name,
            time: item.Submission_Time,
            locationStatus: "Verified",
            photos: [
              item.Price_Img
                ? `http://172.20.10.3:5050/${item.Price_Img}`
                : null,
              item.Price_Img_2
                ? `http://172.20.10.3:5050/${item.Price_Img_2}`
                : null,
              item.Price_Img_3
                ? `http://172.20.10.3:5050/${item.Price_Img_3}`
                : null,
            ].filter(Boolean),
          };
        });

        setQueue(formatted);
      } else {
        setQueue([]);
      }
    } catch (error) {
      console.log("ADMIN LOAD ERROR:", error);
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredQueue = useMemo(() => {
    const searched = queue.filter((item) => {
      return (
        item.user.toLowerCase().includes(search.toLowerCase()) ||
        item.product.toLowerCase().includes(search.toLowerCase()) ||
        String(item.id).toLowerCase().includes(search.toLowerCase())
      );
    });

    const sorted = [...searched].sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.time) - new Date(a.time);
      }

      return new Date(a.time) - new Date(b.time);
    });

    return sorted;
  }, [queue, search, sortOrder]);

  const getStatusColor = (status) => {
    if (status === "approved") return "#16A34A";
    if (status === "rejected") return "#DC2626";
    return "#F59E0B";
  };

  const renderCard = (item) => {
    const isExpanded = expandedCards[item.id];

    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardId}>#{item.id}</Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusBadgeText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>User</Text>
          <Text style={styles.value}>{item.user}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Trust Score</Text>
          <Text style={styles.value}>{item.trust}</Text>
        </View>

        {isExpanded && (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Product</Text>
              <Text style={styles.value}>{item.product}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Price</Text>
              <Text style={styles.value}>{item.submittedPrice}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Store</Text>
              <Text style={styles.value}>{item.store}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Submitted</Text>
              <Text style={styles.value}>
                {new Date(item.time).toLocaleString()}
              </Text>
            </View>
          </>
        )}

        <View style={styles.cardButtons}>
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <Text style={styles.expandText}>
              {isExpanded ? "Show Less" : "Show More"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AdminReviewDetail", {
                item,
                onRefresh: loadSubmissions,
              })
            }
          >
            <Text style={styles.viewMore}>View More</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Admin Dashboard</Text>

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
          >
            <Ionicons name="options-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.queueText}>
          Submissions Queue ({filteredQueue.length})
        </Text>

        {loading ? (
          <ActivityIndicator color="#3E5BBB" size="large" />
        ) : filteredQueue.length === 0 ? (
          <Text style={styles.emptyText}>No submissions found</Text>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredQueue.map(renderCard)}
          </ScrollView>
        )}

        <Modal visible={filterVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Sort By</Text>

              {[
                { label: "Newest First", value: "newest" },
                { label: "Oldest First", value: "oldest" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    sortOrder === option.value && styles.selected,
                  ]}
                  onPress={() => setSortOrder(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      sortOrder === option.value && { color: "#fff" },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}

              <View style={styles.buttons}>
                <TouchableOpacity onPress={() => setSortOrder("newest")}>
                  <Text>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setFilterVisible(false)}>
                  <Text style={{ color: "#3B5BDB" }}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    marginTop: 8,
  },
  searchRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
  },
  filterButton: {
    marginLeft: 10,
  },
  queueText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "gray",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  cardId: {
    fontWeight: "700",
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  label: {
    color: "#888",
  },
  value: {
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  expandText: {
    color: "#666",
    fontWeight: "500",
  },
  viewMore: {
    color: "#3B5BDB",
    fontWeight: "700",
  },
 modalOverlay: {
  flex: 1,
  justifyContent: "flex-end",
  paddingBottom: 9,
  backgroundColor: "rgba(0,0,0,0.2)",
},
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  option: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: "#eee",
  },
  selected: {
    backgroundColor: "#3B5BDB",
  },
  optionText: {
    fontSize: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});