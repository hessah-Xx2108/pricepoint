import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { api } from "../services/api";

const IMAGE_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5050"
    : "http://172.20.10.2:5050";

const getImageUrl = (img) => {
  if (!img) return null;

  let cleanImg = img.replace(/\\/g, "/");

  if (cleanImg.startsWith("http")) {
    cleanImg = cleanImg.replace(
      /http:\/\/\d+\.\d+\.\d+\.\d+:5050/,
      IMAGE_BASE_URL
    );
    return cleanImg;
  }

  if (cleanImg.startsWith("/")) {
    return `${IMAGE_BASE_URL}${cleanImg}`;
  }

  return `${IMAGE_BASE_URL}/${cleanImg}`;
};

export default function AdminReviewDetail({ navigation, route }) {
  const { item, onRefresh } = route.params || {};

  const [review, setReview] = useState(item);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedProductName, setEditedProductName] = useState(
    item?.product || ""
  );

  if (!review) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          No review data
        </Text>
      </SafeAreaView>
    );
  }

  const getStatusColor = () => {
    if (review.status === "approved") return "#16A34A";
    if (review.status === "rejected") return "#DC2626";
    return "#F59E0B";
  };

  const handleSaveProductName = async () => {
    if (!editedProductName.trim()) {
      Alert.alert("Error", "Product name cannot be empty.");
      return;
    }

    const response = await api.updateProductName(
      review.id,
      editedProductName.trim()
    );

    if (response.success) {
      setReview((prev) => ({
        ...prev,
        product: editedProductName.trim(),
      }));

      if (onRefresh) onRefresh();

      Alert.alert("Saved", "Product name updated successfully.");
    } else {
      Alert.alert("Error", response.message || "Could not update product name.");
    }
  };

  const handleApprove = () => {
  Alert.alert(
    "Approve Submission",
    `Are you sure you want to approve review #${review.id}?`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: async () => {
          const response = await api.approveSubmission(review.id);

          if (response.success) {

            

            setReview((prev) => ({ ...prev, status: "approved" }));
            if (onRefresh) onRefresh();

            navigation.goBack();
          } else {
            Alert.alert("Error", response.message || "Could not approve");
          }
        },
      },
    ]
  );
};

  const handleReject = () => {
    Alert.alert(
      "Reject Submission",
      `Are you sure you want to reject review #${review.id}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            const response = await api.rejectSubmission(review.id);

            if (response.success) {
              setReview((prev) => ({ ...prev, status: "rejected" }));
              if (onRefresh) onRefresh();
              navigation.goBack();
            } else {
              Alert.alert("Error", response.message || "Could not reject");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={26} color="#111" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Review #{review.id}</Text>
            <Text style={styles.headerSubtitle}>Submission Review Detail</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.statusBadgeContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              <Text style={styles.statusBadgeText}>{review.status}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <RowItem label="User" value={review.user} />
            <RowItem label="Price" value={review.submittedPrice} />
            <RowItem label="Store" value={review.store} />
            <RowItem label="Location" value={review.locationStatus} />
            <RowItem label="Trust score" value={review.trust} isLast />
          </View>

          <Text style={styles.sectionTitle}>Edit Product Name</Text>

          <View style={styles.editCard}>
            <Text style={styles.inputLabel}>Product Name</Text>

            <TextInput
              style={styles.input}
              value={editedProductName}
              onChangeText={setEditedProductName}
              placeholder="Enter correct product name"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProductName}
            >
              <Text style={styles.saveButtonText}>Save Product Name</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Uploaded Images</Text>

          {review.photos?.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesScroll}
            >
              {review.photos.map((img, index) => {
                const imageUrl = getImageUrl(img);

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedImage(imageUrl)}
                  >
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.noImageBox}>
              <Text style={styles.noImageText}>No images uploaded</Text>
            </View>
          )}

          <Modal visible={!!selectedImage} transparent animationType="fade">
            <TouchableOpacity
              style={styles.fullScreenContainer}
              onPress={() => setSelectedImage(null)}
            >
              <Image
                source={{ uri: selectedImage }}
                style={styles.fullScreenImage}
              />
            </TouchableOpacity>
          </Modal>

          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={handleApprove}
            >
              <Feather name="check" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={handleReject}
            >
              <Feather name="x" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function RowItem({ label, value, isLast }) {
  return (
    <View style={[styles.row, isLast && styles.lastRow]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 18,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backButton: {
    marginRight: 8,
    padding: 4,
  },

  headerTextContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: 34,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 3,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  statusBadgeContainer: {
    alignItems: "center",
    marginBottom: 15,
  },

  statusBadge: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 20,
  },

  statusBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  rowLabel: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },

  rowValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "700",
    maxWidth: "55%",
    textAlign: "right",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  editCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#fff",
  },

  saveButton: {
    backgroundColor: "#3E5BBB",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  imagesScroll: {
    marginBottom: 24,
  },

  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#E5E7EB",
  },

  noImageBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },

  noImageText: {
    color: "#6B7280",
    fontSize: 15,
  },

  fullScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullScreenImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  approveButton: {
    width: "48%",
    backgroundColor: "#16A34A",
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  rejectButton: {
    width: "48%",
    backgroundColor: "#DC2626",
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  actionButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },
});