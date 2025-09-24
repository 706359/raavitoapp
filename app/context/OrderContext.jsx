import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders on app start
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const saved = await AsyncStorage.getItem("orders");
        if (saved) setOrders(JSON.parse(saved));
      } catch (e) {
        console.log("Order load error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Save orders when changed
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem("orders", JSON.stringify(orders)).catch((e) =>
        console.log("Order save error:", e)
      );
    }
  }, [orders, loading]);

  const addOrder = (order) => {
    setOrders((prev) => [
      ...prev,
      { ...order, createdAt: new Date().toISOString() },
    ]);
  };

  const clearOrders = async () => {
    setOrders([]);
    await AsyncStorage.removeItem("orders");
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, clearOrders, loading }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
};
