// screens/Homepage.js
import React, { useState, useCallback,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Homepage({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [trustScore, setTrustScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate("FullPriceList", { searchTerm: searchQuery });
    }
  };
  const checkVoucher = async () => {
  try {
    const res = await api.getMyVouchers();

    if (res.success && res.vouchers.length > 0) {
      const lastSeen = await AsyncStorage.getItem("lastVoucherCount");

      if (lastSeen != res.vouchers.length.toString()) {
        Alert.alert(
          "🎉 Congratulations!",
          "You earned a new voucher!"
        );

        await AsyncStorage.setItem(
          "lastVoucherCount",
          res.vouchers.length.toString()
        );
      }
    }
  } catch (err) {
    console.log("CHECK VOUCHER ERROR:", err);
  }
};
useEffect(() => {
  checkVoucher();
}, []);

  useFocusEffect(
    useCallback(() => {
      const loadHomeData = async () => {
        try {
          setLoading(true);

          const response = await api.getMySubmissions();
          console.log("HOME SUBMISSIONS RESPONSE:", response);

          if (response.success) {
            const orderedSubmissions = (response.submissions || []).sort((a, b) => {
              const order = {
                pending: 1,
                approved: 2,
                rejected: 3,
              };

              return order[a.Status] - order[b.Status];
            });

            setSubmissions(orderedSubmissions);
            setTrustScore(response.trustScore || 0);
          } else {
            setSubmissions([]);
            setTrustScore(0);
          }
        } catch (error) {
          console.log("Home data error:", error);
          setSubmissions([]);
        } finally {
          setLoading(false);
        }
      };

      loadHomeData();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
          placeholder="Search for products..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.trustBox}>
        <Text style={styles.trustText}>Trust Score: {trustScore}/100</Text>
      </View>

      <Text style={styles.sectionTitle}>My Recent Submissions</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3E5BBB" />
      ) : submissions.length === 0 ? (
        <Text style={styles.emptyText}>No submissions yet</Text>
      ) : (
        submissions.map((item) => {
          const status = item.Status || item.status;
          const product = item.ProductName || item.productName || "Unknown";
          const price = item.Submitted_Price || item.submittedPrice || "—";

          return (
            <View style={styles.card} key={item.Submission_ID || item.id}>
              <Text style={styles.productText}>
                {product} - {price} SAR
              </Text>

              <Text
                style={
                  status === "approved"
                    ? styles.verifiedText
                    : status === "pending"
                      ? styles.pendingText
                      : styles.rejectedText
                }
              >
                {status === "approved"
                  ? "✔ Verified"
                  : status === "pending"
                    ? "⏳ Pending"
                    : "✖ Rejected"}
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 90,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  search: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#3E5BBB",
    borderRadius: 10,
    height: 45,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  searchButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  trustBox: {
    backgroundColor: "#2E7D32",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  trustText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 18,
    borderRadius: 10,
    marginBottom: 10,
  },
  productText: {
    fontSize: 17,
    fontWeight: "600",
  },
  verifiedText: {
    color: "#2E7D32",
    marginTop: 6,
    fontWeight: "500",
    fontSize: 16,
  },
  pendingText: {
    color: "#FF9800",
    marginTop: 6,
    fontWeight: "500",
    fontSize: 16,
  },
  rejectedText: {
    color: "#D32F2F",
    marginTop: 6,
    fontWeight: "500",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    marginTop: 30,
    fontSize: 16,
  },
});