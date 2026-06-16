// screens/MyWishlist.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useWishlist } from "../context/WishlistContext";

export default function MyWishlist({ navigation }) {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const goToHome = () => {
    navigation.navigate("BottomTabs", { screen: "Home" });
  };

  const goToAdd = () => {
    navigation.navigate("BottomTabs", { screen: "Add" });
  };

  const goToAccount = () => {
    navigation.navigate("BottomTabs", { screen: "Account" });
  };

  const renderWishlistItem = ({ item }) => {
    const itemPrice = parseFloat(item.priceRange) || parseFloat(item.price) || 0;

    return (
      <TouchableOpacity
        style={styles.wishlistCard}
        onPress={() =>
          navigation.navigate("ProductDetails", {
            product: {
              name: item.name || item.productName || "Unknown Product",
              minPrice: itemPrice,
              maxPrice: itemPrice,
              storeCount: item.store ? 1 : 0,
              rating: item.rating || 0,
            },
            prices: item.store
              ? [
                  {
                    store: item.store,
                    price: itemPrice,
                  },
                ]
              : [],
          })
        }
      >
        <View style={styles.cardContent}>
          <Text style={styles.productName}>
            {item.name || item.productName || "Unknown Product"}
          </Text>

          <Text style={styles.priceRange}>
            {item.priceRange || `${itemPrice} SAR`}
          </Text>

          <Text style={styles.storeCount}>
            {item.storesNearby ||
              (item.store ? `Available at ${item.store}` : "No store saved")}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromWishlist(item.name || item.productName)}
        >
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const EmptyWishlist = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart-outline" size={70} color="#ccc" />
        </View>

        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>

        <Text style={styles.emptyDescription}>
          To add a product here, tap the heart icon on any product page.
        </Text>

        <TouchableOpacity style={styles.discoverButton} onPress={goToHome}>
          <Text style={styles.discoverButtonText}>Discover Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.header}>
            {wishlistItems.length === 0
              ? "My Wishlist"
              : `My Wishlist (${wishlistItems.length})`}
          </Text>

          {wishlistItems.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <FlatList
              data={wishlistItems}
              renderItem={renderWishlistItem}
              keyExtractor={(item, index) =>
                item.id?.toString() ||
                item.name ||
                item.productName ||
                index.toString()
              }
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
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

  content: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 100,
  },

  header: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    color: "#1A1A1A",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  wishlistCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  cardContent: {
    flex: 1,
  },

  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  priceRange: {
    marginTop: 4,
    fontWeight: "600",
    color: "#2E7D32",
    fontSize: 14,
  },

  storeCount: {
    color: "#3E5BBB",
    marginTop: 4,
    fontSize: 12,
  },

  removeButton: {
    padding: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    marginTop: -100,
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },

  emptyDescription: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },

  discoverButton: {
    backgroundColor: "#3E5BBB",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },

  discoverButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
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