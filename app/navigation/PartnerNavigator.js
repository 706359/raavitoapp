import { createNativeStackNavigator } from "@react-navigation/native-stack";
import KitchenRegisterScreen from "../screens/KitchenRegisterScreen";
import { PartnerLoginScreen } from "../screens/PartnerAuth";
import PartnerDashboard from "../screens/PartnerDashboard";

const Stack = createNativeStackNavigator();

export default function PartnerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='PartnerLogin'
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name='PartnerLogin' component={PartnerLoginScreen} />
      <Stack.Screen name='KitchenRegister' component={KitchenRegisterScreen} />
      <Stack.Screen name='PartnerDashboard' component={PartnerDashboard()} />
    </Stack.Navigator>
  );
}
