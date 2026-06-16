import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeStack from "./HomeStack";
import AddProduct from "../screens/AddProduct";
import Account from "../screens/Account";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,              // 👈 Increased from 65 to 80
          paddingBottom: 18,      // 👈 Increased from 10 to 18 (more bottom space)
          paddingTop: 18,         // 👈 Increased from 10 to 18 (more top space)
          backgroundColor: "#3E5BBB",
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={28}
              color="white"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Add"
        component={AddProduct}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={28}
              color="white"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={28}
              color="white"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}