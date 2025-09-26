import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/screens/SplashScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AuthStack from "./AuthStack";
import ExtraStack from "./ExtraStacks";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const [showBrandingSplash, setShowBrandingSplash] = useState(true);

  useEffect(() => {
    // Force branding splash at startup (3 sec minimum)
    const timer = setTimeout(() => setShowBrandingSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Branding splash at startup OR loader while fetching auth
  if (showBrandingSplash || loading) {
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
