import LoginScreen from '../screens/LoginScreen';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import TermsConditions from '../screens/TermsConditions';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={Register} />
      <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
      <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicy} />
      <Stack.Screen name='TermsConditions' component={TermsConditions} />
    </Stack.Navigator>
  );
}
