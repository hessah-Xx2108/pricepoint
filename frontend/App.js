// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./screens/SplashScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import LoginScreen from "./screens/LoginScreen";
import MyWishlist from "./screens/MyWishlist";
import SettingsScreen from "./screens/SettingsScreen";
import BottomTabs from "./navigation/BottomTabs";
import Privacy from "./screens/Privacy";
import MyDetails from "./screens/MyDetails";
import Admin from './screens/Admin';
import AddProduct from './screens/AddProduct';
import DataExtraction from './screens/DataExtraction';
import AdminReviewDetail from './screens/AdminReviewDetail';
import PriceSubmitted from './screens/PriceSubmitted';
import FullPriceList from './screens/FullPriceList';
import MyVouchers from "./screens/MyVouchers";



import ProductDetails from "./screens/ProductDetails";
import { WishlistProvider } from "./context/WishlistContext"; 
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <WishlistProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* البداية */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* هنا لازم يكون bottom tabs */}
        <Stack.Screen name="BottomTabs" component={BottomTabs} />

        {/* صفحات إضافية خارج التابات */}
        <Stack.Screen name="MyWishlist" component={MyWishlist} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="MyDetails" component={MyDetails} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="DataExtraction" component={DataExtraction} />
        <Stack.Screen name="AdminReviewDetail" component={AdminReviewDetail} options={{ tabBarStyle: { display: 'none' }, headerShown: false }} />
         <Stack.Screen name="PriceSubmitted" component={PriceSubmitted} />
         <Stack.Screen name="FullPriceList" component={FullPriceList} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="MyVouchers" component={MyVouchers} />

      </Stack.Navigator>
    </NavigationContainer>
    </WishlistProvider>
  );
}
