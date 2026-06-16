// screens/AddProduct.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

export default function AddProduct({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [photo, setPhoto] = useState(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 15 }}>
          Camera permission is required
        </Text>

        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
        >
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // -------------------------------------------
  // 📸 CAPTURE PHOTO FUNCTION
  // -------------------------------------------
  let cameraRef = null;

  const takePhoto = async () => {
    if (!cameraRef) return;

    const result = await cameraRef.takePictureAsync({
      quality: 0.7,
      base64: true, // AI-ready
    });

    setPhoto(result.uri);
    setCameraActive(false);
  };

  return (
    <View style={styles.container}>
      {/* CAMERA MODE */}
      {cameraActive ? (
        <View style={{ flex: 1 }}>
          {/* BACK BUTTON */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCameraActive(false)}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>

          {/* CAMERA VIEW */}
          <CameraView
            style={styles.camera}
            ref={(r) => (cameraRef = r)}
          />

          {/* CAPTURE BUTTON */}
          <TouchableOpacity
            style={styles.captureBtn}
            onPress={takePhoto}
          >
            <Ionicons name="camera" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        // -------------------------------------------
        // 📄 NORMAL PAGE (NO SCANNER OPEN)
        // -------------------------------------------
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            📸 Capture Product & Price
          </Text>

          {/* Display captured photo */}
          {photo && (
            <Image
              source={{ uri: photo }}
              style={styles.preview}
            />
          )}

          <Text style={styles.tipsTitle}>Tips:</Text>

          <View style={styles.tips}>
            <Text>• Show the product clearly.</Text>
            <Text>• Include the full price tag.</Text>
            <Text>• Include the store information.</Text>
            <Text>• Take the photo in good lighting.</Text>
          </View>

          {/* BUTTONS */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.capture}
              onPress={() => setCameraActive(true)}
            >
              <Text>Open Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.next}
              disabled={!photo} // only allow next when image captured
              onPress={() =>
                navigation.navigate("DataExtraction", { photo })
              }
            >
              <Text style={{ color: "#fff" }}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// =========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 90,
    backgroundColor: "#fff",
  },
  camera: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  captureBtn: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#00000080",
    padding: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tips: {
    backgroundColor: "#f7f7f7",
    padding: 15,
    borderRadius: 10,
  },
  bottomButtons: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  capture: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 30,
    width: "45%",
    alignItems: "center",
  },
  next: {
    backgroundColor: "#3E5BBB",
    padding: 15,
    borderRadius: 30,
    width: "45%",
    alignItems: "center",
  },
  permissionBtn: {
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});