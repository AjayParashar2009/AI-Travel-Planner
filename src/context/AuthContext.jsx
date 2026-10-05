import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authAPI } from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEYS_TO_CLEAR = [
  "token",
  "user",
  "wander_token",
  "wander_user",
  "wanderer_token",
  "wanderer_user",
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // INITIALIZE AUTH
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Read token from localStorage
        const token = localStorage.getItem("wander_token");

        // Read stored user
        const storedUser = localStorage.getItem("wander_user");

        // If we have stored user, load it immediately
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Invalid stored user data");
            localStorage.removeItem("wander_user");
          }
        }

        // Verify token with backend
        if (token) {
          try {
            const { data } = await authAPI.getMe();

            setUser(data.user);

            localStorage.setItem("wander_user", JSON.stringify(data.user));
          } catch (error) {
            console.error("Session expired or invalid");

            setUser(null);

            localStorage.removeItem("wander_token");
            localStorage.removeItem("wander_user");
          }
        }
      } catch (error) {
        console.error("Authentication initialization failed:", error);
        setUser(null);
      } finally {
        // VERY IMPORTANT
        setLoading(false);
      }
    };

    const syncAuth = (e) => {
      if (e.key === "wander_token" && !e.newValue) {
        setUser(null);
        window.location.href = "/login";
      }
    };

    window.addEventListener("storage", syncAuth);

    initializeAuth();

    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  // CLEAR OLD STORAGE
  const clearLegacyStorage = useCallback(() => {
    STORAGE_KEYS_TO_CLEAR.forEach((key) => {
      localStorage.removeItem(key);
    });
  }, []);

  // LOGIN
  const handleLogin = useCallback(
    async (email, password) => {
      const { data } = await authAPI.login({
        email,
        password,
      });

      clearLegacyStorage();

      localStorage.setItem("wander_token", data.token);
      localStorage.setItem("wander_user", JSON.stringify(data.user));

      setUser(data.user);

      return data;
    },
    [clearLegacyStorage],
  );

  // REGISTER
  const handleRegister = useCallback(
    async (formdata) => {
      const { data } = await authAPI.register(formdata);

      clearLegacyStorage();

      localStorage.setItem("wander_token", data.token);
      localStorage.setItem("wander_user", JSON.stringify(data.user));

      setUser(data.user);

      return data;
    },
    [clearLegacyStorage],
  );

  // LOGOUT
  const handleLogout = useCallback(() => {
    clearLegacyStorage();
    setUser(null);
    window.location.href = "/login";
  }, [clearLegacyStorage]);

  // CONTEXT VALUE
  const authValue = useMemo(
    () => ({
      user,
      loading,

      setLoading,

      register: handleRegister,
      login: handleLogin,
      logout: handleLogout,

      isAuthenticated: !!user,

      isPro: user?.plan === "pro",

      currency: user?.currency || "INR",
    }),
    [user, loading, handleRegister, handleLogin, handleLogout],
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
