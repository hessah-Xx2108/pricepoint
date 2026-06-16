import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Privacy() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }


    // 🔥 هنا تربطينه بالـ backend لاحقًا
    Alert.alert("Success", "Password changed successfully");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change Password</Text>

      {/* Current Password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
        <TextInput
          placeholder="Current Password"
          secureTextEntry
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
      </View>

      {/* New Password */}
      <View style={styles.inputContainer}>
        <Ionicons name="key-outline" size={20} style={styles.icon} />
        <TextInput
          placeholder="New Password"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <Ionicons name="key-outline" size={20} style={styles.icon} />
        <TextInput
          placeholder="Confirm New Password"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "#DADADA",
    marginBottom: 25,
    paddingBottom: 8,
  },
  icon: {
    marginRight: 10,
    color: "#000",
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#3E5BBB",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});