/* eslint-disable import/no-unresolved */
import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import AppNavigator from "@/navigation/AppNavigator";
import theme from "./theme"; // 👈 brand kit theme.js

function App() {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme}>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
