import EditProfileScreen from "@/screens/EditProfile";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "../screens/CartScreen";
import FAQ from "../screens/FAQ";
import Favourites from "../screens/Favourites";
import Help from "../screens/Help";
import HomeScreen from "../screens/HomeScreen";
import KitchenScreen from "../screens/KitchenScreen";
import ManageAddresses from "../screens/ManageAddresses";
import MenuScreen from "../screens/MenuScreen";
import OrdersHistoryScreen from "../screens/OrdersHistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Subscription from "../screens/Subscription";
import Wallet from "../screens/Wallet";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 👉 Stack for Home flow
function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='HomeScreen' component={HomeScreen} />
      <Stack.Screen name='KitchenScreen' component={KitchenScreen} />
    </Stack.Navigator>
  );
}

// 👉 Stack for Menu flow
function MenuStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='MenuScreen' component={MenuScreen} />
      <Stack.Screen name='KitchenScreen' component={KitchenScreen} />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Profile' component={ProfileScreen} />
      <Stack.Screen name='EditProfile' component={EditProfileScreen} />
      <Stack.Screen name='Subscription' component={Subscription} />
      <Stack.Screen name='ManageAddresses' component={ManageAddresses} />
      <Stack.Screen name='Favourites' component={Favourites} />
      <Stack.Screen name='Help' component={Help} />
      <Stack.Screen name='FAQ' component={FAQ} />
      <Stack.Screen name='Wallet' component={Wallet} />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#b95a01ff",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";
          if (route.name === "HomeTab") iconName = "home-outline";
          else if (route.name === "MenuTab") iconName = "restaurant-outline";
          else if (route.name === "Cart") iconName = "cart-outline";
          else if (route.name === "Orders") iconName = "list-outline";
          else if (route.name === "ProfileTab") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name='HomeTab' component={HomeStackNavigator} options={{ title: "Home" }} />
      <Tab.Screen name='MenuTab' component={MenuStackNavigator} options={{ title: "Kitchen" }} />
      <Tab.Screen name='Cart' component={CartScreen} />
      <Tab.Screen name='Orders' component={OrdersHistoryScreen} />
      {/* <Tab.Screen name='Profile' component={ProfileScreen} /> */}
      <Tab.Screen
        name='ProfileTab'
        component={ProfileStackNavigator}
        options={{ title: "Account" }}
      />
    </Tab.Navigator>
  );
}
