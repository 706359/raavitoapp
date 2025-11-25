import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PremiumCartScreen from "../screens/CartScreen";
import OrderTrackingScreen from "../screens/OrderTrackingScreen";
import OrdersHistoryScreen from "../screens/OrdersHistoryScreen";

const Stack = createNativeStackNavigator();

export default function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='OrdersHistory' component={OrdersHistoryScreen} />
      <Stack.Screen name='OrderTracking' component={OrderTrackingScreen} />
      <Stack.Screen name='Cart' component={PremiumCartScreen} />
    </Stack.Navigator>
  );
}

