// screens/MyVouchers.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";

export default function MyVouchers({ navigation }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVouchers = async () => {
  try {
    const res = await api.getMyVouchers();

    if (res.success) {
      setVouchers(res.vouchers || []);
    }
  } catch (err) {
    console.log("VOUCHER ERROR:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadVouchers();
  }, []);

  const goToHome = () => {
    navigation.navigate("BottomTabs", { screen: "Home" });
  };

  const goToAdd = () => {
    navigation.navigate("BottomTabs", { screen: "Add" });
  };

  const goToAccount = () => {
    navigation.navigate("BottomTabs", { screen: "Account" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Vouchers</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3E5BBB" />
        ) : vouchers.length === 0 ? (
          <Text style={styles.empty}>No vouchers yet</Text>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {vouchers.map((v) => (
              <View key={v.Voucher_ID} style={styles.card}>
                <Text style={styles.id}>Voucher #{v.Voucher_ID}</Text>
                <Text style={styles.store}>Store: {v.Store_Name}</Text>
                <Text style={styles.amount}>Amount: {v.Amount} SAR</Text>
                <Text style={styles.code}>Code: {v.Voucher_Code}</Text>
                <Text style={styles.expiry}>Exp: {v.Expiry_Date}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={goToHome}>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToAdd}>
          <Ionicons name="add-circle-outline" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToAccount}>
          <Ionicons name="person-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
    paddingBottom: 100,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "gray",
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  id: {
    fontWeight: "700",
    fontSize: 16,
  },

  store: {
    color: "#3E5BBB",
    marginTop: 6,
  },

  amount: {
    color: "green",
    fontWeight: "700",
    marginTop: 6,
  },

  code: {
    marginTop: 6,
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },

  expiry: {
    marginTop: 6,
    fontSize: 12,
    color: "gray",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#3E5BBB",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});