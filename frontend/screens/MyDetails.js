import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { api } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

export default function MyDetails({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [image, setImage] = useState(null);

  const [initialData, setInitialData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    image: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";

    if (dateString.includes("/")) return dateString;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatDateForDatabase = (displayDate) => {
    if (!displayDate) return null;

    const parts = displayDate.split("/");
    if (parts.length !== 3) return null;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const formatDateFromPicker = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

 const loadSavedData = async () => {
  const savedUser = await AsyncStorage.getItem("user");
  const parsedUser = savedUser ? JSON.parse(savedUser) : {};

  const fullName = parsedUser.name || "";
  const nameParts = fullName.split(" ");

  const savedFirstName = nameParts[0] || "";
  const savedLastName = nameParts.slice(1).join(" ") || "";
  const savedPhone = parsedUser.phone || "";
  const savedDob = formatDateForDisplay(parsedUser.dateOfBirth);
  const savedImage = await AsyncStorage.getItem("profileImage");

  const loadedData = {
    firstName: savedFirstName,
    lastName: savedLastName,
    phone: savedPhone,
    dob: savedDob,
    image: savedImage || null,
  };

  setFirstName(loadedData.firstName);
  setLastName(loadedData.lastName);
  setPhone(loadedData.phone);
  setDob(loadedData.dob);
  setImage(loadedData.image);
  setInitialData(loadedData);

  if (loadedData.dob) {
    const parts = loadedData.dob.split("/");
    const parsed = new Date(parts[2], parts[1] - 1, parts[0]);

    if (!isNaN(parsed.getTime())) {
      setSelectedDate(parsed);
    }
  }
};

useFocusEffect(
  useCallback(() => {
    loadSavedData();
  }, [])
);

  const hasChanges = useMemo(() => {
    return (
      firstName !== initialData.firstName ||
      lastName !== initialData.lastName ||
      phone !== initialData.phone ||
      dob !== initialData.dob ||
      image !== initialData.image
    );
  }, [firstName, lastName, phone, dob, image, initialData]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to allow access to your photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      setDob(formatDateFromPicker(date));
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updateResponse = await api.updateProfile({
        Name: `${firstName} ${lastName}`.trim(),
        Phone: phone,
        Date_Of_Birth: formatDateForDatabase(dob),
      });

      if (!updateResponse.success) {
        Alert.alert(
          "Error",
          updateResponse.message || "Could not update profile."
        );
        return;
      }

      if (image) {
        await AsyncStorage.setItem("profileImage", image);
      } else {
        await AsyncStorage.removeItem("profileImage");
      }

      const updatedUser = {
        ...updateResponse.user,
      };

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      const newInitialData = {
        firstName,
        lastName,
        phone,
        dob,
        image,
      };

      setInitialData(newInitialData);

      Alert.alert("Success", "Your changes have been saved.");
    } catch (error) {
      console.log("SAVE PROFILE ERROR:", error);
      Alert.alert("Error", "Something went wrong while saving.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>My Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.imageBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-outline" size={40} color="#555" />
          )}
        </View>

        <TouchableOpacity style={styles.plusButton} onPress={pickImage}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            placeholder="Enter first name"
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            placeholder="Enter last name"
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.inputBox} onPress={openDatePicker}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={[styles.input, !dob && styles.placeholderText]}>
            {dob || "Select your date of birth"}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      {Platform.OS === "ios" && showDatePicker && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => setShowDatePicker(false)}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      )}

      {hasChanges && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  imageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  imageBox: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  plusButton: {
    position: "absolute",
    bottom: 0,
    right: 120,
    backgroundColor: "#3E5BBB",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  form: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 10,
  },

  inputBox: {
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    paddingVertical: 12,
  },

  label: {
    fontSize: 12,
    color: "#888",
  },

  input: {
    fontSize: 16,
    marginTop: 5,
    color: "#000",
  },

  placeholderText: {
    color: "#999",
  },

  saveButton: {
    marginTop: 30,
    backgroundColor: "#3E5BBB",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  doneButton: {
    marginTop: 15,
    backgroundColor: "#3E5BBB",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },

  doneButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
});