import React, { createContext, useContext, useState } from "react";
import { Appearance } from "react-native";

const lightTheme = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryLight: "#DBEAFE",

  background: "#FFFFFF",
  card: "#F8FAFC",

  text: "#0F172A",
  textSecondary: "#64748B",

  border: "#E2E8F0",

  success: "#22C55E",
  error: "#EF4444",
  warning: "#F59E0B",

  white: "#FFFFFF",
  black: "#000000",

  inputBackground: "#F1F5F9",
};

const darkTheme = {
  primary: "#3B82F6",
  primaryDark: "#2563EB",
  primaryLight: "#60A5FA",

  background: "#0F172A",
  card: "#1E293B",

  text: "#FFFFFF",
  textSecondary: "#CBD5E1",

  border: "#334155",

  success: "#22C55E",
  error: "#EF4444",
  warning: "#F59E0B",

  white: "#FFFFFF",
  black: "#000000",

  inputBackground: "#1E293B",
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = Appearance.getColorScheme() === "dark";

  const [isDark, setIsDark] = useState(systemTheme);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        colors,
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook
export const useTheme = () => {
  return useContext(ThemeContext);
};