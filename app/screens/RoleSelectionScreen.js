import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { Button, Icon, Text, useTheme, VStack } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function RoleSelectionScreen({ navigation }) {
  const theme = useTheme();
  const { user } = useAuth();

  const handleSelection = async (choice) => {
    try {
      await AsyncStorage.setItem("selectedRole", choice);
    } catch (e) {
      console.warn("Could not save selectedRole", e);
    }

    const dest = choice === "admin" ? "AdminStack" : "MainTabs";

    try {
      // climb up to root navigator before resetting
      let targetNav = navigation;
      while (targetNav?.getParent && targetNav.getParent()) {
        targetNav = targetNav.getParent();
      }

      targetNav.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: dest }],
        })
      );
    } catch (err) {
      console.warn("Reset failed, falling back to navigate:", err);
      try {
        navigation.navigate(dest);
      } catch (e) {
        console.error("Navigate fallback failed:", e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <VStack space={6} alignItems='center' justifyContent='center' flex={1} px={6}>
        <Text fontFamily='Poppins' fontWeight='700' fontSize='2xl' color='brand.dark'>
          Welcome, {user?.firstName || "Admin"}
        </Text>
        <Text fontSize='md' color='coolGray.600' textAlign='center' mb={8}>
          Choose how you want to continue
        </Text>

        <Button
          w='70%'
          borderRadius='full'
          _linearGradient={{
            colors: [theme.colors.brand.orange, theme.colors.brand.green],
            start: [0, 0],
            end: [1, 1],
          }}
          leftIcon={<Icon as={Ionicons} name='person-circle-outline' color='white' size={6} />}
          onPress={() => handleSelection("user")}>
          Continue as User
        </Button>

        <Button
          w='70%'
          borderRadius='full'
          bg='brand.green'
          _pressed={{ opacity: 0.8 }}
          leftIcon={<Icon as={Ionicons} name='settings-outline' color='white' size={6} />}
          onPress={() => handleSelection("admin")}>
          Continue as Admin
        </Button>
      </VStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9F9F9" },
});
