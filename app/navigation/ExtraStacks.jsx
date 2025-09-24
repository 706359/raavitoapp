import CheckoutScreen from "@/screens/CheckoutScreen";
import OrderTrackingScreen from "@/screens/OrderTrackingScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function ExtraStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Checkout' component={CheckoutScreen} />
      <Stack.Screen name='OrderTracking' component={OrderTrackingScreen} />
    </Stack.Navigator>
  );
}
