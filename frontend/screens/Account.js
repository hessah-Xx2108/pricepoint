import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Unorderedlist from "react-native-unordered-list";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";

export default function Account({ navigation }) {
  const [user, setUser] = useState(null);
  const [trustScore, setTrustScore] = useState(0);
  const [profileImage, setProfileImage] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      const loadUserData = async () => {
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const storedImage = await AsyncStorage.getItem("profileImage");
        setProfileImage(storedImage || null);

        try {
          const response = await api.getMySubmissions();
          console.log("ACCOUNT RESPONSE:", response);

          if (response.success) {
            const submissions = response.submissions || [];

            setTrustScore(response.trustScore || 0);

            setStats({
              total: submissions.length,
              verified: submissions.filter((item) => item.Status === "approved").length,
              pending: submissions.filter((item) => item.Status === "pending").length,
              rejected: submissions.filter((item) => item.Status === "rejected").length,
            });
          }
        } catch (error) {
          console.log("Account data error:", error);
        }
      };

      loadUserData();
    }, [])
  );

  const ProgressBar = ({ step, steps }) => {
    const progress = step / steps;

    return (
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    );
  };

  if (!user) {
    return <Text style={{ marginTop: 50, textAlign: "center" }}>Loading...</Text>;
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>My Account</Text>

      <TouchableOpacity onPress={() => navigation.getParent()?.navigate("MyDetails")}>
        <View style={styles.container}>
          <View style={styles.profileRow}>
            <View style={styles.profileImageBox}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Text style={styles.profilePlaceholder}>👤</Text>
              )}
            </View>

            <View style={styles.profileTextBox}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.phone}>{user.phone}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.scoreLabel}>Trust Score: {trustScore}/100</Text>
      <ProgressBar step={trustScore} steps={100} />

      <Text style={styles.monthTitle}>This Month:</Text>

      <View style={styles.container2}>
        <Unorderedlist style={styles.listContainer}>
          <Text style={styles.list}>{stats.total} Submissions {"\n\n"}</Text>
        </Unorderedlist>

        <Unorderedlist style={styles.listContainer}>
          <Text style={styles.list}>{stats.verified} Verified {"\n\n"}</Text>
        </Unorderedlist>

        <Unorderedlist style={styles.listContainer}>
          <Text style={styles.list}>{stats.pending} Pending {"\n\n"}</Text>
        </Unorderedlist>

        <Unorderedlist style={styles.listContainer}>
          <Text style={styles.list}>{stats.rejected} Rejected</Text>
        </Unorderedlist>
      </View>

      <View style={styles.BottomButtons2}>
        <TouchableOpacity
          style={styles.accountButton}
          onPress={() => navigation.navigate("MyWishlist")}
        >
          <Text style={styles.buttonText}>Wishlist</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.accountButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.accountButton}
          onPress={() => navigation.navigate("MyVouchers")}
        >
          <Text style={styles.buttonText}>Vouchers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
  },

  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    paddingTop: 10,
  },

  container: {
    marginBottom: 40,
    padding: 20,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  profileImageBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 15,
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  profilePlaceholder: {
    fontSize: 30,
  },

  profileTextBox: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  phone: {
    fontSize: 16,
    marginTop: 5,
    color: "gray",
  },

  scoreLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  progressBackground: {
    height: 8,
    backgroundColor: "#E5E5E5",
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#3FAD46",
    borderRadius: 10,
  },

  monthTitle: {
    fontSize: 20,
    paddingTop: 30,
    fontWeight: "bold",
    marginBottom: 15,
  },

  container2: {
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 8,
  },

  list: {
    fontSize: 15,
    fontWeight: "bold",
  },

  listContainer: {
    paddingLeft: 25,
    fontWeight: "800",
  },

  BottomButtons2: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  accountButton: {
    flex: 1,
    backgroundColor: "#3E5BBB",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  wishlist: {
    backgroundColor: "#3E5BBB",
    padding: 15,
    borderRadius: 30,
    width: "45%",
    alignItems: "center",
  },

  settings: {
    backgroundColor: "#3E5BBB",
    padding: 15,
    borderRadius: 30,
    width: "45%",
    alignItems: "center",
  },
});