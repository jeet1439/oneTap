import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";

import { useTheme } from "../contexts/ThemeContext.js";
import { useAuth } from "../contexts/AuthContext.js";

import applogo from "../asset/applogo.png";

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { loginUser } = useAuth();

  const styles = createStyles(colors);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert(
          "Missing Information",
          "Please enter email and password."
        );
        return;
      }

      setLoading(true);

      const response = await fetch(
        "http://192.168.0.101:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login Response:", data);

      if (!response.ok) {
        Alert.alert(
          "Login Failed",
          data.message || "Invalid email or password."
        );
        return;
      }

      if (data.success) {
        const token = data.token;
        const user = data.user;

        console.log("JWT Token:", token);

        console.log("Logged in User:", user);

        await loginUser(token, user);

        Alert.alert(
          "Success",
          "Login successful!"
        );
        navigation.replace("Main");
      }
    } catch (error) {
      console.log("Login Error:", error);

      Alert.alert(
        "Error",
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={applogo}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Welcome Back
      </Text>

      <TextInput
        placeholder="example@abc.com"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="******"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={[
          styles.loginButton,
          loading && { opacity: 0.6 },
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.signUpText}>
        Don't have an account?{" "}

        <Text
          onPress={() =>
            navigation.navigate("Signup")
          }
          style={{
            color: colors.primary,
          }}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      paddingHorizontal: 25,
    },

    logo: {
      height: 90,
      width: 90,
      alignSelf: "center",
      marginBottom: 50,
      borderRadius: 8,
    },

    title: {
      fontSize: 30,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },

    input: {
      backgroundColor: colors.primaryLight,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
      marginBottom: 18,
    },

    loginButton: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
    },

    loginText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "600",
    },

    signUpText: {
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 20,
    },
  });

export default LoginScreen;