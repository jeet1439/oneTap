import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import applogo from "../asset/applogo.png";
import { useTheme } from "../contexts/ThemeContext.js";

const SplashScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);


  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);
   


  return (
    <View style={styles.container}>
      {/* Simple Logo */}
      <View style={styles.logo}>
        <Image source={applogo} style={styles.logoImage} />
      </View>
      <Text style={styles.subtitle}>Everything in One Tap</Text>
      <Text style={styles.credits}>Made with ❤️ by jeet</Text>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },

    subtitle: {
      marginTop: 8,
      fontSize: 18,
      color: colors.white,
    },

    credits: {
      position: "absolute",
      bottom: 20,
      color: colors.textSecondary,
    },

    logo: {
      width: 90,
      height: 90,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },

    logoImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      resizeMode: "cover",
    },
  });

export default SplashScreen;
