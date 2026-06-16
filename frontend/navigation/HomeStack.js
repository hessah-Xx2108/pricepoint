import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Homepage from "../screens/Homepage";
import MyWishlist from "../screens/MyWishlist";
import AddProduct from "../screens/AddProduct";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Homepage" component={Homepage} />
      <Stack.Screen name="Wishlist" component={MyWishlist} />
      <Stack.Screen name="Addproduct" component={AddProduct} />

    </Stack.Navigator>
  );
}