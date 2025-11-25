import CheckoutScreen from '../screens/CheckoutScreen';
import KitchenScreen from '../screens/KitchenScreen';
import ManageAddresses from '../screens/ManageAddresses';
import Notification from '../screens/Notification';
import OrderConfirmed from '../screens/OrderConfirmed';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import PaymentMethod from '../screens/PaymentMethod';
import PrivacySecurity from '../screens/PrivacySecurity';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import TermsConditions from '../screens/TermsConditions';
import UserProfile from '../screens/UserProfile';
import ForgotPassword from '../screens/ForgotPassword';
import ChangePassword from '../screens/ChangePassword';
import PremiumCartScreen from '../screens/CartScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function ExtraStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Checkout' component={CheckoutScreen} />
      <Stack.Screen name='OrderConfirmed' component={OrderConfirmed} />
      <Stack.Screen name='OrderTracking' component={OrderTrackingScreen} />
      <Stack.Screen name='UserProfile' component={UserProfile} />
      <Stack.Screen name='ManageAddresses' component={ManageAddresses} />
      <Stack.Screen name='PaymentMethod' component={PaymentMethod} />
      <Stack.Screen name='Notification' component={Notification} />
      <Stack.Screen name='PrivacySecurity' component={PrivacySecurity} />
      <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicy} />
      <Stack.Screen name='TermsConditions' component={TermsConditions} />
      <Stack.Screen name='KitchenScreen' component={KitchenScreen} />
      <Stack.Screen name='Cart' component={PremiumCartScreen} />
      <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
      <Stack.Screen name='ChangePassword' component={ChangePassword} />
    </Stack.Navigator>
  );
}
