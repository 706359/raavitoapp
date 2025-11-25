import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { NativeBaseProvider } from 'native-base';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AddressProvider } from './app/context/AddressContext';
import { AuthProvider } from './app/context/AuthContext';
import { CartProvider } from './app/context/CartContext';
import { FavoritesProvider } from './app/context/FavoritesContext';
import { OrderProvider } from './app/context/OrderContext';
import { PaymentProvider } from './app/context/PaymentContext';
import AppNavigator from './app/navigation/AppNavigator';
import './patches/fixBackhandler';
import theme from './theme';

function App() {
  useEffect(() => {
    // Hide native splash screen immediately when app loads
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Splash screen hide error:', e);
      }
    };
    hideSplash();
  }, []);

  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme}>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <AddressProvider>
                <PaymentProvider>
                  <FavoritesProvider>
                    {/* Only one NavigationContainer */}
                    <NavigationContainer>
                      <AppNavigator />
                    </NavigationContainer>
                  </FavoritesProvider>
                </PaymentProvider>
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
