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

// context/CartContext.js
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: (i.qty || 1) + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // decrease quantity by 1; if qty becomes 0, remove item
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max((i.qty || 1) - 1, 0) } : i))
        .filter((i) => i.qty > 0),
    );
  };

  // remove a single item entirely from cart (trash)
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // alias if you want a function that only removes one qty (kept for clarity)
  const removeOneFromCart = (id) => decreaseQty(id);

  const clearCart = () => setCart([]);

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
