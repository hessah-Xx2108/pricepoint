import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView as SafeAreaContext } from "react-native-safe-area-context";
import { api } from "../services/api";

export default function PriceSubmitted({ navigation, route }) {
  const {
    productName,
    price,
    store,
    GPS_Lat,
    GPS_Long,
    mainPhoto,
    secondPhoto,
    thirdPhoto,
  } = route.params || {};

  const [topPrices, setTopPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔥 navigation functions (موحدة)
  const goToHome = () => {
    navigation.navigate("BottomTabs", { screen: "Home" });
  };

  const goToAdd = () => {
    navigation.navigate("BottomTabs", { screen: "Add" });
  };

  const goToAccount = () => {
    navigation.navigate("BottomTabs", { screen: "Account" });
  };

  useEffect(() => {
    const submitAndLoadPrices = async () => {
       try {
      setLoading(true);

     
      if (!mainPhoto || !secondPhoto || !thirdPhoto) {
        Alert.alert(
          "Missing Photos",
          "You must upload 3 photos: product, price tag, and store."
        );

        setLoading(false);
        return;
      }


        const formData = new FormData();
        formData.append("GPS_Lat", GPS_Lat);
        formData.append("GPS_Long", GPS_Long);
        formData.append("Product_Name", productName);
        formData.append("Submitted_Price", price);
        formData.append("Store_Name", store);

        if (mainPhoto) {
          formData.append("main", {
            uri: mainPhoto,
            name: "main.jpg",
            type: "image/jpeg",
          });
        }

        if (secondPhoto) {
          formData.append("second", {
            uri: secondPhoto,
            name: "second.jpg",
            type: "image/jpeg",
          });
        }

        if (thirdPhoto) {
          formData.append("third", {
            uri: thirdPhoto,
            name: "third.jpg",
            type: "image/jpeg",
          });
        }

        const submitResponse = await api.submitPrice(formData);

        if (!submitResponse.success) {
          const message =
            submitResponse.message ||
            "You are not within the store location.";

          setErrorMessage(message);
          setSubmitted(false);
          setLoading(false);

          Alert.alert("Submission Failed", message);
          return;
        }

        setSubmitted(true);

        const pricesResponse = await api.getNearbyPricesByName(productName);

        if (pricesResponse.success) {
          setTopPrices(pricesResponse.prices || []);
        }
      } catch (error) {
        setErrorMessage("Something went wrong.");
        Alert.alert("Error", "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    submitAndLoadPrices();
  }, []);

  return (
    <SafeAreaContext style={styles.safeArea} edges={["top"]}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={26} color="black" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>
            {errorMessage ? "Submission Failed" : "🎉 Price Submitted!"}
          </Text>

          {/* Status */}
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : submitted ? (
            <Text style={styles.points}>
              Submission is pending admin review
            </Text>
          ) : (
            <Text style={styles.points}>Saving submission...</Text>
          )}

          {/* Prices */}
          <Text style={styles.sectionTitle}>Top 3 Lowest Prices:</Text>

          <View style={styles.cardContainer}>
            {loading ? (
              <ActivityIndicator
                color="#3E5BBB"
                style={{ marginVertical: 20 }}
              />
            ) : topPrices.length === 0 ? (
              <Text style={styles.emptyText}>
                No prices found for this product yet
              </Text>
            ) : (
              topPrices.map((item, index) => (
                <View key={index} style={styles.card}>
                  <View>
                    <Text style={styles.storeTitle}>
                      {index + 1}. {item.store}
                    </Text>
                    <Text style={styles.distance}>Same product</Text>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.price}>{item.price} SAR</Text>
                    <Text style={styles.status}>{item.status}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* View Full List */}
          <TouchableOpacity
            style={styles.fullListBtn}
            onPress={() =>
              navigation.navigate("FullPriceList", { productName })
            }
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              View Full Price List
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 🔵 Bottom Nav */}
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
    </SafeAreaContext>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },

  backButton: {
    paddingTop: 12,
    paddingBottom: 8,
    marginBottom: 5,
    alignSelf: "flex-start",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 5,
    textAlign: "center",
  },

  points: {
    color: "#2E7D32",
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },

  errorText: {
    color: "#D32F2F",
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 10,
  },

  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  storeTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  distance: {
    color: "#3E5BBB",
    marginTop: 3,
    fontSize: 12,
  },

  price: {
    fontWeight: "700",
    fontSize: 18,
    color: "#2E7D32",
  },

  status: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },

  emptyText: {
    textAlign: "center",
    color: "gray",
    paddingVertical: 20,
  },

  fullListBtn: {
    backgroundColor: "#3E5BBB",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    paddingBottom: 18,
    paddingTop: 18,
    backgroundColor: "#3E5BBB",
    borderTopWidth: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
});