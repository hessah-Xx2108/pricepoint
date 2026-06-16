// screens/ProductDetails.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWishlist } from "../context/WishlistContext";

export default function ProductDetails({ navigation, route }) {
  const passedProduct = route.params?.product || {};

  const product = {
    name:
      passedProduct.name ||
      passedProduct.productName ||
      route.params?.productName ||
      route.params?.name ||
      "Unknown Product",
  };

  const prices = route.params?.prices || [];

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [menuVisible, setMenuVisible] = useState(false);

  const isProductInWishlist = isInWishlist(product.name);

  const handleWishlistPress = () => {
    if (isProductInWishlist) {
      removeFromWishlist(product.name);
    } else {
      addToWishlist(product);
    }
  };

  const handleReportIncorrectPrice = () => {
    setMenuVisible(false);

    Alert.alert(
      "Report Submitted",
      "Thank you! Your report has been received."
    );
  };

  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "BottomTabs",
          state: {
            routes: [{ name: "Home" }],
          },
        },
      ],
    });
  };

  const goToAdd = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "BottomTabs",
          state: {
            routes: [{ name: "Add" }],
          },
        },
      ],
    });
  };

  const goToAccount = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "BottomTabs",
          state: {
            routes: [{ name: "Account" }],
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Product Details</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={handleWishlistPress}
              style={styles.headerButton}
            >
              <Ionicons
                name={isProductInWishlist ? "heart" : "heart-outline"}
                size={28}
                color={isProductInWishlist ? "#FF3B30" : "#000"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={styles.headerButton}
            >
              <Ionicons name="ellipsis-vertical" size={26} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Store Prices</Text>

            <View style={styles.priceCard}>
              {prices.length === 0 ? (
                <Text style={styles.noPrices}>
                  No prices found for this product yet
                </Text>
              ) : (
                prices.map((item, index) => (
                  <View key={index} style={styles.priceRow}>
                    <View style={styles.storeInfo}>
                      <View style={styles.storeIcon}>
                        <Text style={styles.storeInitial}>
                          {item.store?.charAt(0) ||
                            item.name?.charAt(0) ||
                            "S"}
                        </Text>
                      </View>

                      <Text style={styles.location}>
                        {item.store || item.name || "Unknown Store"}
                      </Text>
                    </View>

                    <Text style={styles.price}>{item.price} SAR</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navButton} onPress={goToHome}>
            <Ionicons name="home-outline" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={goToAdd}>
            <Ionicons name="add-circle-outline" size={36} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={goToAccount}>
            <Ionicons name="person-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        <Modal
          transparent
          animationType="fade"
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setMenuVisible(false)}
          >
            <View style={styles.modalMenu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleReportIncorrectPrice}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#FF9800"
                />
                <Text style={styles.menuText}>Report Incorrect Price</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, styles.cancelMenuItem]}
                onPress={() => setMenuVisible(false)}
              >
                <Text style={styles.cancelMenuText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  headerButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  scrollContent: {
    paddingBottom: 140,
  },

  productName: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 60,
    marginHorizontal: 20,
    color: "#1A1A1A",
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 45,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 18,
  },

  priceCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    paddingHorizontal: 16,
    overflow: "hidden",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  storeIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8EEFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  storeInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3E5BBB",
  },

  location: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    flexShrink: 1,
  },

  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
  },

  noPrices: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    paddingVertical: 35,
  },

  bottomNav: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,

  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",

  backgroundColor: "#3E5BBB",

  paddingVertical: 12,
  paddingBottom: 16, // نفس الباقي

  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
},

  navButton: {
    paddingHorizontal: 30,
    paddingVertical: 8,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalMenu: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },

  cancelMenuItem: {
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 8,
  },

  cancelMenuText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    flex: 1,
  },
});