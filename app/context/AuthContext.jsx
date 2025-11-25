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
        const savedUser = await AsyncStorage.getItem("user");

        if (!token) {
          setLoading(false);
          return;
        }

        // attach token to axios headers immediately
        axios_.defaults.headers.common.Authorization = `Bearer ${token}`;

        // verify token and fetch user info
        try {
          const { data } = await axios_.get("/auth/me");
          if (data?.user) {
            const userData = {
              id: data.user._id || data.user.id,
              _id: data.user._id || data.user.id,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              mobile: data.user.mobile,
              email: data.user.email,
              role: data.user.role || role || "user",
              token,
              address: data.user.address,
              profileImage: data.user.profileImage,
            };
            setUser(userData);
            // Save user data for offline access
            await AsyncStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Token invalid, clear storage
            await AsyncStorage.multiRemove(["token", "role", "user"]);
            delete axios_.defaults.headers.common.Authorization;
          }
        } catch (authError) {
          // Token is invalid/expired - clear everything
          console.log("Token verification failed on startup:", authError?.response?.status || authError?.message);
          await AsyncStorage.multiRemove(["token", "role", "user"]);
          delete axios_.defaults.headers.common.Authorization;
          setUser(null);
        }
      } catch (e) {
        console.log("Auth load error:", e);
        // Don't clear storage on general errors, just log
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user and token at login
  const login = async (userData) => {
    try {
      const fullUserData = {
        ...userData,
        id: userData.id || userData._id,
        _id: userData._id || userData.id,
      };
      setUser(fullUserData);
      await AsyncStorage.multiSet([
        ["token", userData.token],
        ["role", userData.role || "user"],
        ["user", JSON.stringify(fullUserData)],
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
