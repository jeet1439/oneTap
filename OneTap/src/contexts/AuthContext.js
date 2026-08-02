import React, { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("accessToken");
      const savedUser = await AsyncStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log("Load auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login / Save authentication data
  const loginUser = async (newToken, newUser) => {
    try {
      await AsyncStorage.setItem(
        "accessToken",
        newToken
      );

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(newUser)
      );

      setToken(newToken);
      setUser(newUser);

      return true;
    } catch (error) {
      console.log("Save auth error:", error);
      return false;
    }
  };

  // Logout
  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("user");

      setToken(null);
      setUser(null);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};