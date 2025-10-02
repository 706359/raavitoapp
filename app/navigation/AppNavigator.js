import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import SplashScreen from "../screens/SplashScreen";
import WelcomeScreen from "../screens/welcomeScreen"; // ✅ fixed casing
import AuthStack from "./AuthStack";
import ExtraStack from "./ExtraStacks";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const [showBrandingSplash, setShowBrandingSplash] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null); // null = still checking

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        // const value = await AsyncStorage.getItem('alreadyLaunched');
        const value = null; // ✅ preserved for controlled onboarding
        if (value === null) {
          await AsyncStorage.setItem("alreadyLaunched", "true");
          setIsFirstLaunch(true); // ✅ First launch
        } else {
          setIsFirstLaunch(false); // ✅ Returning user
        }
      } catch (err) {
        console.warn("AsyncStorage error:", err);
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();

    const timer = setTimeout(() => setShowBrandingSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isFirstLaunch === null || showBrandingSplash || loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* First launch → show Welcome screen */}
      {isFirstLaunch && !user && <Stack.Screen name='Welcome' component={WelcomeScreen} />}

      {/* Auth flow or Main app */}
      {!user ? (
        <Stack.Screen name='AuthStack' component={AuthStack} />
      ) : (
        <>
          <Stack.Screen name='MainTabs' component={MainTabs} />
          <Stack.Screen name='ExtraStack' component={ExtraStack} />
        </>
      )}
    </Stack.Navigator>
  );
}
