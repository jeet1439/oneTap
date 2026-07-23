import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../contexts/ThemeContext";
import app_header from "../asset/app_header.png";

const ScreenLayout = ({
  children,
  showHeader = true,
  showNotification = true,
  onNotificationPress,
  scrollable = true,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const content = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.contentContainer}>
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <View style={styles.container}>
        {showHeader && (
          <View style={styles.header}>
            
            <View>
              <Image
                source={app_header}
                style={styles.logo}
                resizeMode="contain"
              />

              <Text style={styles.tagline}>
                Connect with people around you
              </Text>
            </View>

            {/* Notification */}
            {showNotification && (
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="notifications-outline"
                  size={26}
                  color={colors.text}
                />
              </TouchableOpacity>
            )}

          </View>
        )}


        {content}

      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingBottom: 10,
      backgroundColor: colors.background,
    },

    logo: {
      width: 110,
      height: 50,
    },

    tagline: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 3,
    },

    notificationButton: {
      width: 48,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
    },

    scrollView: {
      flex: 1,
    },

    contentContainer: {
      paddingHorizontal: 18,
      paddingTop: 5,
      paddingBottom: 30,
      flexGrow: 1,
    },
  });

export default ScreenLayout;