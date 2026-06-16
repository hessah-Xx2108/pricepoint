import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ navigation }) {
 const handleLogout = () => {
  Alert.alert("Log Out", "Are you sure you want to log out?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Log Out",
      style: "destructive",
      onPress: async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");

        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      },
    },
  ]);
};

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
        <Text style={styles.header}>Settings</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("Privacy")}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            style={styles.icon}
          />
          <Text style={styles.text}>Privacy</Text>
          <Ionicons name="chevron-forward" size={20} style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} style={styles.icon} />
          <Text style={styles.text}>Log Out</Text>
          <Ionicons name="chevron-forward" size={20} style={styles.arrow} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={goToHome}>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={goToAdd}>
          <Ionicons name="add-circle-outline" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={goToAccount}>
          <Ionicons name="person-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  content: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 0.3,
    borderColor: "#DADADA",
  },

  icon: {
    marginRight: 15,
    color: "#000",
  },

  text: {
    fontSize: 16,
    flex: 1,
  },

  arrow: {
    color: "#888",
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

  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
});