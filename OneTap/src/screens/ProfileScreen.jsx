import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import ScreenLayout from "../components/ScreenLayout";
import { useTheme } from "../contexts/ThemeContext";

const uploadedImages = [
  {
    id: "1",
    image: "https://picsum.photos/300/300?random=1",
  },
  {
    id: "2",
    image: "https://picsum.photos/300/300?random=2",
  },
  {
    id: "3",
    image: "https://picsum.photos/300/300?random=3",
  },
  {
    id: "4",
    image: "https://picsum.photos/300/300?random=4",
  },
  {
    id: "5",
    image: "https://picsum.photos/300/300?random=5",
  },
  {
    id: "6",
    image: "https://picsum.photos/300/300?random=6",
  },
];

const ProfileScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const totalFriends = 128;
  const totalFriendRequests = 5;
  const totalViews = 1.2;

  const handleUploadImage = () => {
    console.log("Upload image pressed");
  };

  return (
    <ScreenLayout showNotification={false}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: "https://i.pravatar.cc/300?img=12",
          }}
          style={styles.profileImage}
        />

        {/* Name + About */}
        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            Jeet Banik
          </Text>
          <Text style={styles.about}>
            lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          </Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalFriends}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalFriendRequests}</Text>
          <Text style={styles.statLabel}>Requests</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalViews}k</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>
          Uploaded Images
        </Text>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={handleUploadImage}
          activeOpacity={0.7}
        >
          <Ionicons name="camera-outline" size={18} color={colors.background} />
          <Text style={styles.uploadBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={uploadedImages}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image }}
            style={styles.uploadedImage}
          />
        )}
      />
    </ScreenLayout>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({

    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
    },

    profileImage: {
      width: 75,
      height: 75,
      borderRadius: 50,
    },

    profileInfo: {
      flex: 1,
      marginLeft: 20,
    },

    name: {
      fontSize: 23,
      fontWeight: "700",
      color: colors.text,
    },
    about: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
      marginTop: 8,
    },

    statsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card || colors.surface,
      borderRadius: 14,
      paddingVertical: 14,
      marginTop: 0,
    },

    statItem: {
      flex: 1,
      alignItems: "center",
    },

    statDivider: {
      width: 1,
      height: 28,
      backgroundColor: colors.border || colors.textSecondary,
      opacity: 0.3,
    },

    statNumber: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },

    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },

    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 30,
      marginBottom: 15,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },

    uploadBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary || colors.text,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
      gap: 6,
    },

    uploadBtnText: {
      color: colors.background,
      fontSize: 13,
      fontWeight: "600",
    },

    row: {
      justifyContent: "space-between",
      marginBottom: 8,
    },

    uploadedImage: {
      width: "31.5%",
      aspectRatio: 1,
      borderRadius: 12,
    },

  });

export default ProfileScreen;