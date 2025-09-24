import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/screens/SplashScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import ExtraStack from "./ExtraStacks";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // 🔐 Not logged in → Auth stack
        <Stack.Screen name='AuthStack' component={AuthStack} />
      ) : (
        <>
          {/* ✅ Logged in → Main tabs */}
          <Stack.Screen name='MainTabs' component={MainTabs} />

          {/* 📦 Extra screens (checkout, tracking, etc.) */}
          <Stack.Screen name='ExtraStack' component={ExtraStack} />
        </>
      )}
    </Stack.Navigator>
  );
}
