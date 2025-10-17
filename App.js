import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AddressProvider } from "./app/context/AddressContext";
import { AuthProvider } from "./app/context/AuthContext";
import { CartProvider } from "./app/context/CartContext";
import { OrderProvider } from "./app/context/OrderContext";
import AppNavigator from "./app/navigation/AppNavigator";
import "./patches/fixBackhandler";
import theme from "./theme";

function App() {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme}>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <AddressProvider>
                {/* Only one NavigationContainer */}
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </AddressProvider>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

export default App;
registerRootComponent(App);
