// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import EditProfileScreen from "../screens/EditProfile";
// import { KitchenRegisterScreen, PartnerLoginScreen } from "../screens/PartnerAuth";
// import PartnerDashboardScreen from "../screens/PartnerDashboard";
// import ProfileScreen from "../screens/ProfileScreen";
// import SplashScreen from "../screens/SplashScreen";
// import WelcomeScreen from "../screens/welcomeScreen";
// import AuthStack from "./AuthStack";
// import ExtraStack from "./ExtraStacks";
// import MainTabs from "./MainTabs";
// import PartnerNavigator from "./PartnerNavigator";

// const Stack = createNativeStackNavigator();

// export default function AppNavigator() {
//   const { user, loading } = useAuth();
//   const [showBrandingSplash, setShowBrandingSplash] = useState(true);
//   const [isFirstLaunch, setIsFirstLaunch] = useState(null);

//   useEffect(() => {
//     const checkFirstLaunch = async () => {
//       try {
//         const value = await AsyncStorage.getItem("alreadyLaunched");
//         if (value === null) {
//           await AsyncStorage.setItem("alreadyLaunched", "true");
//           setIsFirstLaunch(true);
//         } else {
//           setIsFirstLaunch(false);
//         }
//       } catch (err) {
//         console.warn("AsyncStorage error:", err);
//         setIsFirstLaunch(false);
//       }
//     };

//     checkFirstLaunch();
//     const timer = setTimeout(() => setShowBrandingSplash(false), 3000);
//     return () => clearTimeout(timer);
//   }, []);

//   if (isFirstLaunch === null || showBrandingSplash || loading) return <SplashScreen />;

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {isFirstLaunch && !user && <Stack.Screen name='Welcome' component={WelcomeScreen} />}

//       {!user ? (
//         <>
//           <Stack.Screen name='AuthStack' component={AuthStack} />

//           <Stack.Screen name='Partner' component={PartnerNavigator} />
//           <Stack.Screen name='PartnerLogin' component={PartnerLoginScreen} />
//           <Stack.Screen name='KitchenRegister' component={KitchenRegisterScreen} />
//         </>
//       ) : (
//         <>
//           {user.role === "partner" ? (
//             <Stack.Screen name='PartnerDashboard' component={PartnerDashboardScreen} />
//           ) : (
//             <>
//               <Stack.Screen name='MainTabs' component={MainTabs} />
//               <Stack.Screen name='ExtraStack' component={ExtraStack} />
//               <Stack.Screen name='UserProfile' component={ProfileScreen} />
//               <Stack.Screen name='EditProfile' component={EditProfileScreen} />
//             </>
//           )}
//         </>
//       )}
//     </Stack.Navigator>
//   );
// }

//==============With Admin Role======================//

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// Screens
import AdminDashboard from "../screens/AdminDashboard"; // ✅ Admin dashboard screen
import EditProfileScreen from "../screens/EditProfile";
import KitchenRegisterScreen from "../screens/KitchenRegisterScreen";
import { PartnerLoginScreen } from "../screens/PartnerAuth";
import PartnerDashboardScreen from "../screens/PartnerDashboard";
import ProfileScreen from "../screens/ProfileScreen";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";
import SplashScreen from "../screens/SplashScreen";
import WelcomeScreen from "../screens/welcomeScreen";

// Navigation stacks
import AuthStack from "./AuthStack";
import ExtraStack from "./ExtraStacks";
import MainTabs from "./MainTabs";
import PartnerNavigator from "./PartnerNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const [showBrandingSplash, setShowBrandingSplash] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  // Detect first launch + splash timer
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem("alreadyLaunched");
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
    const timer = setTimeout(() => setShowBrandingSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Wait for splash or loading
  if (isFirstLaunch === null || showBrandingSplash || loading) {
    return <SplashScreen />;
  }

  // ======================== LOGGED OUT FLOW ========================
  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch && <Stack.Screen name='Welcome' component={WelcomeScreen} />}
        <Stack.Screen name='AuthStack' component={AuthStack} />
        <Stack.Screen name='Partner' component={PartnerNavigator} />
        <Stack.Screen name='PartnerLogin' component={PartnerLoginScreen} />
        <Stack.Screen name='KitchenRegister' component={KitchenRegisterScreen} />
      </Stack.Navigator>
    );
  }

  // ======================== LOGGED IN FLOW ========================
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user.role === "admin" ? (
        <>
          {/* Admin Role Selection - First Screen */}
          <Stack.Screen name='RoleSelection' component={RoleSelectionScreen} />

          {/* Admin Dashboard */}
          <Stack.Screen name='AdminStack' component={AdminDashboard} />

          {/* User Screens - Admin can access these too */}
          <Stack.Screen name='MainTabs' component={MainTabs} />
          <Stack.Screen name='ExtraStack' component={ExtraStack} />
          <Stack.Screen name='UserProfile' component={ProfileScreen} />
          <Stack.Screen name='EditProfile' component={EditProfileScreen} />
        </>
      ) : user.role === "partner" ? (
        <Stack.Screen name='PartnerDashboard' component={PartnerDashboardScreen} />
      ) : (
        <>
          {/* Regular User Screens */}
          <Stack.Screen name='MainTabs' component={MainTabs} />
          <Stack.Screen name='ExtraStack' component={ExtraStack} />
          <Stack.Screen name='UserProfile' component={ProfileScreen} />
          <Stack.Screen name='EditProfile' component={EditProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
