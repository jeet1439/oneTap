import React from "react";
import { View, Text, StyleSheet, Image, FlatList} from "react-native";
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
            Passionate developer who loves building
            mobile applications and connecting with
            new people.
          </Text>
        </View>

      </View>

      <Text style={styles.sectionTitle}>
        Uploaded Images
      </Text>

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
      width: 100,
      height: 100,
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

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginTop: 30,
      marginBottom: 15,
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

export default ProfileScreen