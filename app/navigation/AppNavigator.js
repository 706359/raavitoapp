import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens (we’ll create these one by one)
import CartScreen from "@/screens/CartScreen";
import HomeScreen from "@/screens/HomeScreen";
import LoginScreen from "@/screens/LoginScreen";
import MenuScreen from "@/screens/MenuScreen";
import OrdersHistoryScreen from "@/screens/OrdersHistoryScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import SplashScreen from "@/screens/SplashScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Menu") iconName = "restaurant-outline";
          else if (route.name === "Cart") iconName = "cart-outline";
          else if (route.name === "Orders") iconName = "list-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Menu' component={MenuScreen} />
      <Tab.Screen name='Cart' component={CartScreen} />
      <Tab.Screen name='Orders' component={OrdersHistoryScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Splash' component={SplashScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Main' component={MainTabs} />
    </Stack.Navigator>
  );
}
