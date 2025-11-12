import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { axios_ } from "../../utils/utils"; // ensure path is correct

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load and verify token on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const role = await AsyncStorage.getItem("role");

        if (!token) {
          setLoading(false);
          return;
        }

        // attach token to axios headers
        axios_.defaults.headers.common.Authorization = `Bearer ${token}`;

        // verify token and fetch user info
        const { data } = await axios_.get("/auth/me").catch(() => ({ data: null }));
        if (data?.user) {
          setUser({
            id: data.user._id || data.user.id,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            mobile: data.user.mobile,
            role: data.user.role || role || "user",
            token,
          });
        } else {
          await AsyncStorage.multiRemove(["token", "role"]);
        }
      } catch (e) {
        console.log("Auth load error:", e);
        await AsyncStorage.multiRemove(["token", "role"]);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user and token at login
  const login = async (userData) => {
    try {
      setUser(userData);
      await AsyncStorage.multiSet([
        ["token", userData.token],
        ["role", userData.role || "user"],
      ]);
      axios_.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
    } catch (e) {
      console.log("Login save error:", e);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.multiRemove(["token", "role", "user"]);
      delete axios_.defaults.headers.common.Authorization;
    } catch (e) {
      console.log("Logout error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
