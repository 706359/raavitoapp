// import { createContext, useContext, useState } from 'react';

// const CartContext = createContext();

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState([]);

//   const addToCart = (item) => {
//     setCart((prev) => {
//       const existing = prev.find((i) => i.id === item.id);
//       if (existing) {
//         return prev.map((i) => (i.id === item.id ? { ...i, qty: (i.qty || 1) + 1 } : i));
//       }
//       return [...prev, { ...item, qty: 1 }];
//     });
//   };

//   const removeFromCart = (id) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   const clearCart = () => setCart([]);

//   const getTotal = () => cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotal }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error('useCart must be used inside CartProvider');
//   return ctx;
// };

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 🔹 Load saved cart from AsyncStorage on app start
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    };
    loadCart();
  }, []);

  // 🔹 Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
    };
    if (cart.length >= 0) saveCart();
  }, [cart]);

  // -------------------------
  // Cart functions
  // -------------------------
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: (i.qty || 1) + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max((i.qty || 1) - 1, 0) } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const removeOneFromCart = (id) => decreaseQty(id);

  const clearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem('cart'); // also clear from storage
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQty,
        removeOneFromCart,
        removeFromCart,
        clearCart,
        getTotal,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
