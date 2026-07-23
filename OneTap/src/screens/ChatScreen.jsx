import React from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import ScreenLayout from "../components/ScreenLayout";
import { useTheme } from "../contexts/ThemeContext";

const chats = [
  {
    id: "1",
    name: "Alex Johnson",
    message: "Hey! Nice to meet you.",
    time: "10:30 AM",
    image: "https://i.pravatar.cc/150?img=1",
    unread: 2,
  },
  {
    id: "2",
    name: "Emma Wilson",
    message: "Are you nearby?",
    time: "09:45 AM",
    image: "https://i.pravatar.cc/150?img=5",
    unread: 1,
  },
  {
    id: "3",
    name: "David Lee",
    message: "Let's connect sometime!",
    time: "Yesterday",
    image: "https://i.pravatar.cc/150?img=8",
    unread: 0,
  },
  {
    id: "4",
    name: "Sophia Brown",
    message: "Thanks!",
    time: "Yesterday",
    image: "https://i.pravatar.cc/150?img=9",
    unread: 0,
  },
];

const ChatScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const renderChat = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.avatar}
      />

      <View style={styles.chatContent}>
        <View style={styles.topRow}>
          <Text style={styles.name}>
            {item.name}
          </Text>

          <Text style={styles.time}>
            {item.time}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text
            style={styles.message}
            numberOfLines={1}
          >
            {item.message}
          </Text>

          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {item.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout showNotification={false}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textSecondary}
        />

        <TextInput
          placeholder="Search conversations"
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChat}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />

    </ScreenLayout>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({

    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.inputBackground,
      borderRadius: 14,
      paddingHorizontal: 14,
      height: 48,
      marginBottom: 15,
    },

    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      marginLeft: 10,
    },

    chatItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    avatar: {
      width: 54,
      height: 54,
      borderRadius: 27,
    },

    chatContent: {
      flex: 1,
      marginLeft: 14,
    },

    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    bottomRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },

    name: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },

    time: {
      fontSize: 12,
      color: colors.textSecondary,
    },

    message: {
      flex: 1,
      fontSize: 13,
      color: colors.textSecondary,
      marginRight: 10,
    },

    unreadBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },

    unreadText: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.white,
    },
  });

export default ChatScreen;