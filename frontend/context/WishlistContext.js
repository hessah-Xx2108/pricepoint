// context/WishlistContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from storage on app start
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const saved = await AsyncStorage.getItem("wishlist");
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } catch (error) {
      console.log("Error loading wishlist:", error);
    }
  };

  const saveWishlist = async (items) => {
    try {
      await AsyncStorage.setItem("wishlist", JSON.stringify(items));
    } catch (error) {
      console.log("Error saving wishlist:", error);
    }
  };

  const addToWishlist = (product) => {
    // Check if product already exists
    const exists = wishlistItems.some((item) => item.name === product.name);
    
    if (!exists) {
      const newWishlist = [...wishlistItems, { ...product, id: Date.now() }];
      setWishlistItems(newWishlist);
      saveWishlist(newWishlist);
      return true; // Added successfully
    }
    return false; // Already exists
  };

  const removeFromWishlist = (productName) => {
    const newWishlist = wishlistItems.filter((item) => item.name !== productName);
    setWishlistItems(newWishlist);
    saveWishlist(newWishlist);
  };

  const isInWishlist = (productName) => {
    return wishlistItems.some((item) => item.name === productName);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}