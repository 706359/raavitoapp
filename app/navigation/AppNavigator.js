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
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = null;
        if (value === null) {
          await AsyncStorage.setItem("alreadyLaunched", "true");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
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
      {isFirstLaunch && !user && <Stack.Screen name='Welcome' component={WelcomeScreen} />}

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
