import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useWishlist } from "../context/WishlistContext";
import { api } from "../services/api";

export default function FullPriceList({ navigation, route }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const { searchTerm, productName } = route.params || {};
  const initialSearch = searchTerm || productName || "";

  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const goToHome = () => {
    navigation.navigate("BottomTabs", { screen: "Home" });
  };

  const goToAdd = () => {
    navigation.navigate("BottomTabs", { screen: "Add" });
  };

  const goToAccount = () => {
    navigation.navigate("BottomTabs", { screen: "Account" });
  };

  const loadPrices = async () => {
    if (!initialSearch.trim()) return;

    try {
      setLoading(true);
      const response = await api.getNearbyPricesByName(initialSearch);

      if (response.success) {
        setProducts(response.prices || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("FULL PRICE LIST ERROR:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPrices();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Full Price List</Text>

          <Text style={styles.results}>
            Approved prices for "{initialSearch}"
          </Text>

          {loading ? (
            <ActivityIndicator
              color="#3E5BBB"
              size="large"
              style={{ marginTop: 40 }}
            />
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {products.length === 0 ? (
                <Text style={styles.empty}>
                  No approved prices found
                </Text>
              ) : (
                products.map((item, index) => {
                  const wishlistItem = {
                    name: item.productName,
                    priceRange: `${item.price} SAR`,
                    store: item.store,
                  };

                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.card}
                      onPress={() =>
                        navigation.navigate("ProductDetails", {
                          product: {
                            name: item.productName,
                            minPrice: Number(item.price),
                            maxPrice: Number(item.price),
                            storeCount: 1,
                            rating: 0,
                          },
                          prices: [
                            {
                              store: item.store,
                              price: item.price,
                            },
                          ],
                        })
                      }
                    >
                      <View>
                        <Text style={styles.name}>
                          {item.productName}
                        </Text>
                        <Text style={styles.store}>
                          {item.store}
                        </Text>
                        <Text style={styles.status}>
                          {item.status}
                        </Text>
                      </View>

                      <View style={styles.rightBox}>
                        <Text style={styles.price}>
                          {item.price} SAR
                        </Text>

                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            isInWishlist(wishlistItem.name)
                              ? removeFromWishlist(wishlistItem.name)
                              : addToWishlist(wishlistItem);
                          }}
                        >
                          <Ionicons
                            name={
                              isInWishlist(wishlistItem.name)
                                ? "heart"
                                : "heart-outline"
                            }
                            size={22}
                            color={
                              isInWishlist(wishlistItem.name)
                                ? "red"
                                : "#999"
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          )}
        </View>

        {/* 🔵 Bottom Nav */}
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={goToHome}>
            <Ionicons name="home-outline" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={goToAdd}>
            <Ionicons
              name="add-circle-outline"
              size={28}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={goToAccount}>
            <Ionicons
              name="person-outline"
              size={28}
              color="white"
            />
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
  },

  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  results: {
    color: "#666",
    marginBottom: 15,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  card: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontWeight: "600",
    fontSize: 16,
  },

  store: {
    color: "#3E5BBB",
    marginTop: 4,
  },

  status: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },

  rightBox: {
    alignItems: "flex-end",
  },

  price: {
    color: "green",
    fontWeight: "700",
    fontSize: 16,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
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