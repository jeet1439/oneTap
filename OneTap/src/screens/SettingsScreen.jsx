import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import ScreenLayout from "../components/ScreenLayout";
import { useTheme } from "../contexts/ThemeContext";

const SettingsScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScreenLayout showNotification={false}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>

        <View style={styles.item}>
          <View style={styles.iconBox}>
            <Ionicons
              name={isDark ? "moon-outline" : "sunny-outline"}
              size={21}
              color={colors.primary}
            />
          </View>

          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Dark Mode</Text>
            <Text style={styles.itemSubtitle}>
              {isDark ? "Dark theme enabled" : "Use light theme"}
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: colors.border,
              true: colors.primary,
            }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.item}>
          <View style={styles.iconBox}>
            <Ionicons
              name="person-outline"
              size={21}
              color={colors.primary}
            />
          </View>

          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Edit Profile</Text>
            <Text style={styles.itemSubtitle}>
              Update your personal information
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <View style={styles.iconBox}>
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color={colors.primary}
            />
          </View>

          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Privacy</Text>
            <Text style={styles.itemSubtitle}>
              Manage your privacy settings
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons
          name="log-out-outline"
          size={20}
          color={colors.error}
        />

        <Text style={styles.logoutText}>
          Log Out
        </Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 25,
    },

    section: {
      marginBottom: 25,
    },

    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 10,
      textTransform: "uppercase",
    },

    item: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },

    itemContent: {
      flex: 1,
    },

    itemTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },

    itemSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 3,
    },

    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 15,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.error,
      marginTop: 10,
    },

    logoutText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.error,
      marginLeft: 8,
    },
  });

export default SettingsScreen;