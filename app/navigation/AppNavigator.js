// import { useAuth } from "@/context/AuthContext";
// import SplashScreen from "@/screens/SplashScreen";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { useEffect, useState } from "react";
// import AuthStack from "./AuthStack";
// import ExtraStack from "./ExtraStacks";
// import MainTabs from "./MainTabs";

// const Stack = createNativeStackNavigator();

// export default function AppNavigator() {
//   const { user, loading } = useAuth();
//   const [showBrandingSplash, setShowBrandingSplash] = useState(true);

//   useEffect(() => {
//     // Force branding splash at startup (3 sec minimum)
//     const timer = setTimeout(() => setShowBrandingSplash(false), 3000);
//     return () => clearTimeout(timer);
//   }, []);

//   // ✅ Branding splash at startup OR loader while fetching auth
//   if (showBrandingSplash || loading) {
//     return <SplashScreen />;
//   }

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {!user ? (
//         // 🔐 Not logged in → Auth stack
//         <Stack.Screen name='AuthStack' component={AuthStack} />
//       ) : (
//         <>
//           {/* ✅ Logged in → Main tabs */}
//           <Stack.Screen name='MainTabs' component={MainTabs} />

//           {/* 📦 Extra screens (checkout, tracking, etc.) */}
//           <Stack.Screen name='ExtraStack' component={ExtraStack} />
//         </>
//       )}
//     </Stack.Navigator>
//   );
// }

import { useAuth } from '@/context/AuthContext';
import SplashScreen from '@/screens/SplashScreen';
import WelcomeScreen from '@/screens/welcomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import AuthStack from './AuthStack';
import ExtraStack from './ExtraStacks';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const [showBrandingSplash, setShowBrandingSplash] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null); // null = checking

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true); // first launch
      } else {
        setIsFirstLaunch(false); // returning user
      }
    });

    const timer = setTimeout(() => setShowBrandingSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   AsyncStorage.getItem('alreadyLaunched').then((value) => {
  //     if (value == null) {
  //       AsyncStorage.setItem('alreadyLaunched', 'true');
  //       setIsFirstLaunch(true);
  //     } else {
  //       // TEMPORARY: Force first launch for testing
  //       setIsFirstLaunch(true); // <-- change false to true
  //     }
  //   });

  //   const timer = setTimeout(() => setShowBrandingSplash(false), 3000);
  //   return () => clearTimeout(timer);
  // }, []);

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
