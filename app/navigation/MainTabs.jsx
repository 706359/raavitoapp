import CartScreen from "@/screens/CartScreen";
import HomeScreen from "@/screens/HomeScreen";
import MenuScreen from "@/screens/MenuScreen";
import OrdersHistoryScreen from "@/screens/OrdersHistoryScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
