import CheckoutScreen from '@/screens/CheckoutScreen';
import ManageAddresses from '@/screens/ManageAddresses';
import Notification from '@/screens/Notification';
import OrderTrackingScreen from '@/screens/OrderTrackingScreen';
import PaymentMethod from '@/screens/PaymentMethod';
import UserProfile from '@/screens/UserProfile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function ExtraStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Checkout' component={CheckoutScreen} />
      <Stack.Screen name='OrderTracking' component={OrderTrackingScreen} />
      <Stack.Screen name='UserProfile' component={UserProfile} />
      <Stack.Screen name='ManageAddresses' component={ManageAddresses} />
      <Stack.Screen name='PaymentMethod' component={PaymentMethod} />
      <Stack.Screen name='Notification' component={Notification} />
    </Stack.Navigator>
  );
}
