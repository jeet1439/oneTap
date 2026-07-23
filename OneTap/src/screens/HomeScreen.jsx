import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme } from "../contexts/ThemeContext";
import app_header from '../asset/app_header.png';
import ScreenLayout from '../components/ScreenLayout';


const topPeople = [
  {
    id: "1",
    name: "Alex Johnson",
    about: "Android Developer",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Emma Wilson",
    about: "UI/UX Designer",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "3",
    name: "David Lee",
    about: "Backend Engineer",
    image: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: "4",
    name: "Sophia Brown",
    about: "React Native Developer",
    image: "https://i.pravatar.cc/150?img=9",
  },
] 
const gridPeople = [
  {
    id: "1",
    name: "Olivia",
    image: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "2",
    name: "James",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "3",
    name: "Charlotte",
    image: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "4",
    name: "Liam",
    image: "https://i.pravatar.cc/150?img=14",
  },
];

const HomeScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScreenLayout>
      {topPeople.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.avatar} />

          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.about}>{item.about}</Text>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Recommendation */}
      <Text style={[styles.heading, { marginTop: 15 }]}>
        Recommendation For You
      </Text>

      <FlatList
        data={gridPeople}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.gridCard}>
            <Image
              source={{ uri: item.image }}
              style={styles.gridAvatar}
            />

            <Text style={styles.gridName}>{item.name}</Text>

            <Text style={styles.gridAbout}>
              Lorem ipsum dolor.
            </Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>
                Connect
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScreenLayout>
  );
};

const createStyles = (colors) => 
StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  logo: {
    height: 50,
    width: 110
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

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
    elevation: 3,
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },

  about: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },

  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
  },

  buttonText: {
    color: colors.white,
    fontWeight: "700",
  },

  row: {
    justifyContent: "space-between",
  },

  gridCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },

  gridAvatar: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
  },

  gridName: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 12,
    color: colors.text,
  },

  gridAbout: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 5,
    marginBottom: 10,
  },
});

export default HomeScreen;

