import React, { useEffect } from "react";

import { View, Text, StyleSheet, Image, ActivityIndicator} from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

import applogo from "../asset/applogo.png";

const SplashScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const { user, token, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (token && user) {
      navigation.replace("Main");
    } else {
      navigation.replace("Login");
    }
  }, [ isLoading, token, user, navigation]);

  return (
    <View
      style={[
        styles.container, { backgroundColor: colors.primary}]}
    >
      <Image source={applogo} style={styles.logo}/>

      <Text
        style={[ styles.title,{ color: colors.white, fontFamily: "Roboto-Bold"}]}
      >
        OneTap
      </Text>

      <ActivityIndicator size="large" color={colors.white} style={styles.loader}/>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  loader: {
    marginTop: 30,
  },
});