import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

export default function DataExtraction({ route, navigation }) {
  const { photo } = route.params || {};

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("");

  const [extraPhotos, setExtraPhotos] = useState({
    second: null,
    third: null,
  });

  useEffect(() => {
    if (photo) {
      setProductName("");
      setPrice("");
      setStore("");
    }
  }, [photo]);

  const pickExtraPhoto = async (slot) => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: false,
    });

    if (!result.canceled) {
      setExtraPhotos((prev) => ({
        ...prev,
        [slot]: result.assets[0].uri,
      }));
    }
  };

  const handleNext = async () => {
    if (!productName.trim()) {
      Alert.alert("Missing Data", "Please enter the product name.");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Missing Data", "Please enter the price.");
      return;
    }

    if (!store.trim()) {
      Alert.alert("Missing Data", "Please enter the store name.");
      return;
    }

    if (!photo || !extraPhotos.second || !extraPhotos.third) {
      Alert.alert(
        "Missing Photos",
        "You must upload 3 photos: product, price tag, and store."
      );
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Location Required", "Please allow location access.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    navigation.navigate("PriceSubmitted", {
      productName,
      price,
      store,
      GPS_Lat: location.coords.latitude,
      GPS_Long: location.coords.longitude,
      mainPhoto: photo,
      secondPhoto: extraPhotos.second,
      thirdPhoto: extraPhotos.third,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Enter Product Details</Text>

      <Text style={styles.label}>Product:</Text>
      <TextInput
        style={styles.input}
        value={productName}
        onChangeText={setProductName}
        placeholder="Enter product name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Store:</Text>
      <TextInput
        style={styles.input}
        value={store}
        onChangeText={setStore}
        placeholder="Enter store name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Required Photos:</Text>
      <Text style={styles.photoHint}>
        Product photo, price tag photo, and store photo are required.
      </Text>

      <View style={styles.photoRow}>
        <View style={styles.photoWrapper}>
          <View style={styles.photoBox}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.preview} />
            ) : (
              <Ionicons name="camera-outline" size={28} color="#555" />
            )}
          </View>
          <Text style={styles.photoLabel}>Product</Text>
        </View>

        <View style={styles.photoWrapper}>
          <TouchableOpacity
            style={styles.photoBox}
            onPress={() => pickExtraPhoto("second")}
          >
            {extraPhotos.second ? (
              <Image
                source={{ uri: extraPhotos.second }}
                style={styles.preview}
              />
            ) : (
              <Ionicons name="camera-outline" size={28} color="#555" />
            )}
          </TouchableOpacity>
          <Text style={styles.photoLabel}>Price Tag</Text>
        </View>

        <View style={styles.photoWrapper}>
          <TouchableOpacity
            style={styles.photoBox}
            onPress={() => pickExtraPhoto("third")}
          >
            {extraPhotos.third ? (
              <Image source={{ uri: extraPhotos.third }} style={styles.preview} />
            ) : (
              <Ionicons name="camera-outline" size={28} color="#555" />
            )}
          </TouchableOpacity>
          <Text style={styles.photoLabel}>Store</Text>
        </View>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.goBack()}
        >
          <Text>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={{ color: "#fff" }}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: "#F7F8FA",
    paddingTop: 60,
  },
  title: {
    fontSize: 21,
    fontWeight: "600",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  photoHint: {
    color: "#777",
    fontSize: 13,
    marginTop: 5,
  },
  photoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  photoWrapper: {
    alignItems: "center",
    width: 90,
  },
  photoBox: {
    width: 90,
    height: 90,
    backgroundColor: "#eee",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  photoLabel: {
    fontSize: 12,
    color: "#555",
    marginTop: 6,
    textAlign: "center",
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  bottomButtons: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editBtn: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  nextBtn: {
    backgroundColor: "#3E5BBB",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
});